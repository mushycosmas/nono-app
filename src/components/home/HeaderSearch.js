import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import SearchBar from '../SearchBar';

export default function HeaderSearch({
  locations,
  selectedLocation,
  setSelectedLocation,
  onSearch,
}) {
  return (
    <View style={styles.container}>
      <SearchBar
        locations={locations}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onSearch={onSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + 10
        : 50,
    paddingBottom: 10,
    backgroundColor: '#28a745',
  },
});