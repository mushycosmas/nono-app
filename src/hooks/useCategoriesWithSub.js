// src/hooks/useCategoriesWithSub.js
import { useState, useEffect } from "react";
import { fetchCategories } from "../api/api";

export const useCategoriesWithSub = (initialCategoryId = null, initialSubcategoryId = null) => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(initialCategoryId);
  const [subcategory, setSubcategory] = useState(initialSubcategoryId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories(); // returns categories with subcategories
        setCategories(data);

        // Set default category/subcategory if not provided
        if (!initialCategoryId && data.length > 0) {
          setCategory(data[0].id);
          setSubcategory(data[0].subcategories?.[0]?.id || null);
        }
      } catch (err) {
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Update subcategory when category changes
  useEffect(() => {
    if (!category) return;
    const cat = categories.find((c) => c.id === category);
    if (cat && !cat.subcategories.some((s) => s.id === subcategory)) {
      setSubcategory(cat.subcategories?.[0]?.id || null);
    }
  }, [category, categories]);

  const getSubcategories = () => {
    const cat = categories.find((c) => c.id === category);
    return cat?.subcategories || [];
  };

  return {
    categories,
    category,
    setCategory,
    subcategory,
    setSubcategory,
    getSubcategories,
    loading,
    error,
  };
};