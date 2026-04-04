import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SearchBar({ locations, selectedLocation, setSelectedLocation, onSearch }) {
  const [query, setQuery] = React.useState('');

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedLocation}
        onValueChange={setSelectedLocation}
        style={styles.picker}
        dropdownIconColor="#fff"
      >
        {locations.map(loc => (
          <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
        ))}
      </Picker>

      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="I am looking for..."
          style={styles.input}
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.iconButton} onPress={() => onSearch(query)}>
          <Icon name="search" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 30 : 70, // ✅ more space from top
    backgroundColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  picker: {
    flex: 0.3,
    color: '#fff',
  },
  searchWrapper: {
    flex: 0.7,
    position: 'relative',
    justifyContent: 'center',
    marginTop: 10, // optional, adds space inside the row if needed
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 40, // leave space for icon
    height: 40,
  },
  iconButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});