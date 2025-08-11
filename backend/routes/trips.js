const express = require('express');
const router = express.Router();
const axios = require('axios');
const travelService = require('../utils/travelService');
const { searchCities } = require('../data/indianCities');
require('dotenv').config({ path: './config.env' });

// Google Maps API configuration
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Helper function to get estimated directions
function getEstimatedDirections(origin, destination, waypoints) {
  const cityDistances = {
    'Mumbai': { 'Delhi': 1400, 'Bangalore': 1000, 'Chennai': 1300, 'Kolkata': 2000 },
    'Delhi': { 'Mumbai': 1400, 'Bangalore': 1800, 'Chennai': 1700, 'Kolkata': 1300 },
    'Bangalore': { 'Mumbai': 1000, 'Delhi': 1800, 'Chennai': 350, 'Kolkata': 1800 },
    'Chennai': { 'Mumbai': 1300, 'Delhi': 1700, 'Bangalore': 350, 'Kolkata': 1600 },
    'Kolkata': { 'Mumbai': 2000, 'Delhi': 1300, 'Bangalore': 1800, 'Chennai': 1600 }
  };

  const originCity = origin.split(',')[0].trim();
  const destCity = destination.split(',')[0].trim();

  let distance = 1000; // Default distance
  if (cityDistances[originCity] && cityDistances[originCity][destCity]) {
    distance = cityDistances[originCity][destCity];
  }

  // Estimate duration based on distance (assuming average speed of 60 km/h)
  const durationHours = Math.ceil(distance / 60);
  const durationMinutes = Math.round((distance % 60) / 60 * 60);

  return {
    distance: `${distance} km`,
    duration: `${durationHours}h ${durationMinutes}m`,
    totalDistance: distance * 1000, // Convert to meters
    totalDuration: durationHours * 3600 + durationMinutes * 60, // Convert to seconds
    steps: [
      {
        instruction: `Drive from ${originCity} to ${destCity}`,
        distance: `${distance} km`,
        duration: `${durationHours}h ${durationMinutes}m`
      }
    ],
    overview_polyline: null,
    waypoint_order: []
  };
}

// Search for places (autocomplete) - Enhanced with Google Places API
router.get('/search-places', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 1) {
      return res.json({ places: [] });
    }

    try {
      // Try Google Places API first
      if (GOOGLE_MAPS_API_KEY) {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
          {
            params: {
              input: query,
              key: GOOGLE_MAPS_API_KEY,
              types: 'geocode',
              components: 'country:in',
              language: 'en'
            }
          }
        );

        if (response.data.predictions && response.data.predictions.length > 0) {
          const places = response.data.predictions.map(prediction => ({
            place_id: prediction.place_id,
            description: prediction.description,
            main_text: prediction.structured_formatting?.main_text || '',
            secondary_text: prediction.structured_formatting?.secondary_text || '',
            types: prediction.types || []
          }));
          return res.json({ places });
        }
      }
    } catch (error) {
      console.log('Google Places API failed, using fallback:', error.message);
    }

    // Use comprehensive Indian cities data for fallback
    const matchedCities = searchCities(query);
    
    // Sort by relevance (exact matches first, then partial matches)
    const sortedCities = matchedCities.sort((a, b) => {
      const aCityLower = a.city.toLowerCase();
      const bCityLower = b.city.toLowerCase();
      const queryLower = query.toLowerCase();
      
      const aStartsWith = aCityLower.startsWith(queryLower);
      const bStartsWith = bCityLower.startsWith(queryLower);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      return aCityLower.localeCompare(bCityLower);
    });

    const places = sortedCities.slice(0, 25).map(city => ({
      place_id: city.fullName.replace(/\s+/g, '_').toLowerCase(),
      description: city.fullName,
      main_text: city.city,
      secondary_text: `${city.state}, India`,
      types: ['locality', 'political']
    }));

    res.json({ places });
  } catch (error) {
    console.error('Error searching places:', error);
    res.status(500).json({ message: 'Failed to search places' });
  }
});

// Get place details with coordinates
router.get('/place-details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;

    if (placeId.includes('_') && !placeId.includes('ChI')) {
      // This is a fallback place ID, return basic info
      const cityName = placeId.replace(/_/g, ' ');
      return res.json({
        name: cityName.split(',')[0],
        address: cityName,
        location: null,
        photos: [],
        types: ['locality', 'political'],
        place_id: placeId
      });
    }

    // Return basic place information
    res.json({
      name: placeId,
      address: placeId,
      location: null,
      photos: [],
      types: ['locality', 'political'],
      place_id: placeId
    });
  } catch (error) {
    console.error('Error getting place details:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to get place details' });
  }
});

// Get detailed directions with waypoints
router.get('/directions', async (req, res) => {
  try {
    const { origin, destination, waypoints } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination are required' });
    }

    // Use estimated directions
    const estimatedData = getEstimatedDirections(origin, destination, waypoints);
    return res.json({
      ...estimatedData,
      message: 'Using estimated route data'
    });
  } catch (error) {
    console.error('Error getting directions:', error.response?.data || error.message);

    // Return fallback data instead of error - always return 200 status
    const estimatedData = getEstimatedDirections(origin, destination, waypoints);
    return res.json({
      ...estimatedData,
      message: 'Route calculation failed, using estimated data'
    });
  }
});

// Search for attractions near multiple places
router.get('/attractions', async (req, res) => {
  try {
    const { locations, radius = 50000 } = req.query;

    if (!locations) {
      return res.status(400).json({ message: 'Locations are required' });
    }

    const locationArray = Array.isArray(locations) ? locations : [locations];
    let allAttractions = [];

    for (const location of locationArray) {
      try {
        const attractions = await travelService.getAttractions(location, radius);
        allAttractions.push(...attractions);
      } catch (error) {
        console.log(`Error fetching attractions for ${location}:`, error.message);
      }
    }

    // Remove duplicates and sort by rating
    const uniqueAttractions = allAttractions.filter((attraction, index, self) =>
      index === self.findIndex(a => a.id === attraction.id)
    ).sort((a, b) => b.rating - a.rating);

    res.json({ attractions: uniqueAttractions.slice(0, 15) });
  } catch (error) {
    console.error('Error searching attractions:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to search attractions' });
  }
});

// Get real-time transportation options
router.get('/transport-options', async (req, res) => {
  try {
    const { origin, destination, date, travelers = 1 } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({ message: 'Origin, destination, and date are required' });
    }

    const [flights, trains, buses] = await Promise.all([
      travelService.getFlightPrices(origin, destination, date, null, travelers),
      travelService.getTrainPrices(origin, destination, date),
      travelService.getBusPrices(origin, destination, date)
    ]);

    res.json({
      flights,
      trains,
      buses,
      summary: {
        cheapestFlight: flights.length > 0 ? Math.min(...flights.map(f => f.price)) : null,
        cheapestTrain: trains.length > 0 ? Math.min(...trains.map(t => t.price)) : null,
        cheapestBus: buses.length > 0 ? Math.min(...buses.map(b => b.price)) : null
      }
    });
  } catch (error) {
    console.error('Error getting transport options:', error);
    res.status(500).json({ message: 'Failed to get transport options' });
  }
});

// Get real-time hotel options
router.get('/hotel-options', async (req, res) => {
  try {
    const { location, checkIn, checkOut, adults = 1, rooms = 1 } = req.query;

    if (!location || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Location, check-in, and check-out dates are required' });
    }

    const hotels = await travelService.getHotelPrices(location, checkIn, checkOut, adults, rooms);

    res.json({
      hotels,
      summary: {
        totalHotels: hotels.length,
        priceRange: {
          min: Math.min(...hotels.map(h => h.price)),
          max: Math.max(...hotels.map(h => h.price))
        },
        averageRating: hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length
      }
    });
  } catch (error) {
    console.error('Error getting hotel options:', error);
    res.status(500).json({ message: 'Failed to get hotel options' });
  }
});

// Generate comprehensive travel packages with real-time data
router.post('/generate-packages', async (req, res) => {
  try {
    const { startPlace, endPlace, stops, startDate, endDate, travelers, budget, tripType } = req.body;

    if (!startPlace || !endPlace || !startDate || !endDate) {
      return res.status(400).json({ message: 'Start place, end place, start date, and end date are required' });
    }

    // Use the comprehensive travel service
    const result = await travelService.getTravelPackage(
      startPlace,
      endPlace,
      stops || [],
      startDate,
      endDate,
      travelers || 1,
      budget,
      tripType || 'leisure'
    );

    res.json(result);
  } catch (error) {
    console.error('Error generating packages:', error);
    res.status(500).json({ message: 'Failed to generate packages' });
  }
});

// Get real-time weather for travel planning
router.get('/weather/:location', async (req, res) => {
  try {
    const { location } = req.params;

    // This would integrate with a weather API like OpenWeatherMap
    // For now, returning mock data
    const weatherData = {
      location,
      current: {
        temperature: Math.floor(Math.random() * 30) + 15, // 15-45°C
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5 // 5-25 km/h
      },
      forecast: Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        high: Math.floor(Math.random() * 15) + 25, // 25-40°C
        low: Math.floor(Math.random() * 10) + 15, // 15-25°C
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)]
      }))
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Error getting weather:', error);
    res.status(500).json({ message: 'Failed to get weather data' });
  }
});

// Get travel tips and recommendations
router.get('/travel-tips/:destination', async (req, res) => {
  try {
    const { destination } = req.params;

    // Mock travel tips - in production, this would come from a content API
    const tips = {
      destination,
      general: [
        'Best time to visit: October to March',
        'Local currency: Indian Rupee (INR)',
        'Language: English and local languages',
        'Visa: Check requirements based on your nationality'
      ],
      accommodation: [
        'Book hotels in advance during peak season',
        'Consider homestays for authentic experience',
        'Check for amenities like WiFi and AC',
        'Read recent reviews before booking'
      ],
      transportation: [
        'Use local transport for short distances',
        'Book trains in advance (IRCTC)',
        'Consider domestic flights for long distances',
        'Use ride-sharing apps in major cities'
      ],
      food: [
        'Try local street food (ensure hygiene)',
        'Drink bottled water',
        'Sample regional specialties',
        'Check for vegetarian options'
      ],
      activities: [
        'Visit historical monuments early morning',
        'Book guided tours for better experience',
        'Respect local customs and dress codes',
        'Carry necessary permits for restricted areas'
      ]
    };

    res.json(tips);
  } catch (error) {
    console.error('Error getting travel tips:', error);
    res.status(500).json({ message: 'Failed to get travel tips' });
  }
});

module.exports = router;
