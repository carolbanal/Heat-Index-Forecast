// components/Forecasts/WeeklyForecast.tsx
import React from 'react';
import { Text, View, FlatList } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface WeeklyForecastProps {
    city: string;
    forecasts: { date: string; predicted_value: number }[];
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ city, forecasts }) => {
    // Get today's date and calculate tomorrow's date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set to tomorrow

    // Calculate the dates for the next 7 days starting from tomorrow
    const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
        const nextDate = new Date(tomorrow);
        nextDate.setDate(tomorrow.getDate() + i);
        return nextDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    });

    // Filter forecasts to include only those in the next 7 days
    const filteredForecast = forecasts.filter(forecast => {
        const forecastDate = new Date(forecast.date).toISOString().split('T')[0];
        return nextSevenDays.includes(forecastDate);
    });

    const renderItem = ({ item }: { item: { date: string; predicted_value: number } }) => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long' });

        return (
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }} className="p-2 mx-1 rounded-lg items-center w-24">
                <Text className="py-4 text-white text-sm font-bold">{formattedDate}</Text>
                <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill='rgba(251, 191, 36, 1)'
                >
                    <Path
                        d="M6.993 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007S14.761 
                        6.993 12 6.993 6.993 9.239 6.993 12zM12 8.993c1.658 0 3.007 1.349 3.007 
                        3.007S13.658 15.007 12 15.007 8.993 13.658 8.993 12 10.342 8.993 12 
                        8.993zM10.998 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2h-3zm17 0h3v2h-3zM4.219 
                        18.363l2.12-2.122 1.415 1.414-2.12 2.122zM16.24 6.344l2.122-2.122 1.414 1.414-2.122 
                        2.122zM6.342 7.759 4.22 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z"
                        stroke='rgba(251, 191, 36, 1)'
                    />
                </Svg>
                <Text className="py-4 text-white text-lg font-bold">{item.predicted_value}°C</Text>
            </View>
        );
    };

    return (
        <View className="w-full px-4">
            {filteredForecast.length > 0 ? (
                <FlatList
                    data={filteredForecast}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.date} // Use item.date as the key
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            ) : (
                <Text className="text-white text-2xl text-center">No weekly forecast data available.</Text>
            )}
        </View>
    );
};

export default WeeklyForecast;