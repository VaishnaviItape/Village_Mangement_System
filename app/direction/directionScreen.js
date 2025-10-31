import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Switch, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// PG specific sample room amenities and rooms
const amenitiesList = [
  "Parking",
  "WiFi",
  "Security",
  "Housekeeping",
  "Balcony",
  "Elevator"
];
const typeImages = {
  Flat: require("../../assets/images/Flat.png"),
  Villa: require("../../assets/images/Villa.png"),
};
const initialAmenities = {
  Parking: true,
  WiFi: true,
  Security: false,
  Housekeeping: true,
  Balcony: false,
  Elevator: true,
};

const PropertiesScreen = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [propertyType, setPropertyType] = useState(""); // Track type selected
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [roomNumber, setRoomNumber] = useState("101");
  const [floorNumber, setFloorNumber] = useState("1st (auto filled)");
  const [roomType, setRoomType] = useState("Default 1BHK");
  const [roomSize, setRoomSize] = useState("750 sq ft");
  const [rentAmount, setRentAmount] = useState("₹10,000 auto");
  const [deposit, setDeposit] = useState("₹30,000 auto");
  const [maintenance, setMaintenance] = useState("₹30,000");
  const [tenantStatus, setTenantStatus] = useState("Vacant");
  const [tenantName, setTenantName] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [leaseStart, setLeaseStart] = useState("");
  const [leaseEnd, setLeaseEnd] = useState("");
  const [amenities, setAmenities] = useState(initialAmenities);
  const [customAmenity, setCustomAmenity] = useState("");
  const [documentsType, setDocumentsType] = useState("");
  const [uploadedDocFileName, setUploadedDocFileName] = useState("");

  const router = useRouter();
  const navigation = useNavigation();

  // Determine total steps based on property type
  const getTotalSteps = () => {
    if (propertyType === "Flat") return 6; // Steps 1-6 for Flat
    if (propertyType === "Villa") return 2; // Steps for Villa (Property Info + Beds)
    return 0;
  };

  const handleTypeSelect = (label) => {
    setPropertyType(label);
    if (label === "Flat") {
      setActiveStep(1); // Flat starts at step 1
    } else if (label === "Villa") {
      setActiveStep(7); // Villa starts at step 7
    }
  };


  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      if (activeStep === 7 && propertyType !== "Villa") {
        // This is a catch-all if somehow back goes into Villa flow from Flat/PG, reset
        setActiveStep(1);
      } else if (activeStep === 1 && propertyType !== "PG") {
        // If going back from step 1 of Flat/Villa, go back to type selection
        setActiveStep(0);
        setPropertyType(""); // Reset property type
      } else if (activeStep === 7 && propertyType === "Villa") {
        setActiveStep(0); // If going back from step 7 of Villa, go to type selection
        setPropertyType(""); // Reset property type
      }
      else {
        setActiveStep(prev => prev - 1);
      }
    }
  };


  const handleAmenityToggle = (name) => {
    setAmenities(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleAddCustomAmenity = () => {
    if (customAmenity.trim()) {
      setAmenities(prev => ({ ...prev, [customAmenity]: true }));
      setCustomAmenity("");
    }
  };

  // Step 0: Select Property Type
  if (activeStep === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.appBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Properties</Text>
        </View>
        <View style={styles.card}>
          {/* Close button at top-right */}
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>

          <Text style={styles.cardTitle}>Add Tenant</Text>

          <Text style={styles.subtitle}>Select Property Type</Text>
          {/* "PG", "Apartment", */}
          <View style={styles.typeRow}>
            {["Flat", "Villa"].map((label) => (
              <TouchableOpacity
                key={label}
                style={propertyType === label ? styles.cardItemSelected : styles.cardItem}
                onPress={() => handleTypeSelect(label)}
              >
                <Image
                  source={typeImages[label]}
                  style={{ width: 28, height: 28, resizeMode: "contain" }}
                />
                <Text style={styles.cardLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </SafeAreaView>
    );
  }

  // --- Flat / Apartment / PG Flow (Steps 1-6) ---
  if ((propertyType === "Flat" || propertyType === "Apartment" || propertyType === "PG") && activeStep >= 1 && activeStep <= 6) {
    // Step 1: Property Info
    if (activeStep === 1) {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.appBar}>
              <TouchableOpacity style={styles.backCircle} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.appBarTitle}>Properties</Text>
            </View>
            <View style={styles.card}>
              <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <ProgressBar activeStep={1} totalSteps={getTotalSteps()} />
              <Text style={styles.label}>Property Name</Text>
              <TextInput style={styles.input} placeholder="Enter Property Name" value={name} onChangeText={setName} />
              <Text style={styles.label}>Address</Text>
              <TextInput style={styles.input} placeholder="Enter Address" value={address} onChangeText={setAddress} />
              <Text style={styles.label}>Upload Photo</Text>
              <TouchableOpacity style={styles.uploadContainer} onPress={() => setUploadedFileName("SamplePhoto.jpg")}>
                <Ionicons name="camera-outline" size={28} color="grey" />
                <Text style={styles.uploadText}>{uploadedFileName || "Add File"}</Text>
              </TouchableOpacity>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.outlineButton} onPress={handleBack}>
                  <Text>← Go Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.elevatedButton} onPress={handleNext}>
                  <Text style={styles.elevatedText}>Go Next →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    // Step 2: Room Details (Basic Info)
    if (activeStep === 2) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.appBar}>
            <TouchableOpacity style={styles.backCircle} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.appBarTitle}>Properties</Text>
          </View>
          <ScrollView>
            <View style={styles.card}>
              <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <ProgressBar activeStep={2} totalSteps={getTotalSteps()} />
              <Text style={styles.sectionTitle}>Basic Room Info</Text>
              <Text style={styles.label}>Room Number</Text>
              <TextInput style={styles.input} value={roomNumber} editable={false} />
              <Text style={styles.label}>Floor Number</Text>
              <TextInput style={styles.input} value={floorNumber} editable={false} />
              <Text style={styles.label}>Room Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={roomType}
                  style={styles.picker}
                  onValueChange={setRoomType}>
                  <Picker.Item label="Default 1BHK" value="Default 1BHK" />
                  <Picker.Item label="Default 2BHK" value="Default 2BHK" />
                  <Picker.Item label="Dorm" value="Dorm" />
                </Picker>
              </View>
              <Text style={styles.label}>Size</Text>
              <TextInput style={styles.input} value={roomSize} editable={false} />
              <View style={styles.fullWidthButtonContainer}>
                <TouchableOpacity style={styles.elevatedButton} onPress={handleNext}>
                  <Text style={styles.elevatedText}>Go Next →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    // Step 3: Financials (Rent, Deposit, Maintenance)
    if (activeStep === 3) {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.appBar}>
              <TouchableOpacity style={styles.backCircle} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.appBarTitle}>Properties</Text>
            </View>
            <View style={styles.card}>
              <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <ProgressBar activeStep={3} totalSteps={getTotalSteps()} />
              <Text style={styles.sectionTitle}>Financials</Text>
              <Text style={styles.label}>Rent Amount (₹)</Text>
              <TextInput style={styles.input} value={rentAmount} editable={false} />
              <Text style={styles.label}>Deposit (if applicable)</Text>
              <TextInput style={styles.input} value={deposit} editable={false} />
              <Text style={styles.label}>Maintenance Charges (optional)</Text>
              <TextInput style={styles.input} value={maintenance} onChangeText={setMaintenance} />
              <View style={styles.fullWidthButtonContainer}>
                <TouchableOpacity style={styles.elevatedButton} onPress={handleNext}>
                  <Text style={styles.elevatedText}>Go Next →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    // Step 4: Tenant Assignment
    if (activeStep === 4) {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.appBar}>
              <TouchableOpacity style={styles.backCircle} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.appBarTitle}>Properties</Text>
            </View>
            <View style={styles.card}>
              <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <ProgressBar activeStep={4} totalSteps={getTotalSteps()} />
              <Text style={styles.sectionTitle}>Tenant Assignment</Text>
              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={tenantStatus} style={styles.picker} onValueChange={setTenantStatus}>
                  <Picker.Item label="Vacant" value="Vacant" />
                  <Picker.Item label="Occupied" value="Occupied" />
                </Picker>
              </View>
              {tenantStatus === "Occupied" && (
                <>
                  <Text style={styles.label}>Name</Text>
                  <TextInput style={styles.input} value={tenantName} onChangeText={setTenantName} />
                  <Text style={styles.label}>Phone</Text>
                  <TextInput style={styles.input} value={tenantPhone} onChangeText={setTenantPhone} />
                  <Text style={styles.label}>Email</Text>
                  <TextInput style={styles.input} value={tenantEmail} onChangeText={setTenantEmail} />
                  <Text style={styles.label}>Lease Start</Text>
                  <TextInput style={styles.input} value={leaseStart} onChangeText={setLeaseStart} placeholder="dd-mm-yyyy" />
                  <Text style={styles.label}>End date</Text>
                  <TextInput style={styles.input} value={leaseEnd} onChangeText={setLeaseEnd} placeholder="dd-mm-yyyy" />
                </>
              )}
              <View style={styles.fullWidthButtonContainer}>
                <TouchableOpacity style={styles.elevatedButton} onPress={handleNext}>
                  <Text style={styles.elevatedText}>Go Next →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    // Step 5: Room Amenities
    if (activeStep === 5) {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.appBar}>
              <TouchableOpacity style={styles.backCircle} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.appBarTitle}>Properties</Text>
            </View>
            <View style={styles.card}>
              <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <ProgressBar activeStep={5} totalSteps={getTotalSteps()} />
              <Text style={styles.sectionTitle}>Room Details</Text>
              {Object.keys(amenities).map((amenity) => (
                <View style={styles.amenityRow} key={amenity}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                  <Switch value={amenities[amenity]} onValueChange={() => handleAmenityToggle(amenity)} />
                </View>
              ))}
              <View style={styles.customAmenityRow}>
                <TextInput style={styles.inputSmall} value={customAmenity} onChangeText={setCustomAmenity} placeholder="Add Custom Amenity" />
                <TouchableOpacity style={styles.customAmenityBtn} onPress={handleAddCustomAmenity}>
                  <Text style={styles.plusText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.deleteButton}>
                  <Text style={styles.deleteText}>Delete Room</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={() => router.push("Property/allPropertyScreen")}>
                  <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    // Step 6: Upload Documents
    if (activeStep === 6) {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.appBar}>
              <TouchableOpacity style={styles.backCircle} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.appBarTitle}>Properties</Text>
            </View>
            <View style={styles.card}>
              <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <ProgressBar activeStep={6} totalSteps={getTotalSteps()} />
              <Text style={styles.label}>Name</Text>
              <TextInput style={styles.input} value={tenantName} editable={false} />
              <Text style={styles.label}>Phone</Text>
              <TextInput style={styles.input} value={tenantPhone} editable={false} />
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={tenantEmail} editable={false} />
              <Text style={styles.label}>Lease Start</Text>
              <TextInput style={styles.input} value={leaseStart} editable={false} />
              <Text style={styles.label}>End date</Text>
              <TextInput style={styles.input} value={leaseEnd} editable={false} />
              <Text style={styles.label}>Upload Documents</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={documentsType} style={styles.picker} onValueChange={setDocumentsType}>
                  <Picker.Item label="Select Document Type Adhar, Pan" value="" />
                  <Picker.Item label="Adhar" value="Adhar" />
                  <Picker.Item label="Pan" value="Pan" />
                </Picker>
              </View>
              <TouchableOpacity style={styles.uploadContainer} onPress={() => setUploadedDocFileName("SampleDoc.jpg")}>
                <Ionicons name="camera-outline" size={28} color="grey" />
                <Text style={styles.uploadText}>{uploadedDocFileName || "Add File"}</Text>
              </TouchableOpacity>
              <View style={styles.fullWidthButtonContainer}>
                <TouchableOpacity style={styles.elevatedButton} onPress={handleNext}>
                  <Text style={styles.elevatedText}>Go Next →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }

  // --- Villa Specific Flow (Starts from activeStep 7) ---
  if (propertyType === "Villa" && activeStep >= 7) {
    // Step 7: Villa Property Info (Image 8)
    if (activeStep === 7) {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.appBar}>
              <TouchableOpacity style={styles.backCircle} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.appBarTitle}>Properties</Text>
            </View>
            <View style={styles.card}>
              <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <ProgressBar activeStep={1} totalSteps={getTotalSteps()} /> {/* For villa, this is step 1 of 2 */}
              <Text style={styles.cardTitle}>ADD PROPERTY</Text>
              <Text style={styles.label}>Property Name</Text>
              <TextInput style={styles.input} placeholder="Enter Property Name" value={name} onChangeText={setName} />
              <Text style={styles.label}>Address</Text>
              <TextInput style={styles.input} placeholder="Enter Address" value={address} onChangeText={setAddress} />
              <Text style={styles.label}>Upload Photo</Text>
              <TouchableOpacity style={styles.uploadContainer} onPress={() => setUploadedFileName("VillaPhoto.jpg")}>
                <Ionicons name="camera-outline" size={28} color="grey" />
                <Text style={styles.uploadText}>{uploadedFileName || "Add File"}</Text>
              </TouchableOpacity>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.outlineButton} onPress={handleBack}>
                  <Text>← Go Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.elevatedButton} onPress={handleNext}>
                  <Text style={styles.elevatedText}>Go Next →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    // Step 8: Autogenerated Beds for Villa (Image 9)
    if (activeStep === 8) {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.appBar}>
              <TouchableOpacity style={styles.backCircle} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.appBarTitle}>Properties</Text>
            </View>
            <View style={styles.card}>
              <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <ProgressBar activeStep={2} totalSteps={getTotalSteps()} /> {/* For villa, this is step 2 of 2 */}
              <Text style={styles.cardTitle}>ADD PROPERTY</Text>
              <Text style={styles.sectionTitle}>Autogenerated Beds</Text>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((bedNum) => (
                <View key={bedNum} style={styles.bedCard}>
                  <View style={styles.bedInfo}>
                    <Text style={styles.bedLabel}>Bed A-{bedNum}</Text>
                    <Text style={styles.bedStatus}>Rent: ₹15,000</Text>
                    <Text style={styles.bedStatus}>Vacant</Text>
                  </View>
                  <TouchableOpacity style={styles.editBedButton}>
                    <Text style={styles.editBedText}>Edit Bed</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.fullWidthButtonContainer}>
                <TouchableOpacity style={styles.finishButton} onPress={() => alert("Villa Added!")}>
                  <Text style={styles.elevatedText}>Finish →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }

  // Fallback if no step matches (shouldn't happen with correct flow)
  return (
    <SafeAreaView style={styles.container}>
      <Text>Something went wrong or no property type selected.</Text>
      <TouchableOpacity style={styles.elevatedButton} onPress={() => setActiveStep(0)}>
        <Text style={styles.elevatedText}>Go to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Progress Bar UI
const ProgressBar = ({ activeStep, totalSteps }) => (
  <View style={styles.progressBarContainer}>
    {[...Array(totalSteps)].map((_, idx) => (
      <View
        key={idx}
        style={[
          styles.progressDot,
          idx + 1 <= activeStep ? styles.progressDotActive : styles.progressDotInactive, // Use idx + 1 to match activeStep
        ]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", },
  backCircle: {
    backgroundColor: "#E51C4B",
    padding: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  appBar: { flexDirection: "row", alignItems: "center", padding: 16, backgroundColor: "#fff", paddingTop: 50 },
  appBarTitle: { fontSize: 20, fontWeight: "bold", color: "#222" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, margin: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#222" },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 18 },
  typeRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 18,
    paddingHorizontal: 12,
    gap: 10,
  },
  cardItem: { backgroundColor: "#f7f7f7", padding: 18, alignItems: "center", borderRadius: 8, width: 140, marginHorizontal: 4, borderWidth: 1, borderColor: "#eee" },
  cardItemSelected: { backgroundColor: "#fff0f0", padding: 18, alignItems: "center", borderRadius: 8, width: 140, marginHorizontal: 4, borderWidth: 1, borderColor: "#E51C4B" }, // Adjusted selected style
  cardLabel: { fontSize: 13, marginTop: 7, color: "#333" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 14, color: "#222" },
  label: { fontSize: 14, marginTop: 16, marginBottom: 6, color: "#333", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8, backgroundColor: "#fafafa", color: "#222" },
  inputSmall: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "#fafafa", color: "#222", width: 130 },
  uploadContainer: { height: 60, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, backgroundColor: "#f3f3f3", justifyContent: "center", alignItems: "center", marginTop: 8 },
  uploadText: { color: "#555", fontSize: 13 },
  pickerContainer: { // New style for picker wrapper
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: "#fafafa",
    justifyContent: 'center', // Center content vertically
  },
  picker: { height: 44, width: "100%", color: "#222" },
  buttonRow: { flexDirection: "row", marginTop: 20, justifyContent: "space-between" },
  fullWidthButtonContainer: { // New style for single full-width button
    marginTop: 20,
    width: '100%',
  },
  outlineButton: { borderWidth: 1, borderColor: "#222", paddingVertical: 11, borderRadius: 6, alignItems: "center", flex: 1, marginRight: 10 },
  elevatedButton: { backgroundColor: "#E51C4B", paddingVertical: 13, borderRadius: 7, alignItems: "center", flex: 1 }, // Changed color
  elevatedText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  amenityRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 7 },
  amenityText: { fontSize: 14, color: "#222" },
  customAmenityRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  customAmenityBtn: { backgroundColor: "#E51C4B", borderRadius: 5, paddingHorizontal: 11, paddingVertical: 6, marginLeft: 7 }, // Changed color
  plusText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  deleteButton: { borderWidth: 1, borderColor: "#E51C4B", paddingVertical: 12, borderRadius: 6, alignItems: "center", flex: 1, marginRight: 10 }, // Changed color
  deleteText: { color: "#E51C4B", fontWeight: "bold" }, // Changed color
  saveButton: { backgroundColor: "#E51C4B", paddingVertical: 12, borderRadius: 6, alignItems: "center", flex: 1, marginLeft: 10 }, // Changed color
  saveText: { color: "#fff", fontWeight: "bold" },
  progressBarContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 20 },
  progressDot: { height: 10, width: 10, borderRadius: 5, marginHorizontal: 4 },
  progressDotActive: { backgroundColor: "#E51C4B" }, // Changed color
  progressDotInactive: { backgroundColor: "#ddd" }, // Added inactive dot style

  // Villa specific styles
  bedCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  bedInfo: {
    flex: 1,
  },
  bedLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  bedStatus: {
    fontSize: 13,
    color: "#555",
  },
  editBedButton: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  editBedText: {
    color: "#333",
    fontWeight: "bold",
  },
  finishButton: {
    backgroundColor: "#E51C4B", // Changed color
    paddingVertical: 13,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 20,
    width: '100%'
  }
});

export default PropertiesScreen;