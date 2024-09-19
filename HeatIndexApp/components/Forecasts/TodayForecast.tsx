// components/Forecast/TodayForecast.tsx

import React from 'react';
import { Text, View } from 'react-native';

interface TodayForecastProps {
    forecast: number | null;
}

const TodayForecast: React.FC<TodayForecastProps> = ({ forecast }) => {
    return (
        <View>
            {forecast !== null ? (
                <Text className="text-white text-6xl">{forecast}°C</Text>
            ) : (
                <Text className="text-white text-2xl">Loading...</Text>
            )}
        </View>
    );
};

export default TodayForecast;