// app/index.tsx

import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, RefreshControl, Text, View } from 'react-native';
import SearchBar from '../components/Search/SearchBar';
import TodayForecast from '../components/Forecasts/TodayForecast';
import WeeklyForecast from '../components/Forecasts/WeeklyForecast';

const citiesList = [
  'Agusan Del Norte', 'Albay', 'Aurora', 'Batanes', 'Batangas', 'Benguet', 'Bukidnon', 'Cagayan', 'Camarines',
  'Capiz', 'Catanduanes', 'Cavite', 'Cebu', 'Davao Del Sur', 'Eastern Samar', 'Ilocos Norte', 'Ilocos Sur',
  'Leyte', 'Maguindanao', 'Masbate', 'Metro Manila', 'Negros Oriental', 'Neuva Ecija', 'Northern Samar',
  'Occidental Mindoro', 'Palawan', 'Pampanga', 'Pangasinan', 'Quezon', 'Rizal', 'Romblon', 'Sorsogon',
  'South Cotabato', 'Southern Leyte', 'Surigao Del Norte', 'Surigao Del Sur', 'Western Samar', 'Zambales',
  'Zamboanga Del Norte'
];

const App: React.FC = () => {
  const [todayForecast, setTodayForecast] = useState<number | null>(null);
  const [weeklyForecast, setWeeklyForecast] = useState<any[]>([]);
  const [city, setCity] = useState('Cebu'); // Default city
  const [refreshing, setRefreshing] = useState(false);
  const [filteredCities, setFilteredCities] = useState(citiesList);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchForecast = (selectedCity: string) => {
    console.log(`Fetching forecast for ${selectedCity}...`);
    fetch(`http://192.168.1.40:8000/forecast/today/${selectedCity}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.predicted_value) {
          setTodayForecast(data.predicted_value);
        } else {
          setTodayForecast(null);
        }
      })
      .catch((error) => console.error('Error fetching today\'s forecast:', error));

    fetch(`http://192.168.1.40:8000/forecast/7days/${selectedCity}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setWeeklyForecast(data);
        } else {
          setWeeklyForecast([]);
        }
      })
      .catch((error) => console.error('Error fetching weekly forecast:', error));
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchForecast(city);
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredCities(citiesList.filter((city) => city.toLowerCase().includes(query.toLowerCase())));
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setSearchQuery(''); // Clear search query
    setFilteredCities(citiesList); // Reset the filtered cities list
    fetchForecast(selectedCity); // Fetch forecast for the selected city
  };

  useEffect(() => {
    fetchForecast(city);
  }, [city]);

  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <SearchBar
        searchQuery={searchQuery}
        filteredCities={filteredCities}
        onSearchQueryChange={handleSearch}
        onCitySelect={handleCitySelect}
      />
      <ScrollView
        contentContainerStyle={{ paddingVertical: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="items-center">
          <Text className="text-white text-2xl mb-4">Today's Forecast for {city}</Text>
          <TodayForecast forecast={todayForecast} />
          <Text className="text-white text-xl my-4">7-Day Forecast for {city}</Text>
          <WeeklyForecast forecasts={weeklyForecast} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;