import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Colors, Sizes } from "../../constants/styles";
const tenants = [
  { label: "Apartment", value: "apartment" },
  { label: "Flat", value: "flat" },
  { label: "PG", value: "pg" },
];

const paymentTypes = [
  { label: "Security Deposit", value: "security_deposit" },
  { label: "Monthly Rent", value: "monthly_rent" },
];

export default function RecordPayment() {
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();
  // Step 1
  const [tenantName, setTenantName] = useState("");
  const [propertyImage, setPropertyImage] = useState(null);

  // Step 2
  const [paymentFor, setPaymentFor] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [note, setNote] = useState("");

  // Step 3
  const [paymentProof, setPaymentProof] = useState(null);

  const handleImagePick = async (setter) => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !tenantName) {
      alert("Please select tenant name!");
      return;
    }
    if (activeStep === 1 && (!paymentFor || !amount || !paymentDate)) {
      alert("Please fill all required payment details!");
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleFinish = () => {
    if (!paymentProof) {
      alert("Please upload payment proof!");
      return;
    }
    alert("🎉 Payment Recorded Successfully!");
    setActiveStep(0);
    setTenantName("");
    setPropertyImage(null);
    setPaymentFor("");
    setAmount("");
    setPaymentDate("");
    setNote("");
    setPaymentProof(null);
  };

  return (
    <View style={styles.fullScreenContainer}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
          </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Payment</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Top Card Section */}
        <View style={styles.topCard}>
          <View style={styles.cardHeader}>
            <View style={styles.logoContainer}>
              {/* This is a placeholder for the logo, using a simple circle */}
              <View style={styles.logoCircle} />
              <Text style={styles.addPaymentText}>ADD PAYMENT</Text>
            </View>
            <TouchableOpacity onPress={() => {/* handle close */ }}>
              <Ionicons name="close" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>
          {/* Stepper substitute */}
          <View style={styles.stepper}>
            {[0, 1, 2].map((step) => (
              <View
                key={step}
                style={[styles.step, activeStep >= step && styles.activeStep]}
              />
            ))}
          </View>
        </View>

        {activeStep === 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionLabel}>Tenant</Text>
            <Text style={styles.sectionSubLabel}>Tenant Information</Text>

            {/* Dropdown for Tenant Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tenant Name*</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tenantName}
                  onValueChange={(itemValue) => setTenantName(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Apartment" value="apartment" />
                  {tenants.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>


            {/* Upload/Change Property Image */}
            <Text style={styles.sectionLabel}>Upload/Change Property image</Text>
            <TouchableOpacity
              style={styles.uploadImageButton}
              onPress={() => handleImagePick(setPropertyImage)}
            >
              <Ionicons name="camera-outline" size={24} color="#888" />
              <Text style={styles.uploadImageButtonText}>
                {propertyImage ? "Change Photo" : "Add Photo"}
              </Text>
            </TouchableOpacity>

            {propertyImage && (
              <Image source={{ uri: propertyImage }} style={styles.previewImage} />
            )}

            <TouchableOpacity style={styles.goNextButton} onPress={handleNext}>
              <Text style={styles.goNextButtonText}>Go Next</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {activeStep === 1 && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionLabel}>Payment Details</Text>
            <Text style={styles.sectionSubLabel}>Enter Payment Details</Text>

            {/* Payment For */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Payment For*</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={paymentFor}
                  onValueChange={(itemValue) => setPaymentFor(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Payment For" value="" />
                  {paymentTypes.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>


            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (₹)*</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 5000"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>


            {/* Payment Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Payment Date*</Text>
              <TextInput
                style={styles.textInput}
                placeholder="dd-mm-yyyy"
                value={paymentDate}
                onChangeText={setPaymentDate}
              />
            </View>

            {/* Note */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Note (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Add a note"
                value={note}
                onChangeText={setNote}
              />
            </View>

            <TouchableOpacity style={styles.goNextButton} onPress={handleNext}>
              <Text style={styles.goNextButtonText}>Go Next</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {activeStep === 2 && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionLabel}>Payment Proof</Text>
            <Text style={styles.sectionSubLabel}>Upload Screenshot or Receipt</Text>

            <TouchableOpacity
              style={styles.uploadImageButton}
              onPress={() => handleImagePick(setPaymentProof)}
            >
              <Ionicons name="camera-outline" size={24} color="#888" />
              <Text style={styles.uploadImageButtonText}>
                {paymentProof ? "Change Proof" : "Upload Proof"}
              </Text>
            </TouchableOpacity>

            {paymentProof && (
              <Image source={{ uri: paymentProof }} style={styles.previewImage} />
            )}

            <TouchableOpacity style={styles.goNextButton} onPress={handleFinish}>
              <Text style={styles.goNextButtonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2", // Light grey background for the whole screen
    marginTop: 50
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    backgroundColor: "#E51C4B", // Red circle for back button
    borderRadius: 20,
    padding: 6,
    marginRight: Sizes.fixPadding * 1.5,
  },
  backCircle: {
    backgroundColor: "#E51C4B",
    padding: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6200EE", // Placeholder color for the logo
    marginRight: 8,
  },
  addPaymentText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  stepper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  step: {
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#eee",
    marginHorizontal: 4,
  },
  activeStep: {
    backgroundColor: "#E51C4B",
  },
  contentSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  sectionSubLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden", // Ensures the Picker content stays within bounds
    backgroundColor: "#fff",
  },
  picker: {
    height: 50, // Standard height for input fields
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
  },
  uploadImageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 15,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  uploadImageButtonText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  previewImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "cover",
  },
  goNextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E51C4B",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  goNextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  // Reusing goNextButton for finish, but could define a separate style if needed
  finishButton: {
    backgroundColor: "#E51C4B",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});