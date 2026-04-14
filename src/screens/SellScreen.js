import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import useSellForm from "../hooks/useSellForm";
import CategorySection from "../components/sell/CategorySection";
import ImagePickerSection from "../components/sell/ImagePickerSection";
import ProductFormSection from "../components/sell/ProductFormSection";
import StatusSection from "../components/sell/StatusSection";
import WholesalePriceSection from "../components/sell/WholesalePriceSection";
import LocationCountry from "../components/sell/LocationCountry";
import LocationSection from "../components/sell/LocationSection";

import { useSell } from "../contexts/SellContext";

const BASE_URL = "https://nono.co.tz";

export default function SellScreen() {
  const navigation = useNavigation();

  const {
    form,
    setForm,
    newImages,
    setNewImages,
    wholesaleTiers,
    setWholesaleTiers,
    addTier,
    updateTier,
    removeTier,
    submitting,
    setSubmitting,
    resetForm,
  } = useSellForm();

  const { category, subcategory, location, resetSell } = useSell();

  const [manualLocation, setManualLocation] = useState("");

  // ✅ FIX: missing state for preview
  const [locationPreview, setLocationPreview] = useState(null);

  // ================= SYNC =================
  useEffect(() => {
    if (category?.id && subcategory?.id) {
      setForm((prev) => ({
        ...prev,
        category_id: category.id,
        subcategory_id: subcategory.id,
      }));
    }

    if (location?.district_id) {
      // ✅ preview UI
      setLocationPreview({
        id: location.district_id,
        name:
          `${location.country?.name || ""} > ` +
          `${location.region?.name || ""} > ` +
          `${location.district_name || ""}`,
      });

      // ✅ form update
      setForm((prev) => ({
        ...prev,
        district_id: location.district_id,
      }));
    }
  }, [category, subcategory, location]);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      return Alert.alert("Error", "Name and price required");
    }

    if (!form.category_id || !form.subcategory_id) {
      return Alert.alert("Error", "Select category");
    }

    const finalLocation = manualLocation || form.location || "";

    if (!finalLocation) {
      return Alert.alert("Error", "Enter location");
    }

    if (!newImages.length) {
      return Alert.alert("Error", "Add at least 1 image");
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", String(form.name));
      formData.append("price", String(form.price));
      formData.append("product_description", String(form.description || ""));
      formData.append("location", finalLocation);
      formData.append("status", form.status || "active");
      formData.append("category_id", String(form.category_id));
      formData.append("subcategory_id", String(form.subcategory_id));
      formData.append("district_id", String(form.district_id || ""));
      formData.append("user_id", "1");

      formData.append(
        "wholesale_tiers",
        JSON.stringify(wholesaleTiers || [])
      );

      newImages.forEach((img, i) => {
        formData.append("images[]", {
          uri: img.uri,
          type: "image/jpeg",
          name: `image_${i}.jpg`,
        });
      });

      const res = await fetch(`${BASE_URL}/api/ads`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        return Alert.alert("Error", data.message || "Failed to post");
      }

      Alert.alert("Success", "Product posted successfully!");

      resetSell?.();
      resetForm?.();

      setForm({
        name: "",
        price: "",
        description: "",
        location: "",
        status: "active",
        category_id: "",
        subcategory_id: "",
        district_id: "",
      });

      setNewImages([]);
      setManualLocation("");
      setLocationPreview(null);

      setWholesaleTiers([
        { min_qty: 1, max_qty: 5, whole_seller_price: "" },
      ]);

      navigation.navigate("MyAds");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= ADD TIER =================
  const handleAddTier = () => {
    setWholesaleTiers((prev) => [
      ...prev,
      { min_qty: 1, max_qty: 5, whole_seller_price: "" },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

          <ImagePickerSection
            newImages={newImages}
            setNewImages={setNewImages}
            styles={styles}
          />

          <CategorySection
            navigation={navigation}
            category={category}
            subcategory={subcategory}
            styles={styles}
          />

          {/* ✅ FIX: use preview instead of raw location */}
          <LocationCountry
            navigation={navigation}
            location={locationPreview}
            styles={styles}
          />

          <LocationSection
            form={form}
            setForm={setForm}
            manualLocation={manualLocation}
            setManualLocation={setManualLocation}
            styles={styles}
          />

          <ProductFormSection
            form={form}
            setForm={setForm}
            styles={styles}
          />

          <WholesalePriceSection
            wholesaleTiers={wholesaleTiers || []}
            addTier={handleAddTier}
            updateTier={updateTier}
            removeTier={removeTier}
            styles={styles}
          />

          <StatusSection
            form={form}
            setForm={setForm}
            styles={styles}
          />

        </ScrollView>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Post Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


// ================= STYLES =================
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1, paddingHorizontal: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12, elevation: 2 },
  label: { fontSize: 12, fontWeight: "600", color: "#555", marginTop: 8 },
  input: { backgroundColor: "#f9f9f9", borderRadius: 8, padding: 10, marginTop: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  row: { flexDirection: "row", marginTop: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: "#eee", marginRight: 6, marginTop: 6 },
  chipActive: { backgroundColor: "#28a745" },
  imageCard: { marginRight: 10, position: "relative" },
  image: { width: 100, height: 100, borderRadius: 10 },
  removeBtn: { position: "absolute", top: 5, right: 5, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 20, padding: 3 },
  addImageBtn: { width: 100, height: 100, borderRadius: 10, borderWidth: 2, borderColor: "#28a745", justifyContent: "center", alignItems: "center" },
  tierRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  tierInput: { flex: 1, backgroundColor: "#f9f9f9", marginRight: 5, padding: 8, borderRadius: 6 },
  submitBtn: { position: "absolute", bottom: 1, left: 15, right: 15, backgroundColor: "#28a745", padding: 15, borderRadius: 12, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "bold" },
});