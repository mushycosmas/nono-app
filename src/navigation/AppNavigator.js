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
import SubcategoryList from "../screens/SubcategoryList";
import CategoryProducts from "../screens/CategoryProducts";
import CategorySelectScreen from "../screens/CategorySelectScreen";
import LocationSelect from "../screens/LocationSelectScreen";

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

        {/* Products Screen */}
        <Stack.Screen
          name="Products"
          component={ProductsScreen}
          options={{ title: "Products" }}
        />

        {/* My Ads */}
        <Stack.Screen name="MyAds" component={MyAdsScreen} />

        {/* Settings */}
        <Stack.Screen name="Settings" component={SettingsScreen} />

        {/* Edit Product */}
        <Stack.Screen name="EditProduct" component={EditProductScreen} />

        {/* Search Results */}
        <Stack.Screen name="SearchResults" component={SearchResults} />

        {/* Subcategory List */}
        <Stack.Screen
          name="SubcategoryList"
          component={SubcategoryList}
          options={({ route }) => ({ title: route.params.categoryName })}
        />

        {/* Category Products */}
        <Stack.Screen
          name="CategoryProducts"
          component={CategoryProducts}
          options={({ route }) => ({
            title: route.params.subcategoryName || "Products",
          })}
        />
         {/* Category Select Screen */}
        <Stack.Screen
          name="CategorySelect" // <-- This is now registered
          component={CategorySelectScreen}
          options={{ title: "Select Category" }}
        />

        {/* LocationSelectScreen */}

        <Stack.Screen
          name="LocationSelect" // <-- This is now registered
          component={LocationSelect}
          options={{ title: "Select Category" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}