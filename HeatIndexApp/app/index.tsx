import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, RefreshControl, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const citiesList = [
  'Agusan Del Norte', 'Albay', 'Aurora', 'Batanes', 'Batangas', 'Benguet', 'Bukidnon', 'Cagayan', 'Camarines',
  'Capiz', 'Catanduanes', 'Cavite', 'Cebu', 'Davao Del Sur', 'Eastern Samar', 'Ilocos Norte', 'Ilocos Sur',
  'Leyte', 'Maguindanao', 'Masbate', 'Metro Manila', 'Negros Oriental', 'Neuva Ecija', 'Northern Samar',
  'Occidental Mindoro', 'Palawan', 'Pampanga', 'Pangasinan', 'Quezon', 'Rizal', 'Romblon', 'Sorsogon',
  'South Cotabato', 'Southern Leyte', 'Surigao Del Norte', 'Surigao Del Sur', 'Western Samar', 'Zambales',
  'Zamboanga Del Norte'
];

export default function App() {
  const [todayForecast, setTodayForecast] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState([]); // Initialize as empty array
  const [city, setCity] = useState('Cebu'); // Default city
  const [refreshing, setRefreshing] = useState(false);
  const [filteredCities, setFilteredCities] = useState(citiesList);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch forecasts for today and the next 7 days
  const fetchForecast = () => {
    fetch(`http://192.168.1.38:8000/forecast/today/${city}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Today\'s Forecast Data:', data);
        if (data && data.predicted_value) {
          setTodayForecast(data.predicted_value);
        } else {
          console.error('Unexpected data format for today\'s forecast:', data);
          setTodayForecast(null);
        }
      })
      .catch((error) => console.error('Error fetching today\'s forecast:', error));

    fetch(`http://192.168.1.38:8000/forecast/7days/${city}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('7-Day Forecast Data:', data);
        if (Array.isArray(data)) {
          setWeeklyForecast(data);
        } else {
          console.error('Unexpected data format for weekly forecast:', data);
          setWeeklyForecast([]);
        }
      })
      .catch((error) => console.error('Error fetching weekly forecast:', error));
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchForecast();
    setRefreshing(false);
  };

  // Filter cities based on the search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredCities(
      citiesList.filter((city) => city.toLowerCase().includes(query.toLowerCase()))
    );
  };

  // Handle city selection
  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setSearchQuery(''); // Clear search query
    setFilteredCities(citiesList); // Reset the filtered cities list
  };

  useEffect(() => {
    fetchForecast();
  }, [city]); // Fetch forecast when city changes

  return (
    <View className="flex-1 bg-gray-800">
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <TextInput
          placeholder="Search city..."
          className="text-white border-b border-white mx-4 my-2 p-2"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery ? (
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCitySelect(item)}>
                <Text className="text-white p-2 mx-4">{item}</Text>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 200 }} // Adjust height as needed
          />
        ) : null}
        <ScrollView
          contentContainerStyle={{ paddingVertical: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text className="text-white text-center text-lg mb-4">Today's Forecast for {city}</Text>
          {todayForecast !== null ? (
            <Text className="text-white text-3xl text-center">{todayForecast}°C</Text>
          ) : (
            <Text className="text-white text-center">Loading...</Text>
          )}

          <Text className="text-white text-center text-lg mt-6 mb-4">7-Day Forecast for {city}</Text>
          {weeklyForecast.length > 0 ? (
            weeklyForecast.map((item, index) => (
              <Text key={index} className="text-white text-center">
                {item.date}: {item.predicted_value}°C
              </Text>
            ))
          ) : (
            <Text className="text-white text-center">Loading...</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}