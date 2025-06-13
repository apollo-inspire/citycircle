import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

const interests = [
  'Rock Music', 'Live Music', 'Bar', 'Concerts', 'Indie Music',
  'Music', 'Alternative', 'Night Life', 'Intimate Gigs', 'Urban Vibe',
];

export default function Onboard2() {
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.title}>You're in control</Text>
        <Text style={styles.subtitle}>
          No unpredictable algorithms, no recommendations. Curate your own default filter by selecting your personal interests.
        </Text>

        <Text style={styles.sectionTitle}>Please select your personal interests:</Text>
        <View style={styles.tagsContainer}>
          {interests.map((interest, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{interest}</Text>
            </View>
          ))}
          <View style={styles.tag}><Text style={styles.tagText}>+</Text></View>
        </View>

        <Text style={styles.note}>
          You can always update interests from settings or temporarly deselect filters on the map. This data is stored only locally on your device.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveButton} onPress={() => router.replace('/(tabs)/map')}>
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
