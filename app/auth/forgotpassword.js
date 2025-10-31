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

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const router = useRouter();

    return (
        <KeyboardAvoidingView
            style={styles.wrapper}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Icon name="arrow-left" size={24} color="#ffff" />
                </TouchableOpacity>

                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>
                    No worries! Enter your email address below and we will send you a code to reset password.
                </Text>
                {/* First Name and Last Name */}


                {/* Email */}
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="Enter your email"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Spacer to push button to bottom */}
                <View style={{ flex: 1 }} />

                {/* Create Account Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push({
                        pathname: "/auth/verificationScreen",
                        params: { flow: "reset" }
                    })}
                // ✅ Use router.push
                >
                    <Text style={styles.buttonText}>Send Reset Instruction</Text>
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
        backgroundColor: "#E51C4B",
    },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
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
    button: {
        width: 358,
        height: 44,
        backgroundColor: "#E51C4B",
        borderRadius: 22,
        paddingVertical: 12,
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
        opacity: 1,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
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

export default ForgotPassword;
