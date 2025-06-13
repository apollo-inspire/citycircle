import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import mapImage from '@/assets/images/citycircle_maps_screen.png'; // replace path if needed
import logoImage from '@/assets/images/CityCircle-logo.png';


const SLIDES = [
  {
    title: 'Discover Local Places (Map)',
    description: "See what’s around you on the map: cafés, parks, study spots, bars, art spaces, whatever fits your vibe. Tap a place to see more details, then start navigating whenever you're ready.",
    image: mapImage,
  },
  {
    title: 'Match your interests (Filter)',
    description: "Switch up the filter to match your current mood. You can filter by type, tags, location, and even see what’s open right now.",
    image: mapImage,
  },
  {
    title: 'Low-Pressure Social Discovery',
    description: "No pressure, no FOMO. Just places that feel right for you. Bored? Check what’s nearby and explore on your terms. Go out if it feels good. Stay in if it doesn’t. All chill either way.",
    image: mapImage,
  },
  {
    title: 'Safe, Humane & European Design',
    description: "No feeds, no tracking, no unpredictable algorithms. We aim to be a privacy-first, open-source, and accessible app. Built to European standards, with your well-being in mind. Your data stays yours.",
    image: mapImage,
  },
];

const screenWidth = Dimensions.get('window').width - 60;

export default function Index() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (hasOnboarded) {
      router.replace('/(main)/onboarding2');
    }
  }, [hasOnboarded]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);

    if (index >= SLIDES.length) {
      // Force it back to the last slide
      scrollRef.current?.scrollTo({ x: screenWidth * (SLIDES.length - 1), animated: true });
      setCurrentSlide(SLIDES.length - 1);
    } else {
      setCurrentSlide(index);
    }
  };



  if (hasOnboarded) return null;

  return (
    <View style={styles.root}>
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
          onPress={() => setHasOnboarded(true)}
        >
          <Text style={styles.buttonText}>lets go!</Text>
        </TouchableOpacity>
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
  description: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  carousel: {
    width: '100%',
  },
  slide: {
    // maxWidth: '100%',
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
    color: Colors.dark.text,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark.text,
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
    backgroundColor: Colors.basic.primary[400],
    borderRadius: 4,
  },
  button: {
    backgroundColor: Colors.basic.primary[400],
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.dark.background,
    textAlign: 'center',
  },
  logoImage: {
    maxWidth: 350,
    height: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
});

