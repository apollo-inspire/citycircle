import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];

  const [loaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/poppins/Poppins-Medium.ttf'),
    'Poppins-Bold': require('../assets/fonts/poppins/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider
      value={{
        ...DarkTheme,
        dark: true,
        colors: {
          ...DarkTheme.colors,
          background: theme.background,
          card: theme.background900,
          text: theme.text,
          primary: theme.tint,
          border: theme.background900,
          notification: theme.tabIconSelected,
        },
      }}
    >
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background900,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontFamily: 'Poppins-Regular',
            fontSize: 20,
            color: theme.text,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Welcome', headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="explore" options={{ title: 'Explore', headerShown: true }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
