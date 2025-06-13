import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLACES_DEMO } from '@/constants/Places';

export default function Onboard2() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [interestOptions, setInterestOptions] = useState([]);
  const [openInterests, setOpenInterests] = useState(false);

  useEffect(() => {
    const loadInterests = async () => {
      try {
        const saved = await AsyncStorage.getItem('userInterests');
        if (saved) setSelectedInterests(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load interests:', e);
      }
    };
    loadInterests();
  }, []);

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

  const saveInterests = async () => {
    try {
      await AsyncStorage.setItem('userInterests', JSON.stringify(selectedInterests));
    } catch (e) {
      console.error('Failed to save interests:', e);
    }
  };

  const handleContinue = async () => {
    await saveInterests();
    router.replace('/(tabs)/map');
  };

  const WhiteCheckIcon = () => (
    <Text style={{ color: Colors.dark.text, fontSize: 16, fontWeight: 'bold' }}>✓</Text>
  );

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.title}>You're in control</Text>
        <Text style={styles.subtitle}>
          No unpredictable algorithms, no recommendations. Curate your own default filter by selecting your personal interests.
        </Text>

        <Text style={styles.sectionTitle}>Please select your personal interests:</Text>

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

        <View style={styles.tagsContainer}>
          {selectedInterests.length > 0 ? (
            selectedInterests.map((interest, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{interest}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.tagText}>No interests selected yet</Text>
          )}
        </View>

        <Text style={styles.note}>
          You can always update interests from settings or temporarily deselect filters on the map. This data is stored only locally on your device.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveButton} onPress={handleContinue}>
            <Text style={styles.buttonText}>save & continue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={() => router.replace('/(tabs)/map')}>
            <Text style={styles.skipText}>skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: Colors.dark.backgroundCard,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 500,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 38,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 8,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: Colors.dark.background900,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tagText: {
    fontFamily: 'Poppins-Regular',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  saveButton: {
    backgroundColor: Colors.basic.primary[400],
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    flex: 1,
  },
  skipButton: {
    backgroundColor: Colors.dark.buttonGray,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.dark.background,
    textAlign: 'center',
  },
  skipText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.dark.text,
    textAlign: 'center',
  },
});
