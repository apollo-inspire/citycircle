import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform, Alert } from "react-native";

// const GEO_AREA = {
//   latitude: 51.91731349749627,     
//   longitude: 4.484378867887312,
//   radius: 20,           
// };

// const GEO_AREA = {
//   latitude: 51.841636531677224,     
//   longitude: 4.625671826667882,
//   radius: 200,           
// };

const GEO_AREA = {
  latitude: 37.422,     
  longitude: 122.084,
  radius: 2000,           
};

export default function useGeoFenceNotification() {
  // const [hasEntered, setHasEntered] = useState(false);
  let hasEntered = false;
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  console.log("useGeoFenceNotification()")


  useEffect(() => {
    const startTracking = async () => {
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: notifStatus } = await Notifications.requestPermissionsAsync();

      if (locStatus !== 'granted' || notifStatus !== 'granted') {
        console.log("Permissions not granted");
        return;
      }

      // const { status: existingStatus } = await Notifications.getPermissionsAsync();
      // console.log("Notification permission status:", existingStatus);
      // sendNotification("Testing Notification", "Lorum ipsum dolor set amit");

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // every 5 seconds
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
            console.log(hasEntered)
            sendNotification("You're here!", "You've entered the area.");
            console.log("You're here!", "You've entered the area.");
            Alert.alert("You're here!", "You've entered the area.");
            // setHasEntered(true);
            hasEntered = true;
            console.log(hasEntered)
          } else if (distance > GEO_AREA.radius && hasEntered) {
            hasEntered = false;
            // setHasEntered(false); // Reset when user leaves
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
    trigger: {
      // type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
      // channelId: 'default',
    },
  });
}
