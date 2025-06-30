import { SLIDES } from '@/constants/onboarding/slidesContent';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import logoImage from '@/assets/images/CityCircle-logo.png';
import { Colors } from '@/constants/Colors';

const screenWidth = Dimensions.get('window').width - 60;

type OnboardingCardProps = {
  onComplete: () => void;
  colorScheme: 'light' | 'dark';
};

export function OnboardingCard({ onComplete, colorScheme }: OnboardingCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const theme = Colors[colorScheme] ?? Colors.dark;

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);

    if (index >= SLIDES.length) {
      // Prevent scrolling beyond the last slide
      scrollRef.current?.scrollTo({ x: screenWidth * (SLIDES.length - 1), animated: true });
      setCurrentSlide(SLIDES.length - 1);
    } else {
      setCurrentSlide(index);
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.backgroundCard,
      borderRadius: 20,
      padding: 20,
      width: '100%',
      maxWidth: 500,
    },
    description: {
      fontFamily: 'Poppins-Regular',
      color: theme.text,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 32,
    },
    carousel: {
      width: '100%',
    },
    slide: {
      width: screenWidth,
      paddingHorizontal: 8,
      alignItems: 'center',
    },
    mapImage: {
      width: '100%',
      height: 150,
      borderRadius: 8,
      marginBottom: 20,
    },
    sectionTitle: {
      fontFamily: 'Poppins-Bold',
      color: theme.text,
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 8,
    },
    sectionDescription: {
      fontFamily: 'Poppins-Regular',
      color: theme.text,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 24,
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 6,
      marginBottom: 32,
    },
    dot: {
      width: 8,
      height: 8,
      backgroundColor: Colors.basic.gray[500],
      borderRadius: 4,
    },
    dotActive: {
      width: 8,
      height: 8,
      backgroundColor: theme.accent,
      borderRadius: 4,
    },
    button: {
      backgroundColor: theme.accent,
      paddingVertical: 14,
      paddingHorizontal: 30,
      borderRadius: 14,
      alignSelf: 'center',
    },
    buttonText: {
      fontFamily: 'Poppins-Bold',
      fontSize: 16,
      color: theme.background,
      textAlign: 'center',
    },
    logoImage: {
      maxWidth: 350,
      height: 60,
      alignSelf: 'center',
      marginBottom: 16,
    },
  });

  return (
    <View style={styles.card}>
      <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
      <Text style={styles.description}>
        Your local guide to real-world places and people. No fake hype, no endless scroll, just vibes that match yours. 🌍✨ Whether you're new in town or just looking to explore more, we help you find your spot.
      </Text>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        onMomentumScrollEnd={handleScroll}
        bounces={false}
        style={styles.carousel}
        contentContainerStyle={{ width: screenWidth * SLIDES.length }}
        snapToInterval={screenWidth}
        decelerationRate="fast"
      >
        {SLIDES.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Image source={slide.image} style={styles.mapImage} resizeMode="cover" />
            <Text style={styles.sectionTitle}>{slide.title}</Text>
            <Text style={styles.sectionDescription}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={index === currentSlide ? styles.dotActive : styles.dot}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onComplete}
      >
        <Text style={styles.buttonText}>lets go!</Text>
      </TouchableOpacity>
    </View>
  );
}