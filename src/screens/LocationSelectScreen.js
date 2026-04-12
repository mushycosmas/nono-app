import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
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

  // ✅ FREE TEXT LOCATION
  const [manualLocation, setManualLocation] = useState("");

  const { setLocation } = useSell();

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

  // ================= FINAL SELECT =================
  const handleSelectDistrict = (district) => {
    setLocation({
      country: selectedCountry,
      region: selectedRegion,
      district,
      manualLocation: manualLocation.trim(), // ✅ free text included
    });

    navigation.goBack();
  };

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

  const data = !selectedCountry
    ? countries
    : !selectedRegion
    ? selectedCountry.regions
    : selectedRegion.districts;

  return (
    <SafeAreaView style={styles.container}>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator />
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

  card: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
});