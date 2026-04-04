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
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

const BASE_URL = "https://nono.co.tz";

export default function EditProductScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;

  // ---------- HELPERS ----------
  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/100x100";
    if (img.startsWith("http")) return img;
    return `${BASE_URL}${img}`;
  };

  const getRelativePath = (url) => url.replace(BASE_URL, "");

  // ---------- FORM ----------
  const [form, setForm] = useState({
    name: product.name || "",
    price: product.price?.toString() || "",
    description: product.product_description || "",
    location: product.location || "",
    status: product.status || "active",
    category_id: product.category_id?.toString() || "1",
    subcategory_id: product.subcategory_id?.toString() || "11",
  });

  // ---------- IMAGES ----------
  const [images, setImages] = useState(
    (product.images || []).map((img) => getImageUrl(img))
  );
  const [newImages, setNewImages] = useState([]);

  // ---------- LOADING ----------
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // ---------- CATEGORIES ----------
  const staticCategories = [
    {
      id: "1",
      name: "Electronics",
      subcategories: [
        { id: "11", name: "Laptops" },
        { id: "12", name: "Phones" },
      ],
    },
    {
      id: "2",
      name: "Fashion",
      subcategories: [
        { id: "21", name: "Shirts" },
        { id: "22", name: "Shoes" },
      ],
    },
  ];

  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  useEffect(() => {
    const cat = staticCategories.find((c) => c.id === form.category_id);
    if (cat) setFilteredSubcategories(cat.subcategories);
  }, [form.category_id]);

  // ---------- WHOLESALE ----------
  const [wholesaleTiers, setWholesaleTiers] = useState(
    product.wholesale_tiers || [
      { min_qty: 1, max_qty: 5, whole_seller_price: "" },
    ]
  );

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

  // ---------- IMAGE PICKER ----------
  const pickImages = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setNewImages((prev) => [...prev, ...result.assets]);
    }
  };

  const removeImage = (uri) =>
    setImages((prev) => prev.filter((i) => i !== uri));

  const removeNewImage = (index) =>
    setNewImages((prev) => prev.filter((_, i) => i !== index));

  // ---------- SUBMIT ----------
  const handleUpdate = async () => {
    if (loading) return;

    if (!form.name || !form.price || !form.location) {
      Alert.alert("Error", "Fill all required fields");
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("product_description", form.description);
    formData.append("location", form.location);
    formData.append("status", form.status);
    formData.append("subcategory_id", form.subcategory_id);
    formData.append("wholesale_tiers", JSON.stringify(wholesaleTiers));

    // existing images
    images.forEach((img) => {
      formData.append("existingImages", getRelativePath(img));
    });

    // new images
    newImages.forEach((img, idx) => {
      formData.append("newImages[]", {
        uri: img.uri,
        type: "image/jpeg",
        name: `image_${idx}.jpg`,
      });
    });

    const xhr = new XMLHttpRequest();

    xhr.open(
      "PUT",
      `${BASE_URL}/api/seller/products/${product.id}`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setLoading(false);

      if (xhr.status === 200) {
        Alert.alert("Success", "Product updated");

        // 🔥 AUTO REFRESH + REDIRECT
        navigation.navigate("MyAds", {
          refresh: true,
        });
      } else {
        Alert.alert("Error", "Update failed");
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      Alert.alert("Error", "Upload failed");
    };

    xhr.send(formData);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Edit Product</Text>

        {/* PROGRESS */}
        {loading && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}

        {/* IMAGES */}
        <Text style={styles.label}>Images</Text>
        <ScrollView horizontal>
          {images.map((img, i) => (
            <View key={i} style={styles.imageWrapper}>
              <Image source={{ uri: img }} style={styles.image} />
              <TouchableOpacity onPress={() => removeImage(img)}>
                <Icon name="close-circle" size={22} color="red" />
              </TouchableOpacity>
            </View>
          ))}

          {newImages.map((img, i) => (
            <View key={i} style={styles.imageWrapper}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              <TouchableOpacity onPress={() => removeNewImage(i)}>
                <Icon name="close-circle" size={22} color="red" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity onPress={pickImages}>
            <Icon name="add-circle-outline" size={40} color="green" />
          </TouchableOpacity>
        </ScrollView>

        {/* FORM */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(t) => setForm({ ...form, name: t })}
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={form.price}
          keyboardType="numeric"
          onChangeText={(t) => setForm({ ...form, price: t })}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={form.description}
          onChangeText={(t) => setForm({ ...form, description: t })}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={form.location}
          onChangeText={(t) => setForm({ ...form, location: t })}
        />

        {/* STATUS */}
        <Text style={styles.label}>Status</Text>
        <View style={{ flexDirection: "row" }}>
          {["active", "inactive"].map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.option,
                form.status === s && styles.optionSelected,
              ]}
              onPress={() => setForm({ ...form, status: s })}
            >
              <Text>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CATEGORY */}
        <Text style={styles.label}>Category</Text>
        {staticCategories.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[
              styles.option,
              form.category_id === c.id && styles.optionSelected,
            ]}
            onPress={() =>
              setForm({ ...form, category_id: c.id })
            }
          >
            <Text>{c.name}</Text>
          </TouchableOpacity>
        ))}

        {/* SUBCATEGORY */}
        <Text style={styles.label}>Subcategory</Text>
        {filteredSubcategories.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.option,
              form.subcategory_id === s.id &&
                styles.optionSelected,
            ]}
            onPress={() =>
              setForm({ ...form, subcategory_id: s.id })
            }
          >
            <Text>{s.name}</Text>
          </TouchableOpacity>
        ))}

        {/* WHOLESALE */}
        <Text style={styles.label}>Wholesale Tiers</Text>
        <FlatList
          data={wholesaleTiers}
          scrollEnabled={false}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.tierRow}>
              <TextInput
                style={styles.tierInput}
                value={item.min_qty.toString()}
                onChangeText={(v) =>
                  updateTier(index, "min_qty", v)
                }
                placeholder="Min"
              />
              <TextInput
                style={styles.tierInput}
                value={item.max_qty.toString()}
                onChangeText={(v) =>
                  updateTier(index, "max_qty", v)
                }
                placeholder="Max"
              />
              <TextInput
                style={styles.tierInput}
                value={item.whole_seller_price}
                onChangeText={(v) =>
                  updateTier(index, "whole_seller_price", v)
                }
                placeholder="Price"
              />
              <TouchableOpacity onPress={() => removeTier(index)}>
                <Icon name="close-circle" size={22} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity onPress={addTier}>
          <Text style={{ color: "green" }}>+ Add Tier</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* BUTTON */}
      <TouchableOpacity
        style={[styles.btn, loading && { backgroundColor: "#999" }]}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? `Uploading ${progress}%` : "Update Product"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  label: { marginTop: 10, fontWeight: "600" },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },

  btn: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "bold" },

  imageWrapper: { marginRight: 10 },
  image: { width: 100, height: 100, borderRadius: 8 },

  option: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 5,
  },

  optionSelected: { backgroundColor: "#ddd" },

  tierRow: { flexDirection: "row", alignItems: "center" },
  tierInput: {
    borderWidth: 1,
    flex: 1,
    marginRight: 5,
    padding: 5,
    borderRadius: 5,
  },

  progressContainer: {
    height: 25,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#28a745",
  },

  progressText: {
    position: "absolute",
    alignSelf: "center",
    fontWeight: "bold",
  },
});