import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchLocations } from "../api/api";
import { useSell } from "../contexts/SellContext";

export default function LocationSelectScreen({ navigation }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  // ✅ GET LOCATION FROM CONTEXT
  const { location, setLocation } = useSell();

  // ================= LOAD LOCATIONS =================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLocations();
        setCountries(data || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ================= ✅ AUTO PRESELECT =================
  useEffect(() => {
    if (!countries.length || !location) return;

    // 🔹 Find country
    const foundCountry = countries.find(
      (c) => c.id === location?.country?.id
    );

    if (foundCountry) {
      setSelectedCountry(foundCountry);

      // 🔹 Find region
      const foundRegion = foundCountry.regions?.find(
        (r) => r.id === location?.region?.id
      );

      if (foundRegion) {
        setSelectedRegion(foundRegion);
      }
    }
  }, [countries, location]);

  // ================= FINAL SELECT =================
  const handleSelectDistrict = (district) => {
    setLocation({
      country: selectedCountry,
      region: selectedRegion,
      district_id: district.id,
      district_name: district.name,
    });

    navigation.goBack();
  };

  // ================= CLICK HANDLER =================
  const handlePress = (item) => {
    if (!selectedCountry) {
      setSelectedCountry(item);
      return;
    }

    if (!selectedRegion) {
      setSelectedRegion(item);
      return;
    }

    handleSelectDistrict(item);
  };

  // ================= DATA =================
  const data = !selectedCountry
    ? countries
    : !selectedRegion
    ? selectedCountry?.regions || []
    : selectedRegion?.districts || [];

  // ================= UI =================
  return (
    <SafeAreaView style={styles.container}>
      {/* LOADING */}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePress(item)}
              style={styles.item}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* BACK NAVIGATION */}
      {selectedRegion && (
        <TouchableOpacity onPress={() => setSelectedRegion(null)}>
          <Text style={styles.back}>← Back to Regions</Text>
        </TouchableOpacity>
      )}

      {selectedCountry && !selectedRegion && (
        <TouchableOpacity onPress={() => setSelectedCountry(null)}>
          <Text style={styles.back}>← Back to Countries</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },

  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  back: {
    marginTop: 10,
    color: "#007bff",
    fontWeight: "600",
  },
});