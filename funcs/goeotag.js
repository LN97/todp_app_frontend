import * as Location from 'expo-location';

export async function getCurrentLocation() {
  try {
    // Request permission to access location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // Permission was denied
      console.error('Location permission not granted');
      return;
    }

    // Get the current location
    const location = await Location.getCurrentPositionAsync({});

    return location.coords; // Contains { coords: { latitude, longitude, altitude, ... }, timestamp }
  } catch (error) {
    console.error(error);
  }
}
