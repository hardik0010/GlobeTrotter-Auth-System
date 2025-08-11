# GlobeTrotter - Enhanced Travel Planning Platform

A comprehensive travel planning application with real-time data integration, intelligent pricing, and personalized trip recommendations.

## 🚀 New Features & Improvements

### AI-Powered Itinerary Generation
- **Gemini AI**: Intelligent day-by-day itinerary generation
- **Foursquare Places API**: Rich activity data with photos and ratings
- **Smart Fallbacks**: Mock itineraries when APIs are unavailable
- **Real-time Enrichment**: Activity photos, ratings, and location data
- **Caching System**: Optimized API responses with 5-minute cache

### Enhanced Trip Planning
- **AI-Generated Itineraries**: Personalized day-by-day travel plans
- **Rich Activity Data**: Photos, ratings, and detailed descriptions
- **Smart Route Planning**: Estimated distances and travel times
- **Attraction Discovery**: Automatic tourist attraction recommendations
- **Weather-Aware Planning**: Weather forecasts for better trip timing
- **Travel Tips**: Destination-specific recommendations and advice

### Improved User Experience
- **Real-Time Search**: Instant place suggestions with backend API
- **Interactive Itineraries**: Day-by-day travel plans with rich visuals
- **Comprehensive Activity Data**: Photos, ratings, and cost information
- **AI-Powered Recommendations**: Intelligent activity suggestions
- **Responsive Design**: Mobile-friendly interface with modern UI
- **Loading States**: Better user feedback during API calls

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT Authentication**
- **Gemini AI API** integration
- **Foursquare Places API** integration
- **Amadeus Flight API** integration (optional)
- **RapidAPI Hotels** integration (optional)
- **Node-Cache** for performance optimization
- **Axios** for HTTP requests

### Frontend
- **React.js** with modern hooks
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Axios** for API communication
- **React Hot Toast** for notifications

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Gemini AI API key
- Foursquare Places API key
- Amadeus API credentials (optional)
- RapidAPI key (optional)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GlobeTrotter
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create/update `backend/config.env`:
```env
# Database Configuration
MONGODB_URI=your_mongodb_atlas_uri

# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your_jwt_secret

# AI and Places APIs
GEMINI_API_KEY=your_gemini_api_key
FOURSQUARE_API_KEY=your_foursquare_api_key

# Optional: Real-time APIs
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=hotels4.p.rapidapi.com
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌟 Key Features

### 1. Intelligent Place Search
- Google Places API integration
- Real-time autocomplete suggestions
- Popular Indian cities fallback
- Smart place validation

### 2. Real-Time Transportation Options
- **Flights**: Amadeus API integration with fallback pricing
- **Trains**: Indian Railways simulation with realistic pricing
- **Buses**: Inter-city bus options with AC/Non-AC variants
- **Dynamic Pricing**: Based on distance, demand, and booking time

### 3. Comprehensive Hotel Integration
- RapidAPI Hotels integration
- Real-time availability and pricing
- Multiple accommodation tiers
- Amenity-based filtering

### 4. Smart Route Planning
- Google Directions API integration
- Multi-stop route optimization
- Real-time distance and duration calculation
- Traffic-aware routing

### 5. Attraction Discovery
- Google Places Nearby Search
- Tourist attraction recommendations
- Rating-based sorting
- Location-based filtering

### 6. Weather Integration
- 5-day weather forecasts
- Temperature and condition data
- Travel planning recommendations

### 7. Travel Tips & Recommendations
- Destination-specific advice
- Accommodation tips
- Transportation guidance
- Cultural insights

## 📊 API Endpoints

### Trip Planning
- `POST /api/trips/generate-packages` - Generate comprehensive travel packages
- `GET /api/trips/transport-options` - Get real-time transportation options
- `GET /api/trips/hotel-options` - Get hotel availability and pricing
- `GET /api/trips/attractions` - Discover nearby attractions
- `GET /api/trips/weather/:location` - Get weather forecasts
- `GET /api/trips/travel-tips/:destination` - Get travel recommendations

### Place Search
- `GET /api/trips/search-places` - Enhanced place autocomplete
- `GET /api/trips/place-details/:placeId` - Get detailed place information
- `GET /api/trips/directions` - Get route directions

## 🎯 Usage Examples

### 1. Plan a Trip
1. Navigate to the Plan Trip page
2. Enter start and end locations (with real-time autocomplete)
3. Add optional stops along the way
4. Select travel dates and number of travelers
5. Choose budget range and trip type
6. Click "Search Packages" to get comprehensive recommendations

### 2. View Real-Time Data
- **Transportation**: See live pricing for flights, trains, and buses
- **Accommodation**: Real-time hotel availability and rates
- **Weather**: 5-day forecasts for better planning
- **Attractions**: Discover nearby tourist spots
- **Route Info**: Optimized routes with distance and duration

### 3. Package Selection
- **Budget Explorer**: Affordable options with local experiences
- **Comfort Journey**: Mid-range packages with quality accommodations
- **Luxury Experience**: Premium packages with exclusive features

## 🔒 Security Features

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure environment variable handling
- CORS configuration

## 🚀 Performance Optimizations

- **API Caching**: 5-minute cache for external API responses
- **Parallel Requests**: Concurrent API calls for faster response times
- **Lazy Loading**: Optimized component loading
- **Image Optimization**: Compressed travel images
- **Database Indexing**: Optimized MongoDB queries

## 🎨 UI/UX Improvements

- **Modern Design**: Clean, responsive interface
- **Interactive Elements**: Hover effects and transitions
- **Loading States**: User feedback during API calls
- **Error Handling**: Graceful error messages
- **Mobile Responsive**: Works seamlessly on all devices

## 🔧 Configuration Options

### API Keys Setup
1. **Google Maps API**: Enable Places API, Directions API, and Geocoding API
2. **Amadeus API**: Register for free tier access
3. **RapidAPI**: Subscribe to Hotels API for real-time hotel data

### Fallback Systems
- All external APIs have intelligent fallback mechanisms
- Local pricing algorithms when APIs are unavailable
- Graceful degradation for better user experience

## 📈 Future Enhancements

- **Real-time Booking**: Direct booking integration
- **Payment Gateway**: Secure payment processing
- **Social Features**: Trip sharing and reviews
- **AI Recommendations**: Machine learning-based suggestions
- **Multi-language Support**: Internationalization
- **Offline Mode**: Cached data for offline access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**GlobeTrotter** - Your Ultimate Travel Planning Companion with Real-Time Data and Intelligent Recommendations! 🌍✈️🏨
