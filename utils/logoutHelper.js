import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const handleLogout = async () => {
  try {
    // Remove authentication tokens
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("currentAttendanceId");
    await AsyncStorage.removeItem("travelLogs");

    // Remove any attendance data (check-in / check-out)
    const keys = await AsyncStorage.getAllKeys();
    const attendanceKeys = keys.filter((k) => k.startsWith("attendance:"));
    if (attendanceKeys.length > 0) {
      await AsyncStorage.multiRemove(attendanceKeys);
    }

    // Optional: remove cached user data
    await AsyncStorage.removeItem("currentUser");

    // Optionally call backend logout API (future-ready)
    // await fetch(`${API_BASE_URL}/api/Auth/logout`, {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    // Redirect to login
    router.replace("/auth/loginScreen");
  } catch (err) {
    console.error("Logout cleanup failed:", err);
  }
};
