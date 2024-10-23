import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, ScrollView, RefreshControl, View, StatusBar, Image, Text, ActivityIndicator, Alert, TouchableOpacity, Linking } from 'react-native';
import SearchBar from '../components/Search/SearchBar';
import TodayForecast from '../components/Forecasts/TodayForecast';
import WeeklyForecast from '../components/Forecasts/WeeklyForecast';
import WhatCanYouDo from '../components/Forecasts/WhatCanYouDo';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

const citiesList = [
    'Agusan Del Norte', 'Albay', 'Aurora', 'Batanes', 'Batangas', 'Benguet', 'Bukidnon', 'Cagayan', 'Camarines',
    'Capiz', 'Catanduanes', 'Cavite', 'Cebu', 'Davao Del Sur', 'Eastern Samar', 'Ilocos Norte', 'Ilocos Sur',
    'Leyte', 'Maguindanao', 'Masbate', 'Metro Manila', 'Negros Oriental', 'Nueva Ecija', 'Northern Samar',
    'Occidental Mindoro', 'Palawan', 'Pampanga', 'Pangasinan', 'Quezon', 'Rizal', 'Romblon', 'Sorsogon',
    'South Cotabato', 'Southern Leyte', 'Surigao Del Norte', 'Surigao Del Sur', 'Western Samar', 'Zambales',
    'Zamboanga Del Norte'
];

const HomeScreen: React.FC = () => {
    const [todayForecast, setTodayForecast] = useState<number | null>(null);
    const [weeklyForecast, setWeeklyForecast] = useState<any[]>([]);
    const [city, setCity] = useState('Metro Manila'); // Default city
    const [refreshing, setRefreshing] = useState(false);
    const [filteredCities, setFilteredCities] = useState(citiesList);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const fetchForecast = async (selectedCity: string) => {
        setLoading(true);
        try {
            const todayResponse = await fetch(`https://backend-flask-api.as.r.appspot.com/forecast/today/${selectedCity}`);
            const todayData = await todayResponse.json();
            setTodayForecast(todayData?.predicted_value ?? null);

            const weeklyResponse = await fetch(`https://backend-flask-api.as.r.appspot.com/forecast/7days/${selectedCity}`);
            const weeklyData = await weeklyResponse.json();
            setWeeklyForecast(Array.isArray(weeklyData) ? weeklyData : []);
        } catch (error) {
            console.error('Error fetching forecast:', error);
            Alert.alert('Error', 'Failed to fetch the forecast. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Scroll to the specified Y position
    const scrollToPosition = () => {
        scrollViewRef.current.scrollTo({ y: 500, animated: true }); // Adjust '500' as needed
    };

    const handleLearnMore = () => {
        // Open the specified URL in the default web browser
        Linking.openURL('https://ehs.unc.edu/topics/heat-stress/heat-index/')
            .catch((err) => console.error('An error occurred', err));
    };

    // Request notification permissions
    const getNotificationPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to show notifications was denied');
        }
    };

    // Request location permissions
    const getLocationPermissions = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchForecast(city);
        setRefreshing(false);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query) {
            const filtered = citiesList.filter(city => city.toLowerCase().includes(query.toLowerCase()));
            setFilteredCities(filtered);
        } else {
            setFilteredCities(citiesList);
        }
    };

    const handleCitySelect = (selectedCity: string) => {
        setCity(selectedCity);
        setSearchQuery('');
        setFilteredCities(citiesList);
        fetchForecast(selectedCity);
    };

    const getHeatCondition = () => {
        if (todayForecast === null) return null;

        if (todayForecast >= 27 && todayForecast <= 32) {
            return { label: 'CAUTION', description: 'This level indicates mild heat exposure. While not immediately dangerous, prolonged exposure or physical exertion may lead to fatigue. It is essential to stay hydrated and take breaks in shaded or cooler areas to prevent exhaustion.' };
        } else if (todayForecast >= 33 && todayForecast <= 41) {
            return { label: 'EXTREME CAUTION', description: 'Heat poses a significant risk to health. Heat stroke, heat cramps, or heat exhaustion are possible outcomes with prolonged exposure or physical exertion. Take extra precautions such as wearing lightweight and loose-fitting clothing, drinking plenty of fluids, and minimizing outdoor activities during peak heat hours.' };
        } else if (todayForecast >= 42 && todayForecast <= 54) {
            return { label: 'DANGER', description: 'Heat cramps or heat exhaustion are likely outcomes. There\'s an increased possibility of heat stroke, which can be life-threatening. It is crucial to stay indoors in air-conditioned spaces, if possible, and limit outdoor activities to early mornings or evenings when temperatures are lower. \n\nIn case of Emergency, call the Hotlines:\n National Emergency Hotline 911\nPhilippine Red Cross 143 | 8527-0000' };
        } else if (todayForecast >= 55) {
            return { label: 'EXTREME DANGER', description: 'Heat stroke is highly likely. Immediate action is necessary to prevent serious health consequences. Stay indoors in air-conditioned environments, drink plenty of fluids, and avoid any outdoor activities. If you must be outside, take frequent breaks in the shade and wear light-colored clothing to reflect sunlight. \n\nIn case of Emergency, call the Hotlines:\n National Emergency Hotline 911\nPhilippine Red Cross 143 | 8527-0000' };
        }
        return null;
    };

    useEffect(() => {
        fetchForecast(city);
        getNotificationPermissions(); // Request notification permissions on component mount
        getLocationPermissions(); // Request location permissions on component mount
    }, [city]);

    const heatCondition = getHeatCondition();

    return (
        <View className="flex-1 relative" style={{ backgroundColor: 'rgba(24, 32, 41, 1)' }}>
            <StatusBar barStyle="light-content" backgroundColor="rgba(24, 32, 41, 1)" />
            <SafeAreaView className="flex flex-1">
                <Image
                    source={require('../assets/images/bg-map.png')}
                    className="absolute w-full bg-blend-darken"
                    style={{ resizeMode: 'cover' }} // Cover the entire screen
                />

                <ScrollView
                    ref={scrollViewRef}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View className=" flex-row justify-between relative z-50">
                        <SearchBar
                            searchQuery={searchQuery}
                            filteredCities={filteredCities}
                            onSearchQueryChange={handleSearch}
                            onCitySelect={handleCitySelect}
                        />
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
                    ) : (
                        <>
                            {/* Display Heat Condition */}
                            {heatCondition && (
                                <Text className="text-orange-500 text-center text-lg font-bold">
                                    {heatCondition.label}
                                </Text>
                            )}

                            <Text className="text-center text-xs underline text-white/70 py-4"
                                onPress={scrollToPosition} // Call scrollToPosition when clicked
                            >
                                What does this mean?
                            </Text>

                            <TodayForecast city={city} forecast={todayForecast} />

                            <View >
                                <Text className="p-4 text-slate-200 text-xl my-4">
                                    7-Day Forecast for {city}
                                </Text>
                                {weeklyForecast.length > 0 ? (
                                    <WeeklyForecast forecasts={weeklyForecast} />
                                ) : (
                                    <Text className="text-white">No weekly forecast data available.</Text>
                                )}
                            </View>

                            {/* Conditions Section */}
                            <View className="p-4" style={{ backgroundColor: 'rgba(24, 32, 41, 1)' }}>
                                <Text className="text-slate-200 text-xl">
                                    Today's current conditions{"\n"}
                                </Text>

                                {heatCondition && (
                                    <View className="p-4" style={{
                                        backgroundColor: 'background: rgba(249, 115, 22, 0.17)'
                                        , borderWidth: 1, borderColor: 'rgba(249, 115, 22, 1)', borderStyle: 'solid',
                                        borderRadius: 12
                                    }} >
                                        <Text className="py-2 text-orange-500 text-sm font-bold">{heatCondition.label}</Text>
                                        <Text className="text-white text-sm">{heatCondition.description}</Text>
                                        <Text className="text-white py-2 text-sm">Curious about the different classifications of heat index?
                                            <TouchableOpacity onPress={handleLearnMore}>
                                                <Text className="text-cyan-400 text-sm underline">Learn more</Text>
                                            </TouchableOpacity>
                                        </Text>

                                    </View>
                                )}
                            </View>

                            {/* What Can You DO Section */}
                            <View className="p-4" style={{ backgroundColor: 'rgba(24, 32, 41, 1)' }}>
                                <Text className="text-slate-200 text-xl">
                                    What can you do?{"\n"}
                                </Text>
                                {todayForecast !== null && <WhatCanYouDo todayForecast={todayForecast} />}
                            </View>
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default HomeScreen;