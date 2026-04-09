import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// ✅ Use STACKS (not screens)
import HomeStack from "./HomeStack"; 
import ProfileStack from './ProfileStack';

// Optional (keep if you want later)
// import SavedScreen from '../screens/SavedScreen';
// import MessagesScreen from '../screens/MessagesScreen';

import SellScreen from '../screens/SellScreen';

const Tab = createBottomTabNavigator();

export default function BottomNavBar() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#28a745',
      }}
    >
      {/* ✅ Home uses HomeStack */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          ),
        }}
      />

      {/* ✅ Sell stays normal */}
      <Tab.Screen
        name="Sell"
        component={SellScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="add-circle" size={28} color={color} />
          ),
        }}
      />

      {/* ✅ Profile uses ProfileStack */}
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}