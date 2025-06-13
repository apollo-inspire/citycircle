import { useFonts } from 'expo-font';
import { Slot } from "expo-router";

export default function MainLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../assets/fonts/poppins/Poppins-Medium.ttf'),
    'Poppins-Bold': require('../../assets/fonts/poppins/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) return null;

  return <Slot />;
}
