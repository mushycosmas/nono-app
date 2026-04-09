import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

const BASE_URL = "https://nono.co.tz"; // your backend domain

export default function SellScreen() {
  const navigation = useNavigation();

  // --- Form state ---
  const initialFormState = {
    name: "",
    price: "",
    description: "",
    location: "",
    status: "active",
    category_id: "1",
    subcategory_id: "11",
  };

  const [form, setForm] = useState(initialFormState);

  // --- Images ---
  const [images, setImages] = useState([]); 
  const [newImages, setNewImages] = useState([]);
  const [imageError, setImageError] = useState({});

  // --- Categories ---
  const staticCategories = [
    { id: "1", name: "Electronics", subcategories: [{ id: "11", name: "Laptops" }, { id: "12", name: "Phones" }] },
    { id: "2", name: "Fashion", subcategories: [{ id: "21", name: "Shirts" }, { id: "22", name: "Shoes" }] },
  ];

  const [filteredSubcategories, setFilteredSubcategories] = useState(staticCategories[0].subcategories);

  useEffect(() => {
    const category = staticCategories.find((c) => c.id === form.category_id);
    if (category) {
      setFilteredSubcategories(category.subcategories);
      if (!category.subcategories.some((s) => s.id === form.subcategory_id)) {
        setForm({ ...form, subcategory_id: category.subcategories[0].id });
      }
    }
  }, [form.category_id]);

  // --- Wholesale tiers ---
  const [wholesaleTiers, setWholesaleTiers] = useState([{ min_qty: 1, max_qty: 5, whole_seller_price: "" }]);
  const addTier = () => setWholesaleTiers((prev) => [...prev, { min_qty: 1, max_qty: 5, whole_seller_price: "" }]);
  const updateTier = (index, field, value) => {
    const updated = [...wholesaleTiers];
    updated[index][field] = field === "whole_seller_price" ? value : Number(value);
    setWholesaleTiers(updated);
  };
  const removeTier = (index) => setWholesaleTiers((prev) => prev.filter((_, i) => i !== index));

  // --- Image picker (FIXED for production) ---
  const pickImages = async () => {
    try {
      // Request permissions
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Please allow access to gallery to add images");
        return;
      }

      // Launch image picker with better configuration
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: false,
        exif: false,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Process each selected image
        const validImages = result.assets.filter(asset => asset.uri);
        setNewImages((prev) => [...prev, ...validImages]);
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Failed to pick images. Please try again.");
    }
  };

  const removeImage = (uri) => setImages((prev) => prev.filter((i) => i !== uri));
  const removeNewImage = (index) => setNewImages((prev) => prev.filter((_, i) => i !== index));

  // --- Submission state ---
  const [submitting, setSubmitting] = useState(false);

  // --- Submit product (FIXED FormData for production) ---
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.location) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (newImages.length === 0 && images.length === 0) {
      Alert.alert("Error", "Please add at least one image");
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

    // Fix: Properly append images for production
    newImages.forEach((img, idx) => {
      const uri = img.uri;
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append("images[]", {
        uri: uri,
        name: `image_${Date.now()}_${idx}.jpg`,
        type: type,
      });
    });

    try {
      const res = await fetch(`${BASE_URL}/api/ads`, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          // Don't set Content-Type manually - let browser set it with boundary
        },
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
        
        navigation.navigate("MyAds", { refresh: true });
      }
    } catch (err) {
      console.log("Submit error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Sell a Product</Text>

          {/* Images Section - FIXED */}
          <Text style={styles.label}>Images (Required)</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.imageScrollView}
          >
            {/* Existing images */}
            {images.map((img, idx) => (
              <View key={`existing-${idx}`} style={styles.imageWrapper}>
                <Image 
                  source={{ uri: img }} 
                  style={styles.image}
                  onError={() => console.log('Failed to load image:', img)}
                />
                <TouchableOpacity 
                  style={styles.removeIcon} 
                  onPress={() => removeImage(img)}
                >
                  <Icon name="close-circle" size={24} color="#dc3545" />
                </TouchableOpacity>
              </View>
            ))}
            
            {/* Newly picked images */}
            {newImages.map((img, idx) => (
              <View key={`new-${idx}`} style={styles.imageWrapper}>
                <Image 
                  source={{ uri: img.uri }} 
                  style={styles.image}
                  onError={() => console.log('Failed to load new image:', img.uri)}
                />
                <TouchableOpacity 
                  style={styles.removeIcon} 
                  onPress={() => removeNewImage(idx)}
                >
                  <Icon name="close-circle" size={24} color="#dc3545" />
                </TouchableOpacity>
              </View>
            ))}
            
            {/* Add image button */}
            <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
              <Icon name="add-circle-outline" size={50} color="#28a745" />
              <Text style={styles.addImageText}>Add Photos</Text>
            </TouchableOpacity>
          </ScrollView>
          
          {newImages.length === 0 && images.length === 0 && (
            <Text style={styles.hintText}>Tap "Add Photos" to select product images</Text>
          )}

          {/* Form Fields */}
          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            placeholder="e.g., iPhone 12 Pro Max"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Price (TZS) *</Text>
          <TextInput
            style={styles.input}
            value={form.price}
            keyboardType="numeric"
            onChangeText={(text) => setForm({ ...form, price: text })}
            placeholder="Enter price in TZS"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            placeholder="Describe your product..."
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            value={form.location}
            onChangeText={(text) => setForm({ ...form, location: text })}
            placeholder="e.g., Dar es Salaam"
            placeholderTextColor="#999"
          />

          {/* Status */}
          <Text style={styles.label}>Status</Text>
          <View style={styles.rowButtons}>
            {["active", "inactive"].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.option, form.status === s && styles.optionSelected]}
                onPress={() => setForm({ ...form, status: s })}
              >
                <Text style={form.status === s && styles.optionSelectedText}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          {staticCategories.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.option, form.category_id === c.id && styles.optionSelected]}
              onPress={() => setForm({ ...form, category_id: c.id })}
            >
              <Text style={form.category_id === c.id && styles.optionSelectedText}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Subcategory */}
          <Text style={styles.label}>Subcategory</Text>
          {filteredSubcategories.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.option, form.subcategory_id === s.id && styles.optionSelected]}
              onPress={() => setForm({ ...form, subcategory_id: s.id })}
            >
              <Text style={form.subcategory_id === s.id && styles.optionSelectedText}>
                {s.name}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Wholesale tiers */}
          <Text style={styles.label}>Wholesale Tiers (Optional)</Text>
          <FlatList
            data={wholesaleTiers}
            scrollEnabled={false}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.tierRow}>
                <TextInput
                  value={item.min_qty.toString()}
                  onChangeText={(v) => updateTier(index, "min_qty", v)}
                  placeholder="Min Qty"
                  keyboardType="numeric"
                  style={styles.tierInput}
                  placeholderTextColor="#999"
                />
                <TextInput
                  value={item.max_qty.toString()}
                  onChangeText={(v) => updateTier(index, "max_qty", v)}
                  placeholder="Max Qty"
                  keyboardType="numeric"
                  style={styles.tierInput}
                  placeholderTextColor="#999"
                />
                <TextInput
                  value={item.whole_seller_price}
                  onChangeText={(v) => updateTier(index, "whole_seller_price", v)}
                  placeholder="Price"
                  keyboardType="numeric"
                  style={styles.tierInput}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => removeTier(index)}>
                  <Icon name="close-circle" size={24} color="#dc3545" />
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity style={styles.addTierBtn} onPress={addTier}>
            <Icon name="add-circle-outline" size={20} color="#28a745" />
            <Text style={styles.addTierText}>Add Wholesale Tier</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.btn, submitting && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Submit Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20,
    color: "#333",
  },
  label: { 
    marginTop: 15, 
    marginBottom: 8,
    fontWeight: "600", 
    fontSize: 14,
    color: "#555",
  },
  input: { 
    backgroundColor: "#fff", 
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  btn: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 15,
    marginTop: 0,
  },
  btnDisabled: {
    backgroundColor: "#aaa",
  },
  btnText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
  },
  imageScrollView: {
    flexDirection: "row",
    marginVertical: 10,
  },
  imageWrapper: { 
    marginRight: 12, 
    position: "relative",
  },
  image: { 
    width: 100, 
    height: 100, 
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  removeIcon: { 
    position: "absolute", 
    top: -8, 
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  addImageBtn: { 
    justifyContent: "center", 
    alignItems: "center",
    width: 100,
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#28a745",
    borderStyle: "dashed",
  },
  addImageText: {
    color: "#28a745",
    fontSize: 12,
    marginTop: 5,
  },
  hintText: {
    color: "#999",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  rowButtons: {
    flexDirection: "row",
    gap: 10,
  },
  option: { 
    padding: 10, 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    marginTop: 5,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  optionSelected: { 
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  optionSelectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tierRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 8,
    gap: 8,
  },
  tierInput: { 
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flex: 1, 
    padding: 8, 
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  addTierBtn: { 
    marginTop: 8, 
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addTierText: {
    color: "#28a745",
    fontSize: 14,
  },
});