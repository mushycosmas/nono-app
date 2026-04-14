import { useState, useEffect } from "react";
import { Alert } from "react-native";

const BASE_URL = "https://nono.co.tz";

export const useEditProduct = (product = {}) => {
  // ================= FORM =================
  const [form, setForm] = useState({
    name: product.name || "",
    price: String(product.price || ""),
    description: product.product_description || "",
    location: product.location || "",
    status: product.status || "active",
    category_id: String(product.category_id || ""),
    subcategory_id: String(product.subcategory_id || ""),
  });

  // ================= IMAGES =================
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // ================= WHOLESALE =================
  const [wholesaleTiers, setWholesaleTiers] = useState(
    Array.isArray(product.wholesale_tiers) && product.wholesale_tiers.length
      ? product.wholesale_tiers
      : [{ min_qty: 1, max_qty: 5, whole_seller_price: "" }]
  );

  // ================= STATE =================
  const [submitting, setSubmitting] = useState(false);

  // ================= LOAD EXISTING IMAGES =================
  useEffect(() => {
    if (product?.images) {
      const formatted = product.images.map((img) =>
        typeof img === "string" && img.startsWith("http")
          ? img
          : `${BASE_URL}${img}`
      );
      setExistingImages(formatted);
    }
  }, [product]);

  // ================= UPDATE FUNCTION =================
  const updateProduct = async ({ locationPreview }) => {
    if (!form.name || !form.price || !form.location) {
      Alert.alert("Error", "Missing required fields");
      return false;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      // BASIC FIELDS (clean loop)
      Object.entries({
        name: form.name,
        price: form.price,
        product_description: form.description || "",
        location: form.location,
        status: form.status,
        category_id: form.category_id,
        subcategory_id: form.subcategory_id,
      }).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // LOCATION
      if (locationPreview?.id) {
        formData.append("district_id", locationPreview.id);
      }

      // WHOLESALE
      formData.append(
        "wholesale_tiers",
        JSON.stringify(wholesaleTiers || [])
      );

      // EXISTING IMAGES
      existingImages.forEach((img) => {
        const path =
          typeof img === "string"
            ? img.replace(BASE_URL, "")
            : "";

        if (path) {
          formData.append("existingImages[]", path);
        }
      });

      // NEW IMAGES
      newImages.forEach((img, i) => {
        formData.append("newImages[]", {
          uri: img.uri,
          type: "image/jpeg",
          name: `img_${i}.jpg`,
        });
      });

      const res = await fetch(
        `${BASE_URL}/api/seller/products/${product.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Update failed");
        return false;
      }

      Alert.alert("Success", "Product updated");
      return true;
    } catch (error) {
      console.log("Update Error:", error);
      Alert.alert("Error", "Network error");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // ================= RETURN =================
  return {
    form,
    setForm,

    existingImages,
    setExistingImages,

    newImages,
    setNewImages,

    wholesaleTiers,
    setWholesaleTiers,

    submitting,

    updateProduct,
  };
};