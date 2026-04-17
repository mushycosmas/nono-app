import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabs from "./BottomTabs";
import AuthStack from "./AuthStack";

// App screens
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

        {/* 🌍 Main App (Always accessible) */}
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

        {/* 🔐 Auth Screens (overlay flow) */}
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ headerShown: false }}
        />

        {/* 📦 Other Screens */}
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{ title: "Product Details" }}
        />

        <Stack.Screen
          name="Products"
          component={ProductsScreen}
          options={{ title: "Products" }}
        />

        <Stack.Screen name="MyAds" component={MyAdsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditProduct" component={EditProductScreen} />
        <Stack.Screen name="SearchResults" component={SearchResults} />

        <Stack.Screen
          name="SubcategoryList"
          component={SubcategoryList}
          options={({ route }) => ({
            title: route.params?.categoryName || "Subcategories",
          })}
        />

        <Stack.Screen
          name="CategoryProducts"
          component={CategoryProducts}
          options={({ route }) => ({
            title: route.params?.subcategoryName || "Products",
          })}
        />

        <Stack.Screen
          name="CategorySelect"
          component={CategorySelectScreen}
          options={{ title: "Select Category" }}
        />

        <Stack.Screen
          name="LocationSelect"
          component={LocationSelect}
          options={{ title: "Select Location" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}