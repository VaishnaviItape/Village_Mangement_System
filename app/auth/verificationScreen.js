import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { verifyOtp } from "../../api/realApi";
import { Colors, Fonts, Sizes } from "../../constants/styles";
const VerificationScreen = ({ route }) => {
  const router = useRouter();
  const { flow = "signup", email = "johndoe@gmail.com" } = useLocalSearchParams();// fallback to signup if undefined
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = () => {
    setTimer(60);
    console.log("Resend code");
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      alert("Please enter OTP");
      return;
    }

    setIsLoading(true);

    try {     

      const result = await verifyOtp(code, email);

      console.log("Email is verified " + result);

      setIsLoading(false);

      // If OTP verified successfully, navigate
      if (flow === "reset") {
        route.push("/auth/createpassword");
      } else {
        router.push("/auth/loginScreen");
      }
    } catch (error) {
      setIsLoading(false);
      alert(error.message || "Failed to verify OTP");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="arrow-left" size={24} color="#ffff" />
          </TouchableOpacity>

          <View style={styles.middleContainer}>
            <Text style={styles.title}>Verify Account</Text>
            <Text style={styles.subtitle}>
              Code has been sent to <Text style={styles.email}>{email}</Text>.
              Enter the code to verify your account.
            </Text>

            <Text style={styles.label}>Enter Code</Text>
            <TextInput
              style={styles.input}
              placeholder="6 Digit Code"
              keyboardType="numeric"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />

            <View style={styles.resendWrapper}>
              <Text style={styles.resendText}>Didn't Receive Code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                <Text style={[styles.resendLink, { opacity: timer > 0 ? 0.5 : 1 }]}>
                  Resend Code
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.timer}>
              Resend code in 00:{timer < 10 ? `0${timer}` : timer}
            </Text>

            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.button} onPress={handleVerify}>
              <Text style={styles.buttonText}>Verify Account</Text>
            </TouchableOpacity>
          </View>

          <Modal animationType="slide" transparent visible={isLoading}>
            <TouchableOpacity activeOpacity={1} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
              <View style={{ justifyContent: "center", flex: 1 }}>
                <TouchableOpacity activeOpacity={1} style={styles.dialogStyle}>
                  <ActivityIndicator
                    size={50}
                    color={Colors.primaryColor}
                    style={{ alignSelf: "center", transform: [{ scale: Platform.OS === "ios" ? 2 : 1 }] }}
                  />
                  <Text style={{ ...Fonts.blackColor16Regular, marginTop: Sizes.fixPadding, textAlign: "center" }}>
                    Please wait...
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default VerificationScreen;


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  middleContainer: { flex: 1 },
  backButton: {
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#E51C4B",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 20 },
  email: { fontWeight: "bold" },
  label: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    marginBottom: 15,
    backgroundColor: Colors.whiteColor,
  },
  resendWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    width: "100%",
  },
  resendText: { color: "#555", fontSize: 16 },
  resendLink: { color: "#94A3B8", fontSize: 16, fontWeight: "bold", textDecorationLine: "underline" },
  timer: { color: "#555", marginBottom: 15, textAlign: "center" },
  button: { backgroundColor: "#E51C4B", paddingVertical: 14, borderRadius: 22, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  dialogStyle: { width: "80%", backgroundColor: Colors.whiteColor, borderRadius: Sizes.fixPadding, padding: Sizes.fixPadding * 2, alignSelf: "center" },
});
