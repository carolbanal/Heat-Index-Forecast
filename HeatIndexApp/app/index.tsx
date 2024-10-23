import React, { useEffect, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ConfusionMatrix from './ConfusionMatrix';
import Svg, { Path } from 'react-native-svg';

// Prevent auto-hiding of the splash screen
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

const Index: React.FC = () => {
  const onLayoutRootView = useCallback(async () => {
    // Keep the splash screen visible for 3 seconds
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 3000);
  }, []);

  useEffect(() => {
    onLayoutRootView(); // Ensure the splash screen hides properly after 3 seconds
  }, [onLayoutRootView]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: 'rgba(31, 41, 55, 1)' },
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'white',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 960 960" fill={color}>
              <Path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
            </Svg>
          ),
        }}
      />
      <Tab.Screen
        name="ConfusionMatrix"
        component={ConfusionMatrix}
        options={{
          tabBarIcon: ({ color }) => (
            <Svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 960 960" fill={color}>
              <Path d="M280-280h160v-160H280v160Zm240 0h160v-160H520v160ZM280-520h160v-160H280v160Zm240 0h160v-160H520v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
            </Svg>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Index;