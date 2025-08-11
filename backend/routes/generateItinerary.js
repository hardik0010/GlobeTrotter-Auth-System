const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config({ path: './config.env' });
const { getLocationAttractions, getUniquePlaces } = require('../utils/googlePlaces');

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

/**
 * Generate a dynamic itinerary using Google Places API data
 * @param {Array} cities - Array of cities to visit
 * @param {number} totalDays - Total number of days
 * @returns {Promise<Object>} - Generated itinerary
 */
async function generateDynamicItinerary(cities, totalDays) {
  const trip = [];
  const usedPlaces = [];
  let cityIndex = 0;

  // Pre-fetch attractions for all cities to optimize performance
  console.log('Pre-fetching attractions for all cities...');
  const cityAttractions = {};

  for (const city of cities) {
    try {
      const attractions = await getLocationAttractions(city, 10);
      cityAttractions[city] = attractions;
      console.log(`✅ Found ${attractions.length} attractions for ${city}`);
    } catch (error) {
      console.log(`⚠️ Failed to get attractions for ${city}:`, error.message);
      cityAttractions[city] = [];
    }
  }

  for (let day = 1; day <= totalDays; day++) {
    const currentCity = cities[cityIndex] || cities[cities.length - 1];
    const attractions = cityAttractions[currentCity] || [];

    if (attractions.length > 0) {
      // Get unique places avoiding duplicates
      const uniquePlaces = getUniquePlaces(attractions, usedPlaces, 3);

      // Convert places to activities
      const activities = uniquePlaces.map((place, index) => {
        const times = ['09:00 AM', '11:30 AM', '03:00 PM'];
        const category = place.types?.[0]?.replace(/_/g, ' ') || 'Tourist Attraction';

        // Add to used places to avoid duplicates
        usedPlaces.push(place.name);

        // Determine cost based on price level
        let cost = '₹200';
        if (place.price_level === 1) cost = '₹100';
        else if (place.price_level === 2) cost = '₹300';
        else if (place.price_level === 3) cost = '₹500';
        else if (place.price_level === 4) cost = '₹800';

        return {
          name: place.name,
          time: times[index] || '02:00 PM',
          description: `${category} in ${currentCity}. ${place.opening_hours ? 'Check opening hours before visiting.' : 'A popular destination for visitors.'}`,
          cost: cost,
          category: category,
          rating: place.rating,
          latitude: place.location.latitude,
          longitude: place.location.longitude,
          photo_url: place.photo_url,
          address: place.location.address,
          website: place.website,
          phone: place.phone,
          opening_hours: place.opening_hours
        };
      });

      trip.push({
        day,
        location: currentCity,
        activities: activities
      });

      // Move to next city every 2-3 days or at the end
      if (day % Math.max(2, Math.floor(totalDays / cities.length)) === 0 && cityIndex < cities.length - 1) {
        cityIndex++;
      }

    } else {
      console.log(`No attractions found for ${currentCity}, using basic activities`);

      // Fallback activities for the city
      const fallbackActivities = [
        {
          name: `${currentCity} City Tour`,
          time: '09:00 AM',
          description: `Explore the main attractions of ${currentCity}`,
          cost: '₹200',
          category: 'Tourist Attraction'
        },
        {
          name: `${currentCity} Local Market`,
          time: '11:30 AM',
          description: `Experience local culture and shopping in ${currentCity}`,
          cost: '₹150',
          category: 'Shopping'
        },
        {
          name: `${currentCity} Historical Site`,
          time: '03:00 PM',
          description: `Visit important historical landmarks in ${currentCity}`,
          cost: '₹100',
          category: 'Monument'
        }
      ];

      trip.push({
        day,
        location: currentCity,
        activities: fallbackActivities
      });
    }
  }

  return { totalDays, trip };
}

/**
 * Call Gemini API to generate intelligent itinerary
 * @param {string} prompt - The prompt for Gemini
 * @returns {Promise<Object>} - Parsed JSON response from Gemini
 */
async function callGemini(prompt) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2000
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    // Extract text content from Gemini response
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!text) {
      throw new Error("No textual output found from Gemini: " + JSON.stringify(json).slice(0, 500));
    }

    // Parse JSON from Gemini response
    const cleaned = text.trim();
    const firstBrace = cleaned.indexOf("{");
    const firstBracket = cleaned.indexOf("[");

    let jsonStr;
    if (firstBracket >= 0 && (firstBracket < firstBrace || firstBrace === -1)) {
      jsonStr = cleaned.slice(firstBracket);
    } else if (firstBrace >= 0) {
      jsonStr = cleaned.slice(firstBrace);
    } else {
      throw new Error("No JSON structure found in Gemini response");
    }

    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (err) {
    console.error("Gemini API call error:", err);
    throw err;
  }
}



/**
 * Calculate trip duration in days from start and end dates
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {number} - Number of days
 */
function calculateTripDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format. Use YYYY-MM-DD');
  }

  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

  if (days <= 0) {
    throw new Error('End date must be after start date');
  }

  return days;
}

/**
 * Generate itinerary endpoint
 * POST /api/itinerary/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { startPlace, endPlace, stops = [], startDate, endDate } = req.body;

    // Validate required fields
    if (!startPlace || !endPlace || !startDate || !endDate) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "startPlace, endPlace, startDate, and endDate are required"
      });
    }

    // Calculate trip duration
    let totalDays;
    try {
      totalDays = calculateTripDuration(startDate, endDate);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid dates",
        message: error.message
      });
    }

    // Get all unique cities for the trip
    const allCities = [startPlace, ...stops, endPlace].filter((city, index, arr) =>
      arr.indexOf(city) === index && city.trim() !== ''
    );

    console.log(`Generating itinerary for ${totalDays} days: ${allCities.join(' → ')}`);

    // Generate dynamic itinerary using Google Places API data
    let itineraryResponse;
    try {
      console.log('Generating dynamic itinerary with Google Places data...');
      itineraryResponse = await generateDynamicItinerary(allCities, totalDays);
      console.log('✅ Dynamic itinerary generated successfully');
    } catch (error) {
      console.log('⚠️ Dynamic generation failed, using basic itinerary');
      console.log('Error:', error.message);

      // Fallback to basic itinerary
      itineraryResponse = {
        totalDays,
        trip: allCities.map((city, index) => ({
          day: index + 1,
          location: city,
          activities: [
            {
              name: `${city} City Tour`,
              time: '09:00 AM',
              description: `Explore the main attractions of ${city}`,
              cost: '₹200',
              category: 'Tourist Attraction'
            },
            {
              name: `${city} Local Market`,
              time: '11:30 AM',
              description: `Experience local culture and shopping in ${city}`,
              cost: '₹150',
              category: 'Shopping'
            },
            {
              name: `${city} Historical Site`,
              time: '03:00 PM',
              description: `Visit important historical landmarks in ${city}`,
              cost: '₹100',
              category: 'Monument'
            }
          ]
        }))
      };
    }

    // Return successful response
    res.json({
      totalDays,
      trip: itineraryResponse.trip,
      source: 'google_places'
    });

  } catch (error) {
    console.error('Itinerary generation error:', error);
    res.status(500).json({
      error: "itinerary_generation_failed",
      message: "Failed to generate itinerary. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
