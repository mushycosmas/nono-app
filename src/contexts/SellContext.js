import React, { createContext, useContext, useState } from "react";

const SellContext = createContext(null);

// ✅ SAFE INITIAL STATE (NO NULL CRASH)
const initialState = {
  category: null,
  subcategory: null,
  location: {
    country: null,
    region: null,
    district_id: null,
    district_name: "",
  },
};

export const SellProvider = ({ children }) => {
  const [category, setCategory] = useState(initialState.category);
  const [subcategory, setSubcategory] = useState(initialState.subcategory);
  const [location, setLocation] = useState(initialState.location);

  // ================= SET FULL LOCATION =================
  const setFullLocation = (data) => {
    setLocation({
      country: data?.country || null,
      region: data?.region || null,
      district_id: data?.district_id || null,
      district_name: data?.district_name || "",
    });
  };

  // ================= PRELOAD (FOR EDIT SCREEN) =================
  const preloadLocation = (product) => {
    if (!product) return;

    setLocation({
      country: product.country || null,
      region: product.region || null,
      district_id: product.district_id || null,
      district_name:
        product.district_name || product.location || "",
    });
  };

  // ================= RESET =================
  const resetSell = () => {
    setCategory(null);
    setSubcategory(null);
    setLocation(initialState.location);
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
        setFullLocation,     // ✅ better setter
        preloadLocation,     // ✅ for edit screen

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