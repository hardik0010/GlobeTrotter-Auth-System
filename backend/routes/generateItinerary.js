const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config({ path: './config.env' });

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

async function callGemini(prompt) {
  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`, {
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
          maxOutputTokens: 800
        }
      }),
    });
    const json = await res.json();
    
    // Try to find text content in common response shapes
    const text = 
      json?.candidates?.[0]?.content?.parts?.[0]?.text ||
      json?.output?.[0]?.content?.[0]?.text ||
      json?.content?.[0]?.text ||
      json?.response || 
      json?.text ||
      null;

    if (!text) {
      throw new Error("No textual output found from Gemini: " + JSON.stringify(json).slice(0, 1000));
    }

    // Attempt to parse JSON embedded in text
    const cleaned = text.trim();
    const firstBrace = cleaned.indexOf("{");
    const firstBracket = cleaned.indexOf("[");
    const jsonStr =
      firstBracket >= 0 && (firstBracket < firstBrace || firstBrace === -1)
        ? cleaned.slice(firstBracket)
        : firstBrace >= 0
        ? cleaned.slice(firstBrace)
        : cleaned;

    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (err) {
    console.error("Gemini call / parse error:", err);
    throw err;
  }
}

async function enrichWithFoursquare(activityName, city) {
  try {
    const searchUrl = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(
      activityName
    )}&near=${encodeURIComponent(city)}&limit=1`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        Authorization: process.env.FOURSQUARE_API_KEY,
        Accept: "application/json",
      },
    });
    if (!searchRes.ok) {
      console.warn("Foursquare search failed", await searchRes.text());
      return null;
    }
    const searchJson = await searchRes.json();
    const place = searchJson.results && searchJson.results[0];
    if (!place) return null;

    const fsq_id = place.fsq_id || place.fsqId || place.id;
    // attempt to extract coordinates
    const latitude = place.geocodes?.main?.latitude ?? place.location?.lat ?? null;
    const longitude = place.geocodes?.main?.longitude ?? place.location?.lng ?? null;
    const rating = place.rating ?? null;

    // fetch photos
    let imageUrl = null;
    if (fsq_id) {
      try {
        const photosRes = await fetch(`https://api.foursquare.com/v3/places/${fsq_id}/photos`, {
          headers: {
            Authorization: process.env.FOURSQUARE_API_KEY,
            Accept: "application/json",
          },
        });
        if (photosRes.ok) {
          const photosJson = await photosRes.json();
          if (Array.isArray(photosJson) && photosJson.length > 0) {
            const p = photosJson[0];
            // Foursquare photo object usually has prefix & suffix to build URL
            if (p.prefix && p.suffix) {
              imageUrl = `${p.prefix}original${p.suffix}`;
            } else if (p.url) {
              imageUrl = p.url;
            }
          }
        }
      } catch (e) {
        console.warn("Foursquare photos fetch error", e);
      }
    }

    return {
      imageUrl,
      latitude,
      longitude,
      rating,
      fsq_id,
    };
  } catch (e) {
    console.error("enrichWithFoursquare error", e);
    return null;
  }
}

// Fallback mock itinerary loader
async function loadMockItinerary() {
  return [
    {
      day: 1,
      city: "Sample City",
      activities: [
        {
          name: "Sample Attraction",
          time: "09:00 AM",
          description: "This is a sample activity.",
          cost: "₹0",
        },
      ],
    },
  ];
}

// Generate itinerary endpoint
router.post('/generate', async (req, res) => {
  try {
    const { startPlace, endPlace, stops = [], startDate, endDate } = req.body;

    if (!startPlace || !endPlace || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Build Gemini prompt
    const prompt = `
You are a travel planner AI. Given a start location, end location, trip dates, and optional stops, create a JSON itinerary.
Return ONLY JSON (no additional text).
Format: an array of day objects.
Each day object:
- day: integer
- date: "YYYY-MM-DD" (optional)
- city: string
- activities: array of objects { name, time, description, cost }

Start: ${startPlace}
End: ${endPlace}
Stops: ${Array.isArray(stops) ? stops.join(", ") : stops}
Dates: ${startDate} to ${endDate}
Rules:
- Provide 2 to 3 activities per day.
- Aim for realistic pacing and travel times.
- Include approximate cost strings (e.g., "₹200" or "$10").
`;

    let geminiOutput;
    try {
      geminiOutput = await callGemini(prompt);
    } catch (e) {
      console.warn("Gemini failed, falling back to mock itinerary", e);
      const fallback = await loadMockItinerary();
      return res.json({ itinerary: fallback });
    }

    // Validate parsed structure is an array
    if (!Array.isArray(geminiOutput)) {
      console.warn("Gemini returned unexpected structure", geminiOutput);
      const fallback = await loadMockItinerary();
      return res.json({ itinerary: fallback });
    }

    // Enrich each activity with Foursquare data (parallel when possible)
    const enriched = [];
    for (const day of geminiOutput) {
      const activities = [];
      for (const act of day.activities ?? []) {
        const enrichment = await enrichWithFoursquare(act.name, day.city || startPlace);
        activities.push({
          ...act,
          imageUrl: enrichment?.imageUrl ?? null,
          latitude: enrichment?.latitude ?? null,
          longitude: enrichment?.longitude ?? null,
          rating: enrichment?.rating ?? null,
        });
      }
      enriched.push({
        day: day.day,
        date: day.date,
        city: day.city,
        activities,
      });
    }

    res.json({ itinerary: enriched });
  } catch (err) {
    console.error("generateItinerary error:", err);
    // final fallback to mock
    const fallback = await loadMockItinerary();
    res.status(500).json({ itinerary: fallback, error: "server_error" });
  }
});

module.exports = router;
