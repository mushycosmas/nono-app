import React, { useCallback, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

import { useAuth } from "../contexts/AuthContext";

// Screens
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack";
import SellScreen from "../screens/SellScreen";

// 🔥 Auth Bottom Sheet
import AuthModal from "../screens/Auth/AuthModal";

const Tab = createBottomTabNavigator();

export default function BottomNavBar() {
  const { user } = useAuth();
  const navigation = useNavigation();

  // 🔥 control bottom sheet
  const [authVisible, setAuthVisible] = useState(false);
  const [targetScreen, setTargetScreen] = useState(null);

  // 🔒 Protect Sell/Profile
  const handleProtectedRoute = useCallback(
    (e, screen) => {
      if (!user) {
        e.preventDefault();

        setTargetScreen(screen);
        setAuthVisible(true); // 🚀 open bottom sheet
      }
    },
    [user]
  );

  return (
    <>
      {/* ================= TAB NAV ================= */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#28a745",
          tabBarInactiveTintColor: "#777",
        }}
      >
        {/* 🏠 HOME (PUBLIC) */}
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="home-outline" size={24} color={color} />
            ),
          }}
        />

        {/* 🔒 SELL */}
        <Tab.Screen
          name="Sell"
          component={SellScreen}
          listeners={{
            tabPress: (e) => handleProtectedRoute(e, "Sell"),
          }}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="add-circle-outline" size={28} color={color} />
            ),
          }}
        />

        {/* 🔒 PROFILE */}
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          listeners={{
            tabPress: (e) => handleProtectedRoute(e, "Profile"),
          }}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="person-outline" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>

      {/* ================= AUTH MODAL ================= */}
      <AuthModal
        visible={authVisible}
        onClose={() => setAuthVisible(false)}
        navigation={navigation}
        redirectTo={targetScreen} // optional future use
      />
    </>
  );
}