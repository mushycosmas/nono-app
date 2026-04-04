import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SavedScreen from '../screens/SavedScreen';
import SellScreen from '../screens/SellScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function BottomNavBar() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#28a745' }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} /> }} />
      {/* <Tab.Screen name="Saved" component={SavedScreen} options={{ tabBarIcon: ({ color }) => <Icon name="heart" size={24} color={color} /> }} /> */}
       <Tab.Screen name="Sell" component={SellScreen} options={{ tabBarIcon: ({ color }) => <Icon name="add-circle" size={24} color={color} /> }} /> 
      {/* <Tab.Screen name="Messages" component={MessagesScreen} options={{ tabBarIcon: ({ color }) => <Icon name="chatbubble" size={24} color={color} /> }} />*/}
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Icon name="person" size={24} color={color} /> }} /> 
    </Tab.Navigator>
  );
}