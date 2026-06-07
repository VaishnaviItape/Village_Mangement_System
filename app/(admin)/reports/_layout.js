import { Stack } from 'expo-router';

export default function ReportsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="taxes" options={{ title: 'Tax Reports' }} />
      <Stack.Screen name="complaints" options={{ title: 'Complaint Reports' }} />
      <Stack.Screen name="users" options={{ title: 'User Reports' }} />
    </Stack>
  );
}
