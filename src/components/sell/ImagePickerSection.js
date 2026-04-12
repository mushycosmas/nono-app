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

export default function ImagePickerSection({
  newImages = [],
  setNewImages,
  removeNewImage,
  styles,
}) {
  const MAX_IMAGES = 10;
  const remainingSlots = MAX_IMAGES - newImages.length;

  // ✅ PICK IMAGES (INSIDE COMPONENT = SAFER)
  const pickImages = async () => {
    if (newImages.length >= MAX_IMAGES) {
      return Alert.alert("Limit reached", "Maximum 10 images allowed");
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return Alert.alert("Permission required", "Allow gallery access");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: remainingSlots, // ✅ prevent overflow
    });

    if (!result.canceled) {
      setNewImages((prev) => [...prev, ...result.assets]);
    }
  };

  // ✅ SAFE REMOVE
  const handleRemove = (index) => {
    if (removeNewImage) {
      removeNewImage(index);
    } else {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <View style={[styles.card, { padding: 16 }]}>
      {/* HEADER */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={[styles.label, { fontSize: 16 }]}>Photos</Text>
        <Text style={{ fontSize: 12, color: "#666" }}>
          {newImages.length}/{MAX_IMAGES}
        </Text>
      </View>

      <Text style={{ fontSize: 12, color: "#888", marginTop: 5 }}>
        Add clear photos (max 10)
      </Text>

      {/* IMAGES */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 12 }}
      >
        {newImages.map((img, idx) => (
          <View
            key={idx}
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

            {/* REMOVE */}
            <TouchableOpacity
              onPress={() => handleRemove(idx)}
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