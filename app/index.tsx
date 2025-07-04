import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OnboardingCard } from '@/components/OnboardingCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Index() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.dark;

  useEffect(() => {
    if (hasOnboarded) {
      router.replace('/(main)/onboarding2');
    }
  }, [hasOnboarded]);

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
  });

  if (hasOnboarded) {
    return null;
  }

  return (
    <View style={styles.root}>
      <OnboardingCard 
        onComplete={() => setHasOnboarded(true)} 
        colorScheme={colorScheme} 
      />
    </View>
  );
}