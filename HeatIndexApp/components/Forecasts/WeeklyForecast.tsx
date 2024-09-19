// components/Forecast/WeeklyForecast.tsx

import React from 'react';
import { Text, View } from 'react-native';

interface WeeklyForecastProps {
    forecasts: { date: string; predicted_value: number }[];
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ forecasts }) => {
    return (
        <View>
            {forecasts.length > 0 ? (
                forecasts.map((item, index) => (
                    <Text key={index} className="text-white text-lg">
                        {item.date}: {item.predicted_value}°C
                    </Text>
                ))
            ) : (
                <Text className="text-white text-2xl">Loading...</Text>
            )}
        </View>
    );
};

export default WeeklyForecast;