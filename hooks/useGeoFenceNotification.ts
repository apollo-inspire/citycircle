import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform, Alert } from "react-native";

const GEO_AREA = {
  latitude: 37.4219983,     // Example: San Francisco
  longitude: -122.084,
  radius: 2000,           // in meters
};

export default function useGeoFenceNotification() {
  const [hasEntered, setHasEntered] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    const startTracking = async () => {
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: notifStatus } = await Notifications.requestPermissionsAsync();

      if (locStatus !== 'granted' || notifStatus !== 'granted') {
        console.log("Permissions not granted");
        return;
      }

      // sendNotification("Testing Notification", "Lorum ipsum dolor set amit");

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // every 5 seconds
          distanceInterval: 10, // or every 10 meters
        },
        (location) => {
          // console.log("TEST", location.coords);

          const { latitude, longitude } = location.coords;

          const distance = getDistanceFromLatLonInMeters(
            latitude,
            longitude,
            GEO_AREA.latitude,
            GEO_AREA.longitude
          );

          if (distance <= GEO_AREA.radius && !hasEntered) {
            // sendNotification("You're here!", "You've entered the area.");
            console.log("You're here!", "You've entered the area.");
            Alert.alert("You're here!", "You've entered the area.");
            setHasEntered(true);
          } else if (distance > GEO_AREA.radius && hasEntered) {
            setHasEntered(false); // Reset when user leaves
          }
        }
      );
    };

    startTracking();

    return () => {
      locationSubscription.current?.remove();
    };
  }, []);
}

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function sendNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null, // Send immediately
  });
}
