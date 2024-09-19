// components/Forecast.tsx
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

const Forecast: React.FC = () => {
    const [todayForecast, setTodayForecast] = useState<number | null>(null);
    const [weeklyForecast, setWeeklyForecast] = useState<any[]>([]);
    const [city, setCity] = useState('Cebu');
    const [refreshing, setRefreshing] = useState(false);
    const [filteredCities, setFilteredCities] = useState(citiesList);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchForecast = () => {
        console.log('Fetching today\'s forecast...');
        fetch(`http://192.168.1.40:8000/forecast/today/${city}`)
            .then((response) => {
                console.log('Today\'s Forecast Response Status:', response.status);
                return response.json();
            })
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

        console.log('Fetching 7-day forecast...');
        fetch(`http://192.168.1.40:8000/forecast/7days/${city}`)
            .then((response) => {
                console.log('7-Day Forecast Response Status:', response.status);
                return response.json();
            })
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

    const onRefresh = () => {
        setRefreshing(true);
        fetchForecast();
        setRefreshing(false);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setFilteredCities(
            citiesList.filter((city) => city.toLowerCase().includes(query.toLowerCase()))
        );
    };

    const handleCitySelect = (selectedCity: string) => {
        setCity(selectedCity);
        setSearchQuery('');
        setFilteredCities(citiesList);
    };

    useEffect(() => {
        fetchForecast();
    }, [city]);

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
                        style={{ maxHeight: 200 }}
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
};

export default Forecast;