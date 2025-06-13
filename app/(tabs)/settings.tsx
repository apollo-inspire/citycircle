import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Colors } from '@/constants/Colors';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { PLACES_DEMO } from '@/constants/Places';

export default function SettingsScreen() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [interestOptions, setInterestOptions] = useState([]);
  const [openInterests, setOpenInterests] = useState(false);

  useEffect(() => {
    const types = PLACES_DEMO.map(place => place.type.toLowerCase());
    const allTags = PLACES_DEMO.flatMap(place => place.tags.map(tag => tag.toLowerCase()));
    const combined = Array.from(new Set([...types, ...allTags]));

    const formatted = combined.map(entry => ({
      label: entry.charAt(0).toUpperCase() + entry.slice(1),
      value: entry,
    }));

    setInterestOptions(formatted);
  }, []);

  const Provider = Platform.OS === 'web' ? null : SafeAreaProvider;
  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const WhiteCheckIcon = () => (
    <Text style={{ color: Colors.dark.text, fontSize: 16, fontWeight: 'bold' }}>✓</Text>
  );

  return (
    <Provider>
      <Container style={styles.container}>
        <Text style={styles.heading}>Settings</Text>

        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={openInterests}
            multiple={true}
            value={selectedInterests}
            items={interestOptions}
            setOpen={setOpenInterests}
            setValue={setSelectedInterests}
            setItems={setInterestOptions}
            placeholder="Select your interests..."
            style={styles.dropdownDark}
            dropDownContainerStyle={styles.dropdownContainerDark}
            textStyle={styles.dropdownText}
            placeholderStyle={styles.dropdownPlaceholder}
            searchTextInputStyle={styles.searchInputDark}
            searchable={true}
            searchPlaceholder="Search interests..."
            TickIconComponent={WhiteCheckIcon}
            listMode="SCROLLVIEW"
            scrollViewProps={{ nestedScrollEnabled: true }}
            zIndex={2000}
            zIndexInverse={1000}
          />

          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSelectedInterests([]);
              setOpenInterests(false);
            }}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </Container>
    </Provider>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
    minHeight: 600, // ensures space for dropdown to expand
    },
  heading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.dark.text,
    marginBottom: 20,
    textAlign: 'center',
  },
    dropdownWrapper: {
    flex: 1,
    zIndex: 3000,
    marginBottom: 20,
    },
  dropdownDark: {
    margin: 10,
    backgroundColor: Colors.dark.backgroundCard,
  },
  dropdownContainerDark: {
    backgroundColor: Colors.dark.backgroundCard,
    maxHeight: 600,
  },
  dropdownText: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
  },
  dropdownPlaceholder: {
    color: Colors.dark.textLowcontrast,
  },
  searchInputDark: {
    fontFamily: 'Poppins-Regular',
    padding: 12,
    borderRadius: 6,
    marginVertical: 1,
    marginHorizontal: 3,
    color: Colors.dark.text,
    backgroundColor: Colors.dark.background900,
  },
  clearButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: Colors.dark.buttonGray,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginHorizontal: 10,
  },
  clearButtonText: {
    fontFamily: 'Poppins-Bold',
    color: Colors.dark.text,
  },
});
