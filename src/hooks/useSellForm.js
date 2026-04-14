import { useState } from "react";

const getInitialForm = () => ({
  name: "",
  price: "",
  description: "",
  location: "",
  status: "active",
  category_id: "",
  subcategory_id: "",
  district_id: "",
});

const getInitialTiers = () => [
  { min_qty: 1, max_qty: 5, whole_seller_price: "" },
];

export default function useSellForm() {
  // ================= FORM =================
  const [form, setForm] = useState(getInitialForm());

  // ================= IMAGES =================
  const [newImages, setNewImages] = useState([]);

  // ================= WHOLESALE =================
  const [wholesaleTiers, setWholesaleTiers] = useState(getInitialTiers());

  // ================= STATUS =================
  const [submitting, setSubmitting] = useState(false);

  // ================= CATEGORY / LOCATION STATE =================
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [location, setLocation] = useState(null);
  const [fullLocation, setFullLocation] = useState(null);

  // ================= WHOLESALE FUNCTIONS =================
  const addTier = () => {
    setWholesaleTiers((prev) => [
      ...prev,
      { min_qty: 1, max_qty: 5, whole_seller_price: "" },
    ]);
  };

  const updateTier = (index, field, value) => {
    setWholesaleTiers((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value,
      };
      return copy;
    });
  };

  const removeTier = (index) => {
    setWholesaleTiers((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ================= RESET =================
  const resetForm = () => {
    setForm(getInitialForm());
    setNewImages([]);
    setWholesaleTiers(getInitialTiers());
    setSubmitting(false);

    setCategory(null);
    setSubcategory(null);
    setLocation(null);
    setFullLocation(null);
  };

  return {
    // FORM
    form,
    setForm,

    // IMAGES
    newImages,
    setNewImages,

    // WHOLESALE
    wholesaleTiers,
    setWholesaleTiers,
    addTier,
    updateTier,
    removeTier,

    // STATUS
    submitting,
    setSubmitting,

    // CATEGORY
    category,
    setCategory,
    subcategory,
    setSubcategory,

    // LOCATION
    location,
    setLocation,
    fullLocation,
    setFullLocation,

    // RESET
    resetForm,
  };
}