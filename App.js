import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { SellProvider } from "./src/contexts/SellContext";

export default function App() {
  return (
    <SellProvider>
   
        <AppNavigator />
      
    </SellProvider>
  );
}