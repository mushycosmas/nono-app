import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");
const IMAGE_SIZE = (width - 80) / 3;
const BASE_URL = "https://nono.co.tz";

export default function ImagePickerSection({
  newImages = [],
  setNewImages,
  existingImages = [],
  setExistingImages,
  styles,
}) {
  const MAX_IMAGES = 10;

  const allImagesCount = newImages.length + existingImages.length;
  const remainingSlots = MAX_IMAGES - allImagesCount;

  // ================= PICK IMAGES =================
  const pickImages = async () => {
    if (allImagesCount >= MAX_IMAGES) {
      return Alert.alert("Limit reached", "Maximum 10 images allowed");
    }

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return Alert.alert("Permission required", "Allow gallery access");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: remainingSlots,
    });

    if (!result.canceled) {
      setNewImages((prev) => [...prev, ...result.assets]);
    }
  };

  // ================= REMOVE NEW IMAGE =================
  const removeNew = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= REMOVE EXISTING IMAGE =================
  const removeExisting = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= RENDER URL =================
  const getImageUrl = (img) => {
    if (!img) return null;

    // new image
    if (img.uri) return img.uri;

    // existing image string
    if (typeof img === "string") {
      return img.startsWith("http")
        ? img
        : `${BASE_URL}${img}`;
    }

    return null;
  };

  return (
    <View style={[styles.card, { padding: 16 }]}>
      {/* HEADER */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={[styles.label, { fontSize: 16 }]}>Photos</Text>
        <Text style={{ fontSize: 12, color: "#666" }}>
          {allImagesCount}/{MAX_IMAGES}
        </Text>
      </View>

      {/* IMAGES */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 12 }}
      >
        {/* EXISTING IMAGES */}
        {existingImages.map((img, idx) => (
          <View
            key={`old-${idx}`}
            style={{
              marginRight: 10,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: getImageUrl(img) }}
              style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
            />

            <TouchableOpacity
              onPress={() => removeExisting(idx)}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                backgroundColor: "rgba(0,0,0,0.6)",
                borderRadius: 20,
                padding: 4,
              }}
            >
              <Icon name="close" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}

        {/* NEW IMAGES */}
        {newImages.map((img, idx) => (
          <View
            key={`new-${idx}`}
            style={{
              marginRight: 10,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: img.uri }}
              style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
            />

            <TouchableOpacity
              onPress={() => removeNew(idx)}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                backgroundColor: "rgba(0,0,0,0.6)",
                borderRadius: 20,
                padding: 4,
              }}
            >
              <Icon name="close" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}

        {/* ADD BUTTON */}
        {remainingSlots > 0 && (
          <TouchableOpacity
            onPress={pickImages}
            style={{
              width: IMAGE_SIZE,
              height: IMAGE_SIZE,
              borderRadius: 12,
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: "#28a745",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="camera-outline" size={28} color="#28a745" />
            <Text style={{ fontSize: 12, color: "#28a745" }}>
              Add
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}