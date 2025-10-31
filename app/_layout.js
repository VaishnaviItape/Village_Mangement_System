import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppState, LogBox, StatusBar } from 'react-native';
LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)", // or "home/homeScreen" directly
};

export default function RootLayout() {

  const [loaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    const subscription = AppState.addEventListener("change", (_) => {
      StatusBar.setBarStyle("light-content");
    });
    return () => {
      subscription.remove();
    };
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding/onboardingScreen" options={{ gestureEnabled: false }} />
      <Stack.Screen name="auth/signinScreen" options={{ gestureEnabled: false }} />
      <Stack.Screen name="auth/registerScreen" />
      <Stack.Screen name="auth/verificationScreen" />
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="UnitForm/unitForm" />
      <Stack.Screen name="filter/filterScreen" />
      <Stack.Screen name="search/searchScreen" />
      <Stack.Screen name="tenantForm/tenantForm" />
      <Stack.Screen name="propertyDetails/propertyDetails" />
      <Stack.Screen name="direction/directionScreen" />
      <Stack.Screen name="paymnetForm/paymnetForm" />
      <Stack.Screen name="confirmDetail/confirmDetailScreen" />
      <Stack.Screen name="payment/paymentScreen" />
      <Stack.Screen name="PropertyForm/PropertyForm" options={{ gestureEnabled: false }} />
      <Stack.Screen name="tenentDetailsScreen/tenentDetails" />
      <Stack.Screen name="editProfile/editProfileScreen" />
      <Stack.Screen name="notifications/notificationsScreen" />
      <Stack.Screen name="termsAndConditions/termsAndConditionsScreen" />
      <Stack.Screen name="faq/faqScreen" />
      <Stack.Screen name="privacyPolicy/privacyPolicyScreen" />
      <Stack.Screen name="help/helpScreen" />
    </Stack>
  );
}
