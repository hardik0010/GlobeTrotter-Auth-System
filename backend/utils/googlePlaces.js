require('dotenv').config({ path: './config.env' });

/**
 * Get coordinates for a location using Google Geocoding API
 * @param {string} address - The address/location to geocode
 * @returns {Promise<Object>} - Object with latitude and longitude
 */
async function getCoordinates(address) {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured');
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(geocodeUrl);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error(`Geocoding failed for ${address}: ${data.status}`);
    }

    const location = data.results[0].geometry.location;
    return {
      latitude: location.lat,
      longitude: location.lng,
      formatted_address: data.results[0].formatted_address
    };
  } catch (error) {
    console.error(`Geocoding error for ${address}:`, error.message);
    throw error;
  }
}

/**
 * Search for tourist attractions near coordinates using Google Places API
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {number} radius - Search radius in meters (default: 5000)
 * @param {number} limit - Maximum number of results (default: 5)
 * @returns {Promise<Array>} - Array of place objects
 */
async function searchNearbyAttractions(latitude, longitude, radius = 5000, limit = 5) {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured');
    }

    const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=tourist_attraction&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(nearbyUrl);

    if (!response.ok) {
      throw new Error(`Places API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API failed: ${data.status}`);
    }

    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Sort by rating (highest first) and limit results
    const sortedResults = data.results
      .filter(place => place.rating) // Only include places with ratings
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);

    return sortedResults;
  } catch (error) {
    console.error(`Places API error for ${latitude},${longitude}:`, error.message);
    throw error;
  }
}

/**
 * Get detailed information about a place using Google Places API
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} - Detailed place information
 */
async function getPlaceDetails(placeId) {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured');
    }

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,rating,opening_hours,photos,types,website,formatted_phone_number&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(detailsUrl);

    if (!response.ok) {
      throw new Error(`Place Details API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Place Details API failed: ${data.status}`);
    }

    return data.result;
  } catch (error) {
    console.error(`Place Details API error for ${placeId}:`, error.message);
    throw error;
  }
}

/**
 * Get photo URL for a place using Google Place Photos API
 * @param {string} photoReference - Photo reference from place details
 * @param {number} maxWidth - Maximum width of the photo (default: 400)
 * @returns {string} - Photo URL
 */
function getPlacePhotoUrl(photoReference, maxWidth = 400) {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return null;
  }

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
}

/**
 * Get comprehensive place information for a location
 * @param {string} locationName - Name of the location
 * @param {number} limit - Maximum number of attractions to return (default: 5)
 * @returns {Promise<Array>} - Array of detailed place objects
 */
async function getLocationAttractions(locationName, limit = 5) {
  try {
    // Step 1: Get coordinates
    console.log(`Getting coordinates for ${locationName}...`);
    const coords = await getCoordinates(locationName);

    // Step 2: Search for nearby attractions
    console.log(`Searching for attractions near ${locationName}...`);
    const attractions = await searchNearbyAttractions(coords.latitude, coords.longitude, 5000, limit);

    if (attractions.length === 0) {
      console.log(`No attractions found for ${locationName}`);
      return [];
    }

    // Step 3: Get detailed information for each attraction
    console.log(`Getting details for ${attractions.length} attractions in ${locationName}...`);
    const detailedAttractions = await Promise.all(
      attractions.map(async (attraction) => {
        try {
          const details = await getPlaceDetails(attraction.place_id);

          // Get photo URL if available
          let photoUrl = null;
          if (details.photos && details.photos.length > 0) {
            photoUrl = getPlacePhotoUrl(details.photos[0].photo_reference);
          }

          return {
            name: details.name || attraction.name,
            place_id: attraction.place_id,
            location: {
              latitude: attraction.geometry.location.lat,
              longitude: attraction.geometry.location.lng,
              address: details.formatted_address || attraction.vicinity
            },
            rating: details.rating || attraction.rating,
            types: details.types || attraction.types,
            opening_hours: details.opening_hours?.weekday_text || null,
            website: details.website || null,
            phone: details.formatted_phone_number || null,
            photo_url: photoUrl,
            price_level: attraction.price_level || null
          };
        } catch (error) {
          console.log(`Failed to get details for ${attraction.name}:`, error.message);
          // Return basic attraction info if details fail
          return {
            name: attraction.name,
            place_id: attraction.place_id,
            location: {
              latitude: attraction.geometry.location.lat,
              longitude: attraction.geometry.location.lng,
              address: attraction.vicinity
            },
            rating: attraction.rating,
            types: attraction.types,
            opening_hours: null,
            website: null,
            phone: null,
            photo_url: null,
            price_level: attraction.price_level || null
          };
        }
      })
    );

    return detailedAttractions;
  } catch (error) {
    console.error(`Error getting attractions for ${locationName}:`, error.message);
    // Return fallback attractions when Google API fails
    return getFallbackAttractions(locationName, limit);
  }
}

/**
 * Get fallback attractions when Google API is not available
 * @param {string} locationName - Name of the location
 * @param {number} limit - Maximum number of attractions to return
 * @returns {Array} - Array of fallback attraction objects
 */
function getFallbackAttractions(locationName, limit = 5) {
  console.log(`Using fallback attractions for ${locationName}`);

  const fallbackAttractions = {
    'Ahmedabad': [
      { name: 'Sabarmati Ashram', rating: 4.5, types: ['tourist_attraction', 'museum'], price_level: 1 },
      { name: 'Adalaj Stepwell', rating: 4.3, types: ['tourist_attraction', 'historic'], price_level: 1 },
      { name: 'Sidi Saiyyed Mosque', rating: 4.2, types: ['tourist_attraction', 'mosque'], price_level: 1 },
      { name: 'Kankaria Lake', rating: 4.1, types: ['tourist_attraction', 'park'], price_level: 2 },
      { name: 'Calico Museum of Textiles', rating: 4.4, types: ['tourist_attraction', 'museum'], price_level: 2 }
    ],
    'Hyderabad': [
      { name: 'Charminar', rating: 4.4, types: ['tourist_attraction', 'historic'], price_level: 1 },
      { name: 'Golconda Fort', rating: 4.3, types: ['tourist_attraction', 'fort'], price_level: 2 },
      { name: 'Hussain Sagar Lake', rating: 4.2, types: ['tourist_attraction', 'lake'], price_level: 1 },
      { name: 'Salar Jung Museum', rating: 4.5, types: ['tourist_attraction', 'museum'], price_level: 2 },
      { name: 'Qutb Shahi Tombs', rating: 4.1, types: ['tourist_attraction', 'historic'], price_level: 1 }
    ],
    'Mumbai': [
      { name: 'Gateway of India', rating: 4.5, types: ['tourist_attraction', 'monument'], price_level: 1 },
      { name: 'Marine Drive', rating: 4.3, types: ['tourist_attraction', 'scenic'], price_level: 1 },
      { name: 'Juhu Beach', rating: 4.2, types: ['tourist_attraction', 'beach'], price_level: 1 },
      { name: 'Colaba Causeway', rating: 4.0, types: ['tourist_attraction', 'shopping'], price_level: 2 },
      { name: 'Elephanta Caves', rating: 4.4, types: ['tourist_attraction', 'historic'], price_level: 2 }
    ],
    'Delhi': [
      { name: 'Red Fort', rating: 4.4, types: ['tourist_attraction', 'fort'], price_level: 2 },
      { name: 'Qutub Minar', rating: 4.3, types: ['tourist_attraction', 'monument'], price_level: 2 },
      { name: 'India Gate', rating: 4.2, types: ['tourist_attraction', 'monument'], price_level: 1 },
      { name: 'Chandni Chowk', rating: 4.1, types: ['tourist_attraction', 'market'], price_level: 2 },
      { name: 'Humayun\'s Tomb', rating: 4.5, types: ['tourist_attraction', 'historic'], price_level: 2 }
    ],
    'Manali': [
      { name: 'Hadimba Temple', rating: 4.4, types: ['tourist_attraction', 'temple'], price_level: 1 },
      { name: 'Solang Valley', rating: 4.3, types: ['tourist_attraction', 'valley'], price_level: 2 },
      { name: 'Rohtang Pass', rating: 4.2, types: ['tourist_attraction', 'mountain'], price_level: 2 },
      { name: 'Mall Road', rating: 4.1, types: ['tourist_attraction', 'shopping'], price_level: 2 },
      { name: 'Manu Temple', rating: 4.0, types: ['tourist_attraction', 'temple'], price_level: 1 }
    ]
  };

  const attractions = fallbackAttractions[locationName] || fallbackAttractions['Mumbai'];

  return attractions.slice(0, limit).map((attraction, index) => ({
    name: attraction.name,
    place_id: `fallback_${locationName}_${index}`,
    location: {
      latitude: null,
      longitude: null,
      address: `${attraction.name}, ${locationName}`
    },
    rating: attraction.rating,
    types: attraction.types,
    opening_hours: null,
    website: null,
    phone: null,
    photo_url: null,
    price_level: attraction.price_level
  }));
}

/**
 * Get unique places avoiding duplicates
 * @param {Array} allPlaces - Array of all place objects
 * @param {Array} usedPlaces - Array of already used place names
 * @param {number} count - Number of unique places to return
 * @returns {Array} - Array of unique places
 */
function getUniquePlaces(allPlaces, usedPlaces = [], count = 3) {
  const uniquePlaces = allPlaces.filter(place =>
    !usedPlaces.some(used =>
      used.toLowerCase().includes(place.name.toLowerCase()) ||
      place.name.toLowerCase().includes(used.toLowerCase())
    )
  );

  return uniquePlaces.slice(0, count);
}

module.exports = {
  getCoordinates,
  searchNearbyAttractions,
  getPlaceDetails,
  getPlacePhotoUrl,
  getLocationAttractions,
  getFallbackAttractions,
  getUniquePlaces
};
