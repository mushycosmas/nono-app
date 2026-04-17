import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { SellProvider } from "./src/contexts/SellContext";
import NetworkWrapper from "./src/components/common/NetworkWrapper";
import { AuthProvider } from "./src/contexts/AuthContext";

export default function App() {

  const refreshAppData = () => {
    console.log("Internet back → refresh data");
    // 👉 call your global APIs here if needed
    // example: refetch ads, categories, etc.
  };

  return (
    <AuthProvider>
      <SellProvider>
        <NetworkWrapper onReconnect={refreshAppData}>
          <AppNavigator />
        </NetworkWrapper>
      </SellProvider>
    </AuthProvider>
  );
}