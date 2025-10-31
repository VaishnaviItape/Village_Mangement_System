import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Location from "expo-location";
import * as Network from "expo-network";
import * as TaskManager from "expo-task-manager";
import {
  uploadTravelLogs,
} from "../api/realApi";

const LOCATION_TASK = "salesbooster-location-tracking";

// default settings
let activeInterval = 120000; // 2 minutes
let idleInterval = 600000;   // 10 minutes
let distanceThreshold = 150; // meters

let lastCoords = null;
let isIdleMode = false;

// Define background task
TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Location Task Error:", error);
    return;
  }

  const { locations } = data;
  if (!locations?.length) return;

  const loc = locations[0].coords;
  const now = new Date().toISOString();

  // Calculate movement
  if (lastCoords) {
    const distanceMoved = getDistance(lastCoords.latitude, lastCoords.longitude, loc.latitude, loc.longitude);
    // Switch mode based on movement
    if (distanceMoved < 50 && !isIdleMode) {
      console.log("Switching to IDLE mode");
      await switchToIdleMode();
    } else if (distanceMoved >= 50 && isIdleMode) {
      console.log("Switching to ACTIVE mode");
      await switchToActiveMode();
    }
  }

  lastCoords = loc;

  // Store locally (offline cache)
  const entry = {
    latitude: loc.latitude,
    longitude: loc.longitude,
    accuracy: loc.accuracy,
    speed: loc.speed,
    recordedAt: now,
  };

  const cached = JSON.parse(await AsyncStorage.getItem("travelLogs") || "[]");
  cached.push(entry);
  await AsyncStorage.setItem("travelLogs", JSON.stringify(cached));

  // Try to sync periodically if online
  const net = await Network.getNetworkStateAsync();
  if (net.isConnected) await uploadPendingLogs();
});

// Haversine distance calculator (km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // meters
}

export const startBackgroundTracking = async () => {
  if (!Device.isDevice) {
    console.log("Location tracking only works on physical devices.");
    return;
  }

  const { status: fg } = await Location.requestForegroundPermissionsAsync();
  const { status: bg } = await Location.requestBackgroundPermissionsAsync();
  if (fg !== "granted" || bg !== "granted") {
    console.log("Location permission not granted.");
    return;
  }

  // Start active mode
  await switchToActiveMode();

  console.log("Background tracking started (ACTIVE mode).");
};

export const stopBackgroundTracking = async () => {
  const hasTask = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
  if (hasTask) await Location.stopLocationUpdatesAsync(LOCATION_TASK);
  console.log("Background tracking stopped.");
};

async function switchToActiveMode() {
  isIdleMode = false;
  await Location.stopLocationUpdatesAsync(LOCATION_TASK).catch(() => {});
  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    distanceInterval: distanceThreshold,
    timeInterval: activeInterval,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "SalesBooster Tracking",
      notificationBody: "Tracking field movement in active mode.",
    },
  });
}

async function switchToIdleMode() {
  isIdleMode = true;
  await Location.stopLocationUpdatesAsync(LOCATION_TASK).catch(() => {});
  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: distanceThreshold * 2,
    timeInterval: idleInterval,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "SalesBooster Tracking",
      notificationBody: "Idle mode: low-frequency updates.",
    },
  });
}

async function uploadPendingLogs() {
  const cached = JSON.parse(await AsyncStorage.getItem("travelLogs") || "[]");
  if (!cached.length) return;

  const token = await AsyncStorage.getItem("accessToken");
  const attendanceId = await AsyncStorage.getItem("currentAttendanceId");

  if (!attendanceId) {
    console.warn("No currentAttendanceId found, skipping upload.");
    return;
  }

  try {
    await uploadTravelLogs(token, attendanceId, cached);
    await AsyncStorage.removeItem("travelLogs");
  } catch (e) {
    console.error("Upload error:", e.message);
  }
}

export async function isTrackingActive() {
  return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
}

export async function getLocationPermissionStatus() {
  const fg = await Location.getForegroundPermissionsAsync();
  const bg = await Location.getBackgroundPermissionsAsync();
  return {
    foreground: fg.status,
    background: bg.status,
    granted: fg.status === "granted" && bg.status === "granted",
  };
}

export async function requestLocationPermissions() {
  const fg = await Location.requestForegroundPermissionsAsync();
  const bg = await Location.requestBackgroundPermissionsAsync();
  const granted = fg.status === "granted" && bg.status === "granted";
  return { granted, fg: fg.status, bg: bg.status };
}
