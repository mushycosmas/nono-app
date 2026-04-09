import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { fetchCategories } from "../api/api";

const BASE_URL = "https://nono.co.tz"; // backend

export default function SellScreen() {
  const navigation = useNavigation();

  const initialFormState = {
    name: "",
    price: "",
    description: "",
    location: "",
    status: "active",
    category_id: "", // no preselect
    subcategory_id: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [wholesaleTiers, setWholesaleTiers] = useState([
    { min_qty: 1, max_qty: 5, whole_seller_price: "" },
  ]);

  // --- Fetch categories from API ---
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data || []);
      } catch (err) {
        console.log(err);
        Alert.alert("Error", "Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // --- Wholesale tiers helpers ---
  const addTier = () =>
    setWholesaleTiers((prev) => [
      ...prev,
      { min_qty: 1, max_qty: 5, whole_seller_price: "" },
    ]);
  const updateTier = (index, field, value) => {
    const updated = [...wholesaleTiers];
    updated[index][field] =
      field === "whole_seller_price" ? value : Number(value);
    setWholesaleTiers(updated);
  };
  const removeTier = (index) =>
    setWholesaleTiers((prev) => prev.filter((_, i) => i !== index));

  // --- Image picker ---
  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to gallery");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) setNewImages((prev) => [...prev, ...result.assets]);
  };

  const removeNewImage = (index) =>
    setNewImages((prev) => prev.filter((_, i) => i !== index));

  // --- Submit product ---
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.location) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (!form.category_id || !form.subcategory_id) {
      Alert.alert("Error", "Please select a category and subcategory");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("product_description", form.description);
    formData.append("location", form.location);
    formData.append("status", form.status);
    formData.append("category_id", form.category_id);
    formData.append("subcategory_id", form.subcategory_id);
    formData.append("user_id", "1");
    formData.append("wholesale_tiers", JSON.stringify(wholesaleTiers));

    newImages.forEach((img, idx) => {
      formData.append("images[]", {
        uri: img.uri,
        type: "image/jpeg",
        name: `image_${idx}.jpg`,
      });
    });

    try {
      const res = await fetch(`${BASE_URL}/api/ads`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Error", data.message || "Failed to save product");
      } else {
        Alert.alert("Success", "Product saved successfully!");
        setForm(initialFormState);
        setNewImages([]);
        setImages([]);
        setWholesaleTiers([{ min_qty: 1, max_qty: 5, whole_seller_price: "" }]);
        setCategory(null);
        setSubcategory(null);
        navigation.navigate("MyAds", { refresh: true });
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Images */}
          <Text style={styles.sectionTitle}>Images</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {newImages.map((img, idx) => (
              <View key={idx} style={styles.imageCard}>
                <Image
                  source={{ uri: img.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeNewImage(idx)}
                >
                  <Icon name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
              <Icon name="camera-outline" size={30} color="#28a745" />
            </TouchableOpacity>
          </ScrollView>

          {/* Product Info */}
          <View style={styles.card}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />

            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.price}
              onChangeText={(text) => setForm({ ...form, price: text })}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              multiline
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={form.location}
              onChangeText={(text) => setForm({ ...form, location: text })}
            />
          </View>

          {/* Status */}
          <View style={styles.card}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.row}>
              {["active", "inactive"].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, form.status === s && styles.chipActive]}
                  onPress={() => setForm({ ...form, status: s })}
                >
                  <Text style={form.status === s && { color: "#fff" }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category & Subcategory */}
          <View style={styles.card}>
            <Text style={styles.label}>Category</Text>
            {loadingCategories ? (
              <ActivityIndicator size="small" color="#28a745" />
            ) : (
              <TouchableOpacity
                style={styles.input}
                onPress={() =>
                  navigation.navigate("CategorySelect", {
                    categories,
                    onSelect: (cat, subcat) => {
                      setCategory(cat);
                      setSubcategory(subcat);
                      setForm({
                        ...form,
                        category_id: cat.id,
                        subcategory_id: subcat.id,
                      });
                    },
                  })
                }
              >
                <Text>
                  {category ? `${category.name} > ${subcategory?.name}` : "Select Category"}
                </Text>
                <Icon name="chevron-down" size={20} />
              </TouchableOpacity>
            )}
          </View>

          {/* Wholesale Tiers */}
          <View style={styles.card}>
            <Text style={styles.label}>Wholesale Tiers</Text>
            {wholesaleTiers.map((item, index) => (
              <View key={index} style={styles.tierRow}>
                <TextInput
                  style={styles.tierInput}
                  placeholder="Min"
                  keyboardType="numeric"
                  value={item.min_qty.toString()}
                  onChangeText={(v) => updateTier(index, "min_qty", v)}
                />
                <TextInput
                  style={styles.tierInput}
                  placeholder="Max"
                  keyboardType="numeric"
                  value={item.max_qty.toString()}
                  onChangeText={(v) => updateTier(index, "max_qty", v)}
                />
                <TextInput
                  style={styles.tierInput}
                  placeholder="Price"
                  keyboardType="numeric"
                  value={item.whole_seller_price}
                  onChangeText={(v) => updateTier(index, "whole_seller_price", v)}
                />
                <TouchableOpacity onPress={() => removeTier(index)}>
                  <Icon name="close-circle" size={22} color="#dc3545" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={addTier}>
              <Text style={{ color: "#28a745", marginTop: 5 }}>+ Add Tier</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
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