// components/Forecasts/TodayForecast.tsx
import React from 'react';
import { Text, View } from 'react-native';

interface TodayForecastProps {
    city: string;
    forecast: number | null;
}

const TodayForecast: React.FC<TodayForecastProps> = ({ city, forecast }) => {
    return (
        <View className="items-center p-4">

            <Text className="p-8 pt-16 text-center text-9xl text-white font-black">
                {forecast !== null ? (
                    <Text>{forecast}</Text>
                ) : (
                    <Text className="text-white text-2xl">No forecast data available.</Text>
                )}
                <Text className="pt-8 text-center text-9xl text-white font-light">°</Text>
            </Text>
        </View>
    );
};

export default TodayForecast;