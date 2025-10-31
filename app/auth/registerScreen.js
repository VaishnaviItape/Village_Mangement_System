import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
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
import { clientSignup, getSubscriptionPlans } from "../../api/realApi"; // adjust path
import {
  Sizes
} from "../../constants/styles";
// inside your component state
const ClientRegisterScreen = () => {
  const [clientCompanyName, setClientCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [password, setPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [subscriptionPlanId, setSubscriptionPlanId] = useState("");

  const router = useRouter();

  // State variables for error messages
  const [clientCompanyNameError, setClientCompanyNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [cityError, setCityError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [contactPersonError, setContactPersonError] = useState("");
  const [contactEmailError, setContactEmailError] = useState("");
  const [contactPhoneError, setContactPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [subscriptionPlanIdError, setSubscriptionPlanIdError] = useState("");
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await getSubscriptionPlans();
        console.log("Subscription plans fetched " + JSON.stringify(plans, null, 2));
        setSubscriptionPlans(plans);
      } catch (error) {
        console.log("Error fetching subscription plans:", error.message);
      }
    };

    fetchPlans();
  }, []);
  const validateForm = () => {
    let isValid = true;

    // Clear previous errors
    setClientCompanyNameError("");
    setAddressError("");
    setCityError("");
    setPincodeError("");
    setContactPersonError("");
    setContactEmailError("");
    setContactPhoneError("");
    setPasswordError("");
    setSubscriptionPlanIdError("");

    // Company Name
    if (!clientCompanyName.trim()) {
      setClientCompanyNameError("Please enter Client Company Name");
      isValid = false;
    }

    // Contact Person
    if (!contactPerson.trim()) {
      setContactPersonError("Please enter Contact Person Name");
      isValid = false;
    }

    // Address
    if (!address.trim()) {
      setAddressError("Please enter Address");
      isValid = false;
    }

    // City
    if (!city.trim()) {
      setCityError("Please enter City");
      isValid = false;
    }

    // Pincode
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeError("Please enter a valid 6-digit Pincode");
      isValid = false;
    }


    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      setContactEmailError("Please enter a valid Email Address");
      isValid = false;
    }

    // Phone
    if (!/^\d{10}$/.test(contactPhone)) {
      setContactPhoneError("Please enter a valid 10-digit Phone Number");
      isValid = false;
    }

    // Password
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      isValid = false;
    }

    // Subscription Plan ID
    // if (!subscriptionPlanId.trim()) {
    //   setSubscriptionPlanIdError("Please enter Subscription Plan ID");
    //   isValid = false;
    // }
    // Subscription Plan ID is optional
    setSubscriptionPlanIdError("");

    return isValid;
  };
  const handleCreateAccount = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please correct the errors in the form.");
      return;
    }

    try {
      const payload = {
        clientCompanyName,
        address,
        city,
        pincode,
        contactPerson,
        contactEmail,
        contactPhone,
        password,
        subscriptionPlanId,
      };

      const result = await clientSignup(payload);

      Alert.alert("Success", "Account Created Successfully!");
      router.push({
        pathname: "/auth/verificationScreen",
        params: { flow: "signup", email: contactEmail },
      });
    } catch (error) {
      console.log("Signup error:", error);
      Alert.alert("Error", error.message || "Failed to create account");
    }
  };

  // const handleCreateAccount = () => {
  //   if (validateForm()) {
  //     Alert.alert("Success", "Account Created Successfully!"); // For demonstration, replace with actual navigation
  //     router.push({
  //       pathname: "/auth/verificationScreen",
  //       params: { flow: "signup" },
  //     });
  //   } else {
  //     Alert.alert("Validation Error", "Please correct the errors in the form.");
  //   }
  // };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={32} color="#ffff" />
        </TouchableOpacity>

        <Text style={styles.title}>Registration</Text>

        {/* Client Company Name */}
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.label}>Client Company Name</Text>
          <TextInput
            placeholder="Enter company name"
            style={[styles.input, clientCompanyNameError && styles.inputError]}
            value={clientCompanyName}
            onChangeText={(text) => {
              setClientCompanyName(text);
              setClientCompanyNameError(""); // Clear error on change
            }}
          />
          {clientCompanyNameError ? (
            <Text style={styles.errorText}>{clientCompanyNameError}</Text>
          ) : null}
        </View>

        {/* Contact Person */}
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.label}>Contact Person Name</Text>
          <TextInput
            placeholder="Enter contact person"
            style={[styles.input, contactPersonError && styles.inputError]}
            value={contactPerson}
            onChangeText={(text) => {
              setContactPerson(text);
              setContactPersonError("");
            }}
          />
          {contactPersonError ? (
            <Text style={styles.errorText}>{contactPersonError}</Text>
          ) : null}
        </View>

        {/* Address */}
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            placeholder="Enter address"
            style={[styles.input, addressError && styles.inputError]}
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              setAddressError("");
            }}
          />
          {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
        </View>

        {/* City */}
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.label}>City</Text>
          <TextInput
            placeholder="Enter city"
            style={[styles.input, cityError && styles.inputError]}
            value={city}
            onChangeText={(text) => {
              setCity(text);
              setCityError("");
            }}
          />
          {cityError ? <Text style={styles.errorText}>{cityError}</Text> : null}
        </View>

        {/* Pincode */}
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            placeholder="Enter pincode"
            style={[styles.input, pincodeError && styles.inputError]}
            value={pincode}
            onChangeText={(text) => {
              setPincode(text);        // <-- this updates the state
              setPincodeError("");     // <-- clears error
            }}
            keyboardType="numeric"
            maxLength={6}
          />
          {pincodeError ? (
            <Text style={styles.errorText}>{pincodeError}</Text>
          ) : null}
        </View>

        {/* Contact Email */}
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.label}>Contact Email</Text>
          <TextInput
            placeholder="Enter contact email"
            style={[styles.input, contactEmailError && styles.inputError]}
            value={contactEmail}
            onChangeText={(text) => {
              setContactEmail(text);
              setContactEmailError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {contactEmailError ? (
            <Text style={styles.errorText}>{contactEmailError}</Text>
          ) : null}
        </View>

        {/* Contact Phone */}
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.label}>Contact Phone</Text>
          <TextInput
            placeholder="Enter contact phone"
            style={[styles.input, contactPhoneError && styles.inputError]}
            value={contactPhone}
            onChangeText={(text) => {
              setContactPhone(text);
              setContactPhoneError("");
            }}
            keyboardType="numeric"
            maxLength={10}
          />
          {contactPhoneError ? (
            <Text style={styles.errorText}>{contactPhoneError}</Text>
          ) : null}
        </View>

        {/* Password */}
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.passwordContainer,
              passwordError && styles.inputError,
            ]}
          >
            <TextInput
              placeholder="Enter password"
              style={styles.passwordInput}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
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
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>

        {/* Subscription Plan ID */}
        <View style={{ marginBottom: 25 }}>
          <Text style={styles.label}>Subscription Plan</Text>
          <View
            style={[
              styles.input,
              subscriptionPlanIdError && styles.inputError,
              { padding: 0 },
            ]}
          >
            <Picker
              selectedValue={subscriptionPlanId || ""}
              onValueChange={(itemValue) => {
                setSubscriptionPlanId(itemValue);
                setSubscriptionPlanIdError("");
              }}
            >
              <Picker.Item label="-- Select Subscription Plan --" value="" />
              {subscriptionPlans.map((plan) => (
                <Picker.Item key={plan.id} label={plan.name} value={plan.id} />
              ))}
            </Picker>
          </View>
          {subscriptionPlanIdError ? (
            <Text style={styles.errorText}>{subscriptionPlanIdError}</Text>
          ) : null}
        </View>

        {/* Create Account Button */}
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Terms and Privacy */}
        <Text style={styles.bottomText}>
          By continuing, you agree to our{" "}
          <Text style={styles.linkText}>Terms of Service</Text> and{" "}
          <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingTop: 50, flexGrow: 1 },
  backButton: {
    backgroundColor: "#E51C4B", // Red circle for back button
    borderRadius: 20,
    padding: 6,
    marginRight: Sizes.fixPadding * 1.5,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  label: { marginBottom: 6, fontSize: 14, fontWeight: "bold", color: "#333" },
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
  passwordInput: { flex: 1, fontSize: 16 },
  noteText: { fontSize: 12, color: "#666", marginTop: 4 },
  button: {
    backgroundColor: "#E51C4B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  bottomText: { textAlign: "center", color: "#666", fontSize: 14, marginBottom: 20 },
  linkText: { color: "#1E90FF" },
  errorText: {
    color: "#E51C4B", // Red color for error messages
    fontSize: 12,
    marginTop: 4,
  },
  inputError: {
    borderColor: "#E51C4B", // Red border for inputs with errors
  },
});

export default ClientRegisterScreen;