import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Link, Stack } from 'expo-router';
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

  const Provider = Platform.OS === 'web' ? React.Fragment : SafeAreaProvider;
  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const WhiteCheckIcon = () => (
    <Text style={{ color: Colors.dark.text, fontSize: 16, fontWeight: 'bold' }}>✓</Text>
  );

  return (
    <Provider>
      <Stack.Screen options={{ title: 'Settings', headerShown: true }} />
      <Container style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Please select your personal interests:</Text>

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

          <Text style={styles.note}>
            You can always update interests from settings or temporarily deselect filters on the map. This data is stored only locally on your device.
          </Text>
        </ScrollView>
      </Container>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  dropdownWrapper: {
    zIndex: 3000,
    marginBottom: 12,
  },
  dropdownDark: {
    marginVertical: 10,
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
  note: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.dark.textLowcontrast,
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 32,
  },
});
