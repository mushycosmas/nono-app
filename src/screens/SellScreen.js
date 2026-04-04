import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Alert,
} from "react-native";
import { fetchCategories } from "../api/api";
import Icon from "react-native-vector-icons/Ionicons";

export default function SellScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    // Fetch categories from API
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.log("Error fetching categories:", err));
  }, []);

  const handleSubmit = () => {
    if (!productName || !price || !selectedCategory) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return;
    }

    const newProduct = {
      name: productName,
      price: parseFloat(price),
      category: selectedCategory,
      description,
      image: imageUri,
    };

    // For now, just alert the product info
    Alert.alert("Product Submitted", JSON.stringify(newProduct, null, 2));
    
    // Reset form
    setProductName("");
    setPrice("");
    setDescription("");
    setImageUri(null);
    setSelectedCategory(null);
  };

  const handlePickImage = () => {
    // For now we just use a placeholder image
    setImageUri("https://placekitten.com/300/200");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Sell a Product</Text>

      <Text style={styles.label}>Product Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={productName}
        onChangeText={setProductName}
      />

      <Text style={styles.label}>Price (Tsh) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Category *</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              selectedCategory?.id === cat.id && styles.categorySelected,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory?.id === cat.id && { color: "#fff" },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Enter product description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Product Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Icon name="camera" size={30} color="#666" />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 14, fontWeight: "600", marginTop: 10, marginBottom: 5 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "android" ? 6 : 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  categoryContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 20,
    marginBottom: 10,
  },
  categorySelected: { backgroundColor: "#28a745" },
  categoryText: { fontSize: 14 },
  imagePicker: {
    width: "100%",
    height: 200,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 5,
  },
  image: { width: "100%", height: "100%", borderRadius: 8 },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});