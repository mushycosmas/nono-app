import { useState } from "react";

export default function useSellForm() {
  const initialForm = {
    name: "",
    price: "",
    description: "",
    location: "",
    status: "active",
    category_id: "",
    subcategory_id: "",
    district_id: "",
  };

  const [form, setForm] = useState(initialForm);
  const [newImages, setNewImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // ✅ WHOLESALE STATE (FIXED)
  const [wholesaleTiers, setWholesaleTiers] = useState([
    { min_qty: 1, max_qty: 5, whole_seller_price: "" },
  ]);

  // ✅ ADD
  const addTier = () => {
    setWholesaleTiers((prev) => [
      ...prev,
      { min_qty: 1, max_qty: 5, whole_seller_price: "" },
    ]);
  };

  // ✅ UPDATE
  const updateTier = (index, field, value) => {
    setWholesaleTiers((prev) => {
      const updated = [...prev];
      updated[index][field] =
        field === "whole_seller_price" ? value : Number(value);
      return updated;
    });
  };

  // ✅ REMOVE
  const removeTier = (index) => {
    setWholesaleTiers((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    form,
    setForm,
    newImages,
    setNewImages,
    submitting,
    setSubmitting,

    // ✅ expose wholesale
    wholesaleTiers,
    addTier,
    updateTier,
    removeTier,
  };
}