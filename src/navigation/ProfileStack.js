import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import MyAdsScreen from "../screens/MyAdsScreen";
import EditProductScreen from "../screens/EditProductScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      {/* Main Profile */}
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "My Profile" }}
      />

      {/* Settings */}
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />

      {/* My Ads */}
      <Stack.Screen
        name="MyAds"
        component={MyAdsScreen}
        options={{ title: "My Ads" }}
      />

      {/* Edit Product */}
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{ title: "Edit Product" }}
      />
    </Stack.Navigator>
  );
}