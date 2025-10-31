import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { useNavigation, useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { loginUser } from '../../api/realApi'; // 
import { Colors, Fonts, Sizes } from "../../constants/styles";
WebBrowser.maybeCompleteAuthSession();


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigation = useNavigation();
    const router = useRouter();
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '<YOUR_EXPO_CLIENT_ID>',
        iosClientId: '<YOUR_IOS_CLIENT_ID>',
        androidClientId: '<YOUR_ANDROID_CLIENT_ID>',
        webClientId: '<YOUR_WEB_CLIENT_ID>',
    });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return "E-mail cannot be empty.";
        } else if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (!password) {
            return "Password cannot be empty.";
        } else if (password.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        return "";
    };

    const handleLogin = async () => {
        const emailValidation = validateEmail(email);
        const passwordValidation = validatePassword(password);

        setEmailError(emailValidation);
        setPasswordError(passwordValidation);

        if (emailValidation || passwordValidation) return;

        setIsLoading(true);

        try {
            // Call login API
            const data = await loginUser(email, password);

            // Assuming data contains the token
            const accessToken = data.accessToken;
            const refreshToken = data.refreshToken;
            if (!accessToken) throw new Error("Token not received from API");

            // Store token in AsyncStorage
            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);

            setIsLoading(false);

            // Navigate to your main app screen
            navigation.push("(tabs)");

        } catch (error) {
            setIsLoading(false);
            alert(error.message || "Login failed");
        }
    };

    const handleGoogleLogin = () => {
        promptAsync();
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.title}>Login</Text>

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={[styles.input, emailError ? styles.inputError : {}]}
                        placeholder="john.doe@mail.com"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setEmailError(""); // Clear error when user types
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.input, passwordError ? styles.inputError : {}]}
                            placeholder="*************"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setPasswordError(""); // Clear error when user types
                            }}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                            <AntDesign name={showPassword ? "eye" : "eye-invisible"} size={20} color="gray" />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    <TouchableOpacity style={styles.forgotButton} onPress={() => router.push("/auth/forgotpassword")}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                </View>

                {/* <View style={styles.bottomSection}>
                    <Text style={styles.orText}>or login with</Text>

                    <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
                        <AntDesign name="google" size={20} color="#DB4437" />
                        <Text style={styles.googleText}>Login with Google</Text>
                    </TouchableOpacity>
                </View> */}
                {/* Loading Dialog */}
                <Modal animationType="slide" transparent visible={isLoading}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <TouchableOpacity activeOpacity={1} style={styles.dialogStyle}>
                                <ActivityIndicator
                                    size={50}
                                    color={Colors.primaryColor}
                                    style={{
                                        alignSelf: "center",
                                        transform: [{ scale: Platform.OS === "ios" ? 2 : 1 }],
                                    }}
                                />
                                <Text style={{ ...Fonts.blackColor16Regular, marginTop: Sizes.fixPadding, textAlign: "center" }}>
                                    Please wait...
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 50,
    },
    scrollContainer: {
        padding: 20,
        flexGrow: 1,
        justifyContent: "space-between",
    },
    content: {
        // This wraps the title and input fields to control spacing better
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 20,
        letterSpacing: -0.5,
        lineHeight: 34,
        paddingTop: 50,
        // fontFamily: "Gabarito", // Uncomment if available
    },
    label: {
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 8,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        paddingRight: 40,
        marginBottom: 0,
        color: "#000", // Adjusted to make space for error message
    },
    inputError: {
        borderColor: "#F52A5B", // Red border for error
    },
    inputWrapper: {
        position: "relative",
        width: "100%",
        marginBottom: 0, // Adjusted to make space for error message
    },
    eyeButton: {
        position: "absolute",
        right: 12,
        top: 12,
    },
    errorText: {
        color: "#F52A5B",
        fontSize: 12,
        marginBottom: 20, // Space after error message
        marginTop: 4, // Space above error message
        marginLeft: 5,
    },
    forgotButton: {
        alignSelf: "flex-end",
        marginBottom: 20,
    },
    forgotText: {
        color: "#1E90FF",
    },
    loginButton: {
        backgroundColor: "#F52A5B",
        borderRadius: 32,
        paddingVertical: 14,
        paddingHorizontal: 80,
        marginBottom: 12,
        width: "100%",
        alignItems: "center",
        shadowColor: "#f57bb8ff",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    loginText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    bottomSection: {
        alignItems: "center",
        paddingBottom: 30,
    },
    orText: {
        color: "#888",
        marginBottom: 12,
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        width: 358,
        height: 54,
        paddingHorizontal: 24,
        paddingVertical: 8,
        gap: 16,
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: "#ddd",
        justifyContent: "center",
    },
    googleText: {
        marginLeft: 10,
        color: "#333",
        fontWeight: "bold",
    },
    dialogStyle: { width: "80%", backgroundColor: Colors.whiteColor, borderRadius: Sizes.fixPadding, padding: Sizes.fixPadding * 2, alignSelf: "center" },
});