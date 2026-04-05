// src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs"; // your BottomTabs navigator
import ProductDetails from "../screens/ProductDetails";
import ProductsScreen from "../screens/ProductsScreen";
import MyAdsScreen from "../screens/MyAdsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import EditProductScreen from "../screens/EditProductScreen";
import SearchResults from "../screens/SearchResults";



const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Bottom Tabs: Home, Cart, Contact */}
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

        {/* Product details screen */}
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{ title: "Product Details" }}
        />

        {/* Optional: ProductsScreen if needed */}
        <Stack.Screen
          name="Products"
          component={ProductsScreen}
          options={{ title: "Products" }}
        />
        <Stack.Screen name="MyAds" component={MyAdsScreen} />

        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditProduct" component={EditProductScreen} />
         <Stack.Screen name="SearchResults" component={SearchResults} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}