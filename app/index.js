import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import Colors from "../constants/Colors";

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userStr = await AsyncStorage.getItem("user");
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          if (user.role === 'admin') {
            navigation.replace("(admin)");
          } else {
            navigation.replace("(villager)");
          }
        } else {
          navigation.replace("auth/login");
        }
      } catch (error) {
        console.log("Auth Check Error:", error);
        navigation.replace("auth/login");
      }
    };

    const timer = setTimeout(() => {
      checkAuth();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Village Management</Text>
      <ActivityIndicator size="large" color={Colors.white} style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.white,
    letterSpacing: 1,
  },
});
