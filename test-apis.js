const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testData = {
  startPlace: 'Mumbai, Maharashtra, India',
  endPlace: 'Delhi, India',
  startDate: '2024-02-15',
  endDate: '2024-02-20',
  travelers: 2,
  budget: 'comfort',
  tripType: 'leisure'
};

async function testAPI(endpoint, method = 'GET', data = null, params = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    if (params) {
      config.params = params;
    }

    const response = await axios(config);
    console.log(`✅ ${endpoint}: Success`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Data Type: ${typeof response.data}`);
    if (typeof response.data === 'object') {
      console.log(`   Keys: ${Object.keys(response.data).join(', ')}`);
    }
    return response.data;
  } catch (error) {
    console.log(`❌ ${endpoint}: Failed`);
    console.log(`   Error:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing GlobeTrotter Real-Time APIs\n');

  // Test 1: Place Search
  console.log('1. Testing Place Search API...');
  await testAPI('/trips/search-places', 'GET', null, { query: 'mumbai' });

  // Test 2: Transport Options
  console.log('\n2. Testing Transport Options API...');
  await testAPI('/trips/transport-options', 'GET', null, {
    origin: testData.startPlace,
    destination: testData.endPlace,
    date: testData.startDate,
    travelers: testData.travelers
  });

  // Test 3: Hotel Options
  console.log('\n3. Testing Hotel Options API...');
  await testAPI('/trips/hotel-options', 'GET', null, {
    location: testData.startPlace,
    checkIn: testData.startDate,
    checkOut: testData.endDate,
    adults: testData.travelers,
    rooms: 1
  });

  // Test 4: Attractions
  console.log('\n4. Testing Attractions API...');
  await testAPI('/trips/attractions', 'GET', null, {
    locations: [testData.startPlace, testData.endPlace],
    radius: 50000
  });

  // Test 5: Weather
  console.log('\n5. Testing Weather API...');
  await testAPI(`/trips/weather/${encodeURIComponent(testData.startPlace)}`);

  // Test 6: Travel Tips
  console.log('\n6. Testing Travel Tips API...');
  await testAPI(`/trips/travel-tips/${encodeURIComponent(testData.endPlace)}`);

  // Test 7: Generate Packages (Main API)
  console.log('\n7. Testing Generate Packages API...');
  await testAPI('/trips/generate-packages', 'POST', {
    startPlace: testData.startPlace,
    endPlace: testData.endPlace,
    stops: ['Surat, Gujarat, India'],
    startDate: testData.startDate,
    endDate: testData.endDate,
    travelers: testData.travelers,
    budget: testData.budget,
    tripType: testData.tripType
  });

  // Test 8: Directions
  console.log('\n8. Testing Directions API...');
  await testAPI('/trips/directions', 'GET', null, {
    origin: testData.startPlace,
    destination: testData.endPlace,
    waypoints: 'Surat, Gujarat, India'
  });

  console.log('\n🎉 API Testing Complete!');
  console.log('\n📊 Summary:');
  console.log('- All APIs should return data or appropriate fallback responses');
  console.log('- Real-time data is cached for 5 minutes for performance');
  console.log('- Fallback systems ensure the app works even if external APIs fail');
  console.log('- Google Maps API integration provides accurate place data');
  console.log('- Dynamic pricing adjusts based on distance, dates, and demand');
}

// Run the tests
runTests().catch(console.error);
