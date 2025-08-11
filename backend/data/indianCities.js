// Comprehensive list of Indian cities organized by states
const indianCities = {
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada", "Kadapa", "Anantapur", "Tirupati", "Rajahmundry",
    "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Adoni", "Tenali", "Chittoor", "Hindupur", "Proddatur", "Bhimavaram",
    "Madanapalle", "Guntakal", "Dharmavaram", "Gudivada", "Narasaraopet", "Tadipatri", "Amaravati", "Srikakulam", "Vizianagaram"
  ],
  "Arunachal Pradesh": [
    "Itanagar", "Naharlagun", "Pasighat", "Bomdila", "Tawang", "Ziro", "Along", "Tezu", "Roing", "Daporijo",
    "Aalo", "Changlang", "Khonsa", "Yingkiong", "Seppa", "Koloriang", "Rupa", "Dirang", "Kalaktang", "Bhalukpong"
  ],
  "Assam": [
    "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Dhubri", "Diphu",
    "Goalpara", "Barpeta", "Lakhimpur", "Mangaldoi", "Karimganj", "Sivasagar", "Golaghat", "Hailakandi", "Kokrajhar", "Dhemaji",
    "Morigaon", "Nalbari", "Baksa", "Chirang", "Udalguri", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Dima Hasao"
  ],
  "Bihar": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Katihar", "Chhapra",
    "Siwan", "Motihari", "Aurangabad", "Biharsharif", "Nawada", "Sasaram", "Hajipur", "Munger", "Bettiah", "Jamalpur",
    "Saharsa", "Kishanganj", "Araria", "Madhepura", "Supaul", "Sheikhpura", "Lakhisarai", "Sheohar", "Sitamarhi", "Vaishali"
  ],
  "Chhattisgarh": [
    "Raipur", "Bhilai", "Korba", "Bilaspur", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur", "Mahasamund",
    "Dhamtari", "Janjgir-Champa", "Koriya", "Surguja", "Bastar", "Dantewada", "Bijapur", "Narayanpur", "Kondagaon", "Kanker"
  ],
  "Goa": [
    "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Valpoi", "Sanquelim", "Curchorem", "Cuncolim",
    "Quepem", "Sanguem", "Canacona", "Pernem", "Tiswadi", "Bardez", "Salcete", "Mormugao", "Ponda", "Sattari"
  ],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Anand", "Bharuch", "Surendranagar",
    "Junagadh", "Mehsana", "Bhuj", "Palanpur", "Godhra", "Himmatnagar", "Gandhidham", "Veraval", "Porbandar", "Navsari",
    "Valsad", "Vapi", "Bharuch", "Ankleshwar", "Morbi", "Wadhwan", "Jetpur", "Gondal", "Amreli", "Bhavnagar"
  ],
  "Haryana": [
    "Gurgaon", "Faridabad", "Panipat", "Karnal", "Hisar", "Rohtak", "Sonipat", "Yamunanagar", "Panchkula", "Ambala",
    "Kurukshetra", "Rewari", "Bhiwani", "Sirsa", "Jind", "Fatehabad", "Kaithal", "Palwal", "Nuh", "Charkhi Dadri",
    "Mahendragarh", "Jhajjar", "Narnaul", "Hans", "Tohana", "Narwana", "Pehowa", "Shahbad", "Thanesar", "Ladwa"
  ],
  "Himachal Pradesh": [
    "Shimla", "Manali", "Kullu", "Dharamshala", "Solan", "Mandi", "Palampur", "Chamba", "Kangra", "Una",
    "Hamirpur", "Bilaspur", "Nahan", "Sirmaur", "Kinnaur", "Lahaul and Spiti", "Kullu", "Mandi", "Kangra", "Chamba"
  ],
  "Jharkhand": [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh", "Medininagar", "Chatra",
    "Koderma", "Pakur", "Sahebganj", "Godda", "Dumka", "Jamtara", "Simdega", "Khunti", "Lohardaga", "Gumla"
  ],
  "Karnataka": [
    "Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary", "Bijapur", "Shimoga",
    "Tumkur", "Raichur", "Bidar", "Hospet", "Hassan", "Mandya", "Chitradurga", "Kolar", "Udupi", "Chikmagalur",
    "Karwar", "Gadag", "Bagalkot", "Chikballapur", "Ramanagara", "Yadgir", "Koppal", "Chamarajanagar", "Kodagu", "Dakshina Kannada"
  ],
  "Kerala": [
    "Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Kannur", "Kottayam", "Pathanamthitta",
    "Idukki", "Wayanad", "Malappuram", "Kasaragod", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Kannur"
  ],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa",
    "Murwara", "Singrauli", "Burhanpur", "Khandwa", "Chhindwara", "Hoshangabad", "Vidisha", "Guna", "Shajapur", "Mandsaur",
    "Neemuch", "Rajgarh", "Sehore", "Raisen", "Betul", "Harda", "Hoshangabad", "Chhatarpur", "Tikamgarh", "Damoh"
  ],
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded",
    "Sangli", "Jalgaon", "Akola", "Latur", "Ahmednagar", "Chandrapur", "Parbhani", "Ichalkaranji", "Jalna", "Bhusawal",
    "Navi Mumbai", "Mira-Bhayandar", "Bhiwandi", "Ulhasnagar", "Malegaon", "Ambarnath", "Badlapur", "Beed", "Gondia", "Wardha"
  ],
  "Manipur": [
    "Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Senapati", "Tamenglong", "Chandel", "Ukhrul", "Kangpokpi", "Jiribam",
    "Kakching", "Lilong", "Mayang Imphal", "Andro", "Lamlai", "Sekmai", "Wangoi", "Patsoi", "Lamphelpat", "Porompat"
  ],
  "Meghalaya": [
    "Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Resubelpara", "Baghmara", "Nongpoh", "Mairang", "Ampati",
    "Mawkyrwat", "Nongkhlaw", "Mawphlang", "Sohra", "Mawkyrwat", "Nongkrem", "Mawryngkneng", "Mawshynrut", "Mawthadraishan", "Mawkyrwat"
  ],
  "Mizoram": [
    "Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit", "Saitual", "Khawzawl",
    "Hnahthial", "Siaha", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit", "Saitual", "Khawzawl", "Hnahthial"
  ],
  "Nagaland": [
    "Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Mon", "Kiphire", "Longleng",
    "Peren", "Noklak", "Shamator", "Tseminyu", "Bhandari", "Tuli", "Changtongya", "Mangkolemba", "Merangmen", "Atoizu"
  ],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Baleshwar", "Baripada", "Bhadrak", "Balangir",
    "Jharsuguda", "Kendujhar", "Dhenkanal", "Angul", "Koraput", "Rayagada", "Malkangiri", "Nabarangpur", "Kandhamal", "Boudh",
    "Subarnapur", "Kendrapara", "Jagatsinghpur", "Puri", "Khordha", "Nayagarh", "Ganjam", "Gajapati", "Kandhamal", "Boudh"
  ],
  "Punjab": [
    "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Pathankot", "Moga", "Hoshiarpur", "Batala", "Muktsar",
    "Barnala", "Firozpur", "Kapurthala", "Fatehgarh Sahib", "Faridkot", "Sangrur", "Gurdaspur", "Tarn Taran", "Rupnagar", "Mohali"
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Sri Ganganagar", "Sikar",
    "Pali", "Tonk", "Sawai Madhopur", "Dungarpur", "Banswara", "Chittorgarh", "Karauli", "Jhunjhunu", "Baran", "Dausa",
    "Rajsamand", "Bundi", "Jalore", "Sirohi", "Pratapgarh", "Jaisalmer", "Barmer", "Jhalawar", "Dholpur", "Karauli"
  ],
  "Sikkim": [
    "Gangtok", "Namchi", "Geyzing", "Mangan", "Rangpo", "Jorethang", "Singtam", "Ravangla", "Pelling", "Lachung",
    "Lachen", "Yuksom", "Kaluk", "Rinchenpong", "Soreng", "Chungthang", "Dzongu", "Mangan", "Kabi", "Phodong"
  ],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Vellore", "Erode", "Tiruppur", "Tirunelveli", "Thoothukkudi",
    "Dindigul", "Thanjavur", "Ranipet", "Sivakasi", "Karur", "Udhagamandalam", "Hosur", "Nagercoil", "Kanchipuram", "Kumbakonam",
    "Tiruvannamalai", "Pollachi", "Rajapalayam", "Sivaganga", "Pudukkottai", "Neyveli", "Ambur", "Vaniyambadi", "Tirupattur", "Gudiyatham"
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Siddipet",
    "Suryapet", "Miryalaguda", "Jagtial", "Nirmal", "Kamareddy", "Kothagudem", "Bhongir", "Bodhan", "Wanaparthy", "Kagaznagar"
  ],
  "Tripura": [
    "Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Khowai", "Teliamura", "Ambassa", "Kumarghat", "Sabroom",
    "Sonamura", "Kamalpur", "Amarpur", "Jampuijala", "Dukli", "Jirania", "Hezamara", "Mandai", "Barjala", "Bishalgarh"
  ],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad",
    "Saharanpur", "Gorakhpur", "Noida", "Firozabad", "Lakhimpur Kheri", "Jhansi", "Muzaffarnagar", "Rampur", "Shahjahanpur", "Mathura",
    "Fatehpur", "Rae Bareli", "Orai", "Sitapur", "Bahraich", "Unnao", "Pilibhit", "Lalitpur", "Etawah", "Mainpuri"
  ],
  "Uttarakhand": [
    "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Kotdwara", "Ramnagar", "Pithoragarh",
    "Almora", "Nainital", "Mussoorie", "Ranikhet", "Champawat", "Bageshwar", "Chamoli", "Uttarkashi", "Tehri", "Pauri"
  ],
  "West Bengal": [
    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur",
    "Shantipur", "Dankuni", "Dhulian", "Ranaghat", "Haldia", "Raiganj", "Krishnanagar", "Nabadwip", "Medinipur", "Jalpaiguri",
    "Balurghat", "Basirhat", "Bankura", "Chakdaha", "Darjeeling", "Alipurduar", "Jalpaiguri", "Cooch Behar", "Kalimpong", "Kurseong"
  ],
  "Delhi": [
    "New Delhi", "Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", "Shahdara", "Dwarka", "Rohini",
    "Pitampura", "Janakpuri", "Lajpat Nagar", "Saket", "Vasant Vihar", "Hauz Khas", "Greater Kailash", "Defence Colony", "Karol Bagh", "Connaught Place"
  ],
  "Jammu and Kashmir": [
    "Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Udhampur", "Kathua", "Rajouri", "Poonch", "Doda",
    "Kishtwar", "Ramban", "Reasi", "Samba", "Ganderbal", "Bandipora", "Kupwara", "Pulwama", "Shopian", "Kulgam"
  ],
  "Ladakh": [
    "Leh", "Kargil", "Drass", "Zanskar", "Nubra Valley", "Pangong Lake", "Tso Moriri", "Tso Kar", "Changthang", "Suru Valley"
  ],
  "Chandigarh": [
    "Chandigarh", "Mohali", "Panchkula", "Zirakpur", "Kharar", "Kurali", "Banur", "Derabassi", "Lalru", "Dera Bassi"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Silvassa", "Daman", "Diu", "Naroli", "Dadra", "Amli", "Khanvel", "Vapi", "Masat", "Rakholi"
  ],
  "Lakshadweep": [
    "Kavaratti", "Agatti", "Amini", "Andrott", "Kadmat", "Kalpeni", "Kiltan", "Minicoy", "Chetlat", "Bitra"
  ],
  "Puducherry": [
    "Puducherry", "Karaikal", "Mahe", "Yanam", "Ozhukarai", "Villianur", "Bahour", "Nettapakkam", "Kurumbapet", "Muthialpet"
  ]
};

// Flatten all cities into a single array with state information
const getAllCities = () => {
  const allCities = [];
  for (const [state, cities] of Object.entries(indianCities)) {
    cities.forEach(city => {
      allCities.push({
        city: city,
        state: state,
        fullName: `${city}, ${state}, India`
      });
    });
  }
  return allCities;
};

// Get cities by state
const getCitiesByState = (state) => {
  return indianCities[state] || [];
};

// Search cities with fuzzy matching
const searchCities = (query) => {
  const allCities = getAllCities();
  const queryLower = query.toLowerCase();
  
  return allCities.filter(city => {
    const cityLower = city.city.toLowerCase();
    const stateLower = city.state.toLowerCase();
    const fullNameLower = city.fullName.toLowerCase();
    
    return cityLower.includes(queryLower) || 
           stateLower.includes(queryLower) || 
           fullNameLower.includes(queryLower) ||
           cityLower.startsWith(queryLower) ||
           stateLower.startsWith(queryLower);
  });
};

module.exports = {
  indianCities,
  getAllCities,
  getCitiesByState,
  searchCities
};
