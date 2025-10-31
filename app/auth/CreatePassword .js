import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CreatePassword  = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Create New password</Text>
        <Text style={styles.subtitle}>
          Please enter and confirm your new password.
          You will need to login after you reset.
        </Text>
        {/* Password */}
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Enter password"
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={securePassword}
            />
            <TouchableOpacity onPress={() => setSecurePassword(!securePassword)}>
              <Icon
                name={securePassword ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.noteText}>Must contain at least 8 characters.</Text>
        </View>

        {/* Confirm Password */}
        <View style={{ marginBottom: 25 }}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirm password"
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConfirm}
            />
            <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
              <Icon
                name={secureConfirm ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer to push button to bottom */}
        <View style={{ flex: 1 }} />

        {/* Create Account Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/loginScreen")} // ✅ Use router.push
        >
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    paddingTop: 50,
    flexGrow: 1,
  },
  backButton: {
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  subtitle: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 20 },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    flexDirection: "row",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  button: { backgroundColor: "#E51C4B", paddingVertical: 14, borderRadius: 22, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  bottomText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginBottom: 20,
  },
  linkText: {
    color: "#1E90FF",
  },
});

export default CreatePassword ;
