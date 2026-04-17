import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import ProductDetails from "../screens/ProductDetails";
import SearchResults from "../screens/SearchResults";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";


const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
       <Stack.Screen name="ProductDetails" component={ProductDetails} />
       <Stack.Screen name="SearchResults" component={SearchResults} />
       <Stack.Screen name="Register" component={RegisterScreen} />
       <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}