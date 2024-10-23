import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const WhatCanYouDo = ({ todayForecast }: { todayForecast: number }) => {
    const whatDo = [
        {
            name: 'Limit Outdoor Activities',
            description: 'Avoid outdoor activities during the hottest parts of the day to reduce the risk of heat-related illnesses',
            icon: (
                <Svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill='rgba(221, 214, 254, 1)'>
                    <Path d="m21.743 12.331-9-10c-.379-.422-1.107-.422-1.486 0l-9 10a.998.998 0 0 0-.17 1.076c.16.361.518.593.913.593h2v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2a.998.998 0 0 0 .743-1.669z" />
                </Svg>
            )
        },
        {
            name: 'Protect your body',
            description: 'Protect yourself from the sun\'s harmful rays by wearing a wide-brimmed hat and sunglasses when outdoors, and applying sunscreen with a high SPF to exposed skin.',
            icon: (
                <Svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill='rgba(253, 230, 138, 1)'>
                    <Path d="M6.995 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007-2.246-5.007-5.007-5.007S6.995 9.239 6.995 12zM11 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2H2zm17 0h3v2H2zM5.637 19.778l-1.414-1.414 2.121-2.121 1.414 1.414zM16.242 6.344l2.122-2.122 1.414 1.414-2.122 2.122z" />
                </Svg>
            )
        },
        {
            name: 'Check on Others',
            description: 'Look out for elderly or vulnerable individuals in your community and ensure they\'re staying cool and hydrated during hot weather.',
            icon: (
                <Svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill='rgba(251, 207, 232, 1)'>
                    <Path d="M17.726 13.02 14 16H9v-1h4.065a.5.5 0 0 0 .416-.777l-.888-1.332A1.995 1.995 0 0 0 10.93 12H3a1 1 0 0 0-1 1v6a2 2 0 0 0 2 2h9.639a3 3 0 0 0 2.258-1.024L22 13l-1.452-.484a2.998 2.998 0 0 0-2.822.504zm1.532-5.63c.451-.465.73-1.108.73-1.818s-.279-1.353-.73-1.818A2.447 2.447 0 0 0 17.494 3S16.25 2.997 15 4.286C13.75 2.997 12.506 3 12.506 3a2.45 2.45 0 0 0-1.764.753c-.451.466-.73 1.108-.73 1.818s.279 1.354.73 1.818L15 12l4.258-4.61z" />
                </Svg>
            )
        },
        {
            name: 'Drink your water, beshie',
            description: 'Drink plenty of water to stay hydrated and maintain your body\'s fluid balance, especially in hot weather.',
            icon: (
                <Svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill='rgba(191, 219, 254, 1)'>
                    <Path d="M12.6 2.4c-.4-.3-.9-.3-1.2 0C9.5 3.9 4 8.5 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-5.4-5.5-10.1-7.4-11.6" />
                </Svg>
            )
        },
        {
            name: 'Take showers',
            description: 'Cool down with cold showers or by using fans and air conditioning at home.',
            icon: (
                <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill='rgba(153, 246, 228, 1)'
                >
                    <Path
                        d="M21 18.33A6.78 6.78 0 0 0 19.5 15a6.73 6.73 0 0 0-1.5 3.33 1.51 1.51 0 1 0 3 0zM11 20.33A6.78 6.78 0 0 0 9.5 17 6.73 
                    6.73 0 0 0 8 20.33 1.59 1.59 0 0 0 9.5 22a1.59 1.59 0 0 0 1.5-1.67zM16 20.33A6.78 6.78 0 0 0 14.5 17a6.73 6.73 0 0 0-1.5 
                    3.33A1.59 1.59 0 0 0 14.5 22a1.59 1.59 0 0 0 1.5-1.67zM6 18.33A6.78 6.78 0 0 0 4.5 15 6.73 6.73 0 0 0 3 18.33 1.59 1.59 
                    0 0 0 4.5 20 1.59 1.59 0 0 0 6 18.33zM2 12h20v2H2zM13 4.07V2h-2v2.07A8 8 0 0 0 4.07 11h15.86A8 8 0 0 0 13 4.07z"
                    />
                </Svg>
            )
        },
        {
            name: 'Wear lightweight, loose-fitting clothing',
            description: 'Help your body stay cool and comfortable, and protect your skin from the sun\'s harmful rays.',
            icon: (
                <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill='rgba(186, 230, 253, 1)'
                >
                    <Path
                        d="M21.316 4.055C19.556 3.478 15 1.985 15 2a3 3 0 1 1-6 0c0-.015-4.556 1.478-6.317 2.055A.992.992 0 0 0 2 
                    5.003v3.716a1 1 0 0 0 1.242.97L6 9v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9l2.758.689A1 1 0 0 0 22 8.719V5.003a.992.992 
                    0 0 0-.684-.948z"
                    />
                </Svg>
            )
        },
        {
            name: 'Shades and breaks',
            description: 'Take frequent breaks in shaded or air-conditioned areas to rest and cool down, especially during outdoor activities in hot weather.',
            icon: (
                <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill='rgba(187, 247, 208, 1)'
                >
                    <Path
                        d="m18 10-6-8-6 8h3l-5 8h7v4h2v-4h7l-5-8h3z"
                    />
                </Svg>
            )
        },
    ];

    let filteredItems = [];
    if (todayForecast >= 27 && todayForecast <= 32) {
        filteredItems = whatDo.filter(item => ['Shades and breaks', 'Take showers', 'Drink your water, beshie'].includes(item.name));
    } else if (todayForecast >= 33 && todayForecast <= 41) {
        filteredItems = whatDo.filter(item => ['Protect your body', 'Limit Outdoor Activities', 'Drink your water, beshie', 'Take showers'].includes(item.name));
    } else if (todayForecast >= 42 && todayForecast <= 54) {
        filteredItems = whatDo.filter(item => ['Protect your body', 'Limit Outdoor Activities', 'Drink your water, beshie', 'Take showers', 'Check on Others'].includes(item.name));
    } else if (todayForecast >= 55) {
        filteredItems = whatDo.filter(item => ['Protect your body', 'Limit Outdoor Activities', 'Drink your water, beshie', 'Take showers', 'Check on Others', 'Wear lightweight, loose-fitting clothing', 'Shades and breaks'].includes(item.name));
    }

    return (
        <View className="flex flex-col">
            {filteredItems.map((item, index) => (
                <View key={index} className="flex-row items-center bg-slate-800 p-4 mb-4 rounded-lg">
                    <View className="mr-4">
                        {item.icon}
                    </View>
                    <View className="flex-1">
                        <Text className="text-white text-lg font-bold">{item.name}</Text>
                        <Text className="text-white text-sm">{item.description}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default WhatCanYouDo;