import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Search,
  Plus,
  X,
  Star,
  Clock,
  Users,
  Heart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const PlanTripPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [tripData, setTripData] = useState({
    startDate: '',
    endDate: '',
    startPlace: '',
    endPlace: '',
    stops: [],
    travelers: 1,
    budget: '',
    tripType: 'leisure'
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);

  // Handle form changes
  const handleInputChange = (field, value) => {
    setTripData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add stop
  const addStop = () => {
    if (tripData.stops.length < 5) {
      setTripData(prev => ({
        ...prev,
        stops: [...prev.stops, '']
      }));
    } else {
      toast.error('Maximum 5 stops allowed');
    }
  };

  // Remove stop
  const removeStop = (index) => {
    setTripData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  // Update stop
  const updateStop = (index, value) => {
    setTripData(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => i === index ? value : stop)
    }));
  };

  // Search for packages
  const searchPackages = async () => {
    if (!tripData.startPlace || !tripData.endPlace || !tripData.startDate || !tripData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock search results
      const mockResults = generateMockPackages();
      setSearchResults(mockResults);
      setShowSuggestions(true);

      toast.success('Found packages for your trip!');
    } catch (error) {
      toast.error('Failed to search packages');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock packages
  const generateMockPackages = () => {
    const route = `${tripData.startPlace} → ${tripData.stops.join(' → ')} → ${tripData.endPlace}`;
    const duration = calculateDuration(tripData.startDate, tripData.endDate);

    return [
      {
        id: 'custom-1',
        title: 'Budget Explorer',
        route: route,
        duration: `${duration} days`,
        price: '₹15,000',
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        highlights: ['Local transport', 'Budget hotels', 'Street food'],
        transport: ['bus', 'train'],
        accommodation: 'Budget hotels',
        type: 'budget'
      },
      {
        id: 'custom-2',
        title: 'Comfort Journey',
        route: route,
        duration: `${duration} days`,
        price: '₹28,000',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        highlights: ['AC transport', '3-star hotels', 'Guided tours'],
        transport: ['car', 'train'],
        accommodation: '3-star hotels',
        type: 'comfort'
      },
      {
        id: 'custom-3',
        title: 'Luxury Experience',
        route: route,
        duration: `${duration} days`,
        price: '₹45,000',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
        highlights: ['Private transport', '5-star hotels', 'Fine dining'],
        transport: ['car', 'flight'],
        accommodation: '5-star hotels',
        type: 'luxury'
      }
    ];
  };

  // Calculate duration
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Select package
  const selectPackage = (pkg) => {
    setSelectedPackages(prev => [...prev, pkg]);
    toast.success(`Added ${pkg.title} to your selection`);
  };

  // View itinerary
  const viewItinerary = () => {
    if (selectedPackages.length === 0) {
      toast.error('Please select at least one package');
      return;
    }

    navigate('/itinerary', {
      state: {
        tripData,
        selectedPackages
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Plan Your Trip</h1>
          <p className="text-gray-600">Create the perfect itinerary for your journey</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Planning Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Trip Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={tripData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                      id="startDate"
                    />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={tripData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={tripData.startDate || new Date().toISOString().split('T')[0]}
                      id="endDate"
                    />
                  </div>
                </div>

                {/* Start Place */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Place
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tripData.startPlace}
                      onChange={(e) => handleInputChange('startPlace', e.target.value)}
                      placeholder="e.g., Mumbai, Maharashtra"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* End Place */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Place
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tripData.endPlace}
                      onChange={(e) => handleInputChange('endPlace', e.target.value)}
                      placeholder="e.g., Delhi, India"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Stops */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Stops (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addStop}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Stop
                  </button>
                </div>

                {tripData.stops.map((stop, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={stop}
                        onChange={(e) => updateStop(index, e.target.value)}
                        placeholder={`Stop ${index + 1} (e.g., Surat, Gujarat)`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStop(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Additional Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <select
                    value={tripData.travelers}
                    onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    value={tripData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Budget</option>
                    <option value="budget">Budget (₹5,000 - ₹15,000)</option>
                    <option value="mid">Mid-range (₹15,000 - ₹30,000)</option>
                    <option value="luxury">Luxury (₹30,000+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trip Type
                  </label>
                  <select
                    value={tripData.tripType}
                    onChange={(e) => handleInputChange('tripType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="leisure">Leisure</option>
                    <option value="business">Business</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="mt-8">
                <button
                  onClick={searchPackages}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Search Packages
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Search Results */}
            {showSuggestions && searchResults.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended Packages</h2>
                <div className="space-y-6">
                  {searchResults.map((pkg) => (
                    <div key={pkg.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{pkg.title}</h3>
                              <p className="text-gray-600 text-sm mb-2">{pkg.route}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {pkg.duration}
                                </span>
                                <span className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {tripData.travelers} travelers
                                </span>
                                <span className="flex items-center">
                                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                                  {pkg.rating}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {pkg.highlights.map((highlight, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">{pkg.price}</p>
                              <p className="text-sm text-gray-500">per person</p>
                              <button
                                onClick={() => selectPackage(pkg)}
                                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                              >
                                Select Package
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Selected Packages */}
            {selectedPackages.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Packages</h3>
                <div className="space-y-3">
                  {selectedPackages.map((pkg, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{pkg.title}</p>
                        <p className="text-sm text-gray-600">{pkg.price}</p>
                      </div>
                      <button
                        onClick={() => setSelectedPackages(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={viewItinerary}
                  className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  View Itinerary
                </button>
              </div>
            )}

            {/* Trending Packages */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Packages</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                    alt="Golden Triangle"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold text-gray-900 mb-1">Golden Triangle Adventure</h4>
                  <p className="text-sm text-gray-600 mb-2">Delhi → Agra → Jaipur</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">7 days</span>
                      <span className="flex items-center text-sm">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        4.8
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">₹25,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTripPage;
