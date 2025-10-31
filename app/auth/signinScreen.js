import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const IMAGE = require("../../assets/images/property1.png");

const SigninScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Image with gradient overlay */}
      <View style={styles.imageContainer}>
        <Image source={IMAGE} style={styles.singleImage} />
        <LinearGradient
          colors={["rgba(251,251,251,0)", "#FCFCFC"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradientOverlay}
        />
      </View>

      {/* Plain content below the image */}
      <View style={styles.content}>
        <Text style={styles.title}>Rentro</Text>
        <Text style={styles.subtitle}>
          Manage properties, tenants & payments in one place
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/auth/loginScreen")}
        >
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => router.push("/auth/registerScreen")}
        >
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  imageContainer: {
    width: screenWidth - 40,
    height: 500,
    marginTop: 60,
    borderRadius: 16,
    overflow: "hidden", // important to keep gradient inside rounded corners
  },
  singleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 300, // adjust as needed for the fade effect
  },
  content: {
    marginTop: 10,
    width: screenWidth - 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#232323",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#747474",
    textAlign: "center",
    marginBottom: 28,
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
  signupButton: {
    backgroundColor: "#fff",
    borderRadius: 32,
    paddingVertical: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: "#F52A5B",
    alignItems: "center",
    shadowColor: "#f57bb8ff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  signupText: {
    color: "#F52A5B",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SigninScreen;
