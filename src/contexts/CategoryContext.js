import React, { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [pendingSelection, setPendingSelection] = useState(null);

  const selectCategory = (category, subcategory) => {
    if (pendingSelection) {
      pendingSelection(category, subcategory);
      setPendingSelection(null);
    }
  };

  const waitForCategorySelection = (callback) => {
    setPendingSelection(() => callback);
  };

  return (
    <CategoryContext.Provider value={{ waitForCategorySelection, selectCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);