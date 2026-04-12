import React, { createContext, useContext, useState } from "react";

const SellContext = createContext(null);

const initialState = {
  category: null,
  subcategory: null,
  location: null,
};

export const SellProvider = ({ children }) => {
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [location, setLocation] = useState(null);

  // ================= RESET FUNCTION =================
  const resetSell = () => {
    setCategory(null);
    setSubcategory(null);
    setLocation(null);
  };

  return (
    <SellContext.Provider
      value={{
        category,
        setCategory,
        subcategory,
        setSubcategory,
        location,
        setLocation,

        // 🔥 ADD THIS
        resetSell,
      }}
    >
      {children}
    </SellContext.Provider>
  );
};

export const useSell = () => {
  const context = useContext(SellContext);

  if (!context) {
    throw new Error("useSell must be used inside SellProvider");
  }

  return context;
};