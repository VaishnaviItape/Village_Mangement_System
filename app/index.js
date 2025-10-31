import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAppStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");

        if (!hasOnboarded) {
          // First time opening app → show onboarding
          navigation.replace("onboarding/onboardingScreen");
          await AsyncStorage.setItem("hasOnboarded", "true"); // Mark onboarding as completed
        } else if (token) {
          // User logged in → go to Tabs
          navigation.replace("(tabs)");
        } else {
          // User not logged in → go to SignIn
          navigation.replace("auth/signinScreen");
        }
      } catch (error) {
        console.log("Error reading AsyncStorage:", error);
        // fallback
        navigation.replace("auth/signinScreen");
      }
    };

    const timer = setTimeout(() => {
      checkAppStatus();
    }, 2000); // Splash delay 2s

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image
        source={require("../assets/images/app_splash.png")}
        resizeMode="contain"
        style={styles.mapImage}
      />
      <Image
        source={require("../assets/images/rentro_logo.png")}
        resizeMode="contain"
        style={styles.logo}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E51C4B", // fallback if image fails
  },
  mapImage: {
    width: 598.2,
    height: 380.9,
    top: 269.48,
    left: -85,
    opacity: 1,
    position: 'absolute',
  },
  logo: {
    width: 292,
    height: 98,
    opacity: 1,
    position: 'absolute',
    top: 370,
    left: 50.5,
  },
});
