import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addTenant, getAttachments, getEnumValues, getTenantById, getUnitId, getUnits, updateTenant, uploadAttachment } from "../../api/realApi";
import ImageGallery from "../../components/ImageGallery";
import ImageUploader from "../../components/ImageUploader";
import { Colors, Sizes, commonStyles } from "../../constants/styles";

const TenantScreen = () => {
  const route = useRoute();
  const router = useRouter();
  const { tenantId, unitId: paramUnitId } = useLocalSearchParams();
  const [savedImages, setSavedImages] = useState([]);
  const [tenantImages, setTenantImages] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [moveOutDate, setMoveOutDate] = useState(null); // ✅ default null
  const [unitId, setUnitId] = useState("");
  const [tenantType, setTenantType] = useState("");
  const [units, setUnits] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [propertyImage, setPropertyImage] = useState(null);
  const [showMoveInPicker, setShowMoveInPicker] = useState(false);
  const [showMoveOutPicker, setShowMoveOutPicker] = useState(false);
  const [tenantAgreements, setTenantAgreements] = useState([]);
  const [panCard, setPanCard] = useState([]);
  const [aadhaarCard, setAadhaarCard] = useState([]);

  useEffect(() => {
    const fetchUnitsData = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        let unitsData = [];

        if (tenantId) {
          const tenantUnit = await getUnitId(tenantId, token);
          unitsData = [tenantUnit];
        } else {
          unitsData = await getUnits(token);
        }

        setUnits(unitsData);

        if (paramUnitId) {
          const unitExists = unitsData.some(u => u.id === paramUnitId);
          if (unitExists) setUnitId(paramUnitId);
        }

        const tenantTypeData = await getEnumValues("TenantType");
        setPropertyTypes(tenantTypeData);
      } catch (err) {
        console.error("Failed to fetch units:", err);
      }
    };
    fetchUnitsData();
  }, [tenantId]);

  const pickAgreement = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      setTenantAgreement(result.assets[0]);
    }
  };

  // Fetch Tenant if editing
  useEffect(() => {
    if (tenantId) {
      setIsEditMode(true);
      const fetchTenant = async () => {
        try {
          const token = await AsyncStorage.getItem('accessToken');
          const tenant = await getTenantById(tenantId, token);
          if (tenant) {
            setFullName(tenant.fullName || "");
            setEmail(tenant.email || "");
            setPhoneNumber(tenant.phoneNumber || "");
            setAge(tenant.age?.toString() || "");
            setOccupation(tenant.occupation || "");
            setMoveInDate(tenant.moveInDate?.slice(0, 10) || "");
            setMoveOutDate(tenant.moveOutDate ? tenant.moveOutDate.slice(0, 10) : null); // ✅ null default
            setUnitId(tenant.unitId || "");
            setTenantType(tenant.tenantType || "");
          }
          const attachments = await getAttachments(tenantId, "Tenant", token);
          setSavedImages(attachments);
          const agreements = await getAttachments(tenantId, "TenantAgreement", token);
          setTenantAgreements(agreements);
        } catch (err) {
          console.error("Failed to fetch tenant:", err);
        }
      };
      fetchTenant();
    }
  }, [tenantId]);

  const handleMoveInChange = (event, selectedDate) => {
    setShowMoveInPicker(Platform.OS === "ios");
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setMoveInDate(formatted);
      setErrors(prev => ({ ...prev, moveInDate: "" }));
    }
  };

  const handleMoveOutChange = (event, selectedDate) => {
    setShowMoveOutPicker(Platform.OS === "ios");
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setMoveOutDate(formatted);
      setErrors(prev => ({ ...prev, moveOutDate: "" }));
    }
  };

  const validateDates = () => {
    let valid = true;
    const newErrors = { ...errors };
    if (!moveInDate) {
      newErrors.moveInDate = "Move-in date is required";
      valid = false;
    }
    if (isEditMode) {
      if (!moveOutDate) {
        newErrors.moveOutDate = "Move-out date is required";
        valid = false;
      } else if (moveOutDate < moveInDate) {
        newErrors.moveOutDate = "Move-out date cannot be before Move-in date";
        valid = false;
      }
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    setErrors({});
    let hasError = false;
    const newErrors = {};

    if (!fullName) { newErrors.fullName = "Full Name is required"; hasError = true; }
    if (!email) { newErrors.email = "Email is required"; hasError = true; }
    if (!phoneNumber) { newErrors.phoneNumber = "Phone Number is required"; hasError = true; }
    if (!age || isNaN(parseInt(age))) { newErrors.age = "Age must be a number"; hasError = true; }
    if (!occupation) { newErrors.occupation = "Occupation is required"; hasError = true; }
    if (!validateDates()) { hasError = true; }
    if (!unitId) { newErrors.unitId = "Please select a Unit"; hasError = true; }
    if (!tenantType) { newErrors.tenantType = "Please select Tenant Type"; hasError = true; }

    if (hasError) { setErrors(newErrors); return; }

    setIsLoading(true);
    const tenantData = {
      fullName,
      email,
      phoneNumber,
      age: parseInt(age),
      occupation,
      moveInDate,
      moveOutDate, // ✅ will be null if not set
      unitId,
      tenantType
    };

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (isEditMode) {
        await updateTenant(tenantId, tenantData, token);
        if (tenantImages.length > 0) {
          await uploadAttachment(tenantImages, tenantId, "Tenant", token);
        }
        const documentsToUpload = [...panCard, ...aadhaarCard];
        if (documentsToUpload.length > 0) {
          await uploadAttachment(documentsToUpload, tenantId, "Tenant", token);
        }
        Alert.alert("Success", "Tenant updated successfully!");
      } else {
        await addTenant(tenantData, token);
        Alert.alert("Success", "Tenant added successfully!");
      }
      router.back();
    } catch (err) {
      console.error("Error saving tenant:", err);
      Alert.alert("Error", err.message || "Failed to save tenant.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              <Ionicons name="create-outline" size={16} color="#fff" />
              {isEditMode ? "Edit Tenant" : "Add Tenant"}
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Unit</Text>
            {paramUnitId || isEditMode ? (
              // Read-only view if unitId exists
              <View style={[styles.pickerContainer, { justifyContent: 'center', paddingHorizontal: 10 }]}>
                <Text style={{ fontSize: 16, color: Colors.blackColor }}>
                  {units.find(u => u.id === unitId)?.unitNumber || "Unit not found"}
                </Text>
              </View>
            ) : (
              // Editable dropdown if creating a new tenant
              <View style={[styles.pickerContainer, errors.unitId ? styles.inputError : {}]}>
                <Picker
                  selectedValue={unitId}
                  onValueChange={setUnitId}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Unit" value="" />
                  {units
                    .filter(u => u.isOccupied === false) // Only show available units
                    .map(u => (
                      <Picker.Item key={u.id} label={u.unitNumber} value={u.id} />
                    ))}
                </Picker>
              </View>
            )}
            {errors.unitId && <Text style={styles.errorText}>{errors.unitId}</Text>}

            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={[styles.input, errors.fullName ? styles.inputError : {}]} placeholder="Enter Full Name" value={fullName} onChangeText={setFullName} placeholderTextColor={Colors.grayColor} />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput style={[styles.input, errors.email ? styles.inputError : {}]} placeholder="Enter Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholderTextColor={Colors.grayColor} />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            {/* Phone */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={[styles.input, errors.phoneNumber ? styles.inputError : {}]} placeholder="Enter Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" maxLength={10} placeholderTextColor={Colors.grayColor} />
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

            {/* Age */}
            <Text style={styles.label}>Age</Text>
            <TextInput style={[styles.input, errors.age ? styles.inputError : {}]} placeholder="Enter Age" value={age} onChangeText={setAge} keyboardType="numeric" placeholderTextColor={Colors.grayColor} />
            {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

            {/* Occupation */}
            <Text style={styles.label}>Occupation</Text>
            <TextInput style={[styles.input, errors.occupation ? styles.inputError : {}]} placeholder="Enter Occupation" value={occupation} onChangeText={setOccupation} placeholderTextColor={Colors.grayColor} />
            {errors.occupation && <Text style={styles.errorText}>{errors.occupation}</Text>}

            <Text style={styles.label}>Move-in Date (YYYY-MM-DD)</Text>
            <TouchableOpacity style={[styles.input, errors.moveInDate ? styles.inputError : {}]} onPress={() => setShowMoveInPicker(true)}>
              <Text style={{ color: moveInDate ? "#000" : Colors.grayColor }}>
                {moveInDate || "Select Move-in Date"}
              </Text>
            </TouchableOpacity>
            {showMoveInPicker && (
              <DateTimePicker
                value={moveInDate ? new Date(moveInDate) : new Date()}
                mode="date"
                display="default"
                onChange={handleMoveInChange}
                textColor="#E51C4B"
              />
            )}
            {errors.moveInDate && <Text style={styles.errorText}>{errors.moveInDate}</Text>}

            {isEditMode && (
              <>
                <Text style={styles.label}>Move-out Date (YYYY-MM-DD)</Text>
                <TouchableOpacity style={[styles.input, errors.moveOutDate ? styles.inputError : {}]} onPress={() => setShowMoveOutPicker(true)}>
                  <Text style={{ color: moveOutDate ? "#000" : Colors.grayColor }}>
                    {moveOutDate ?? "Select Move-out Date"}
                  </Text>
                </TouchableOpacity>
                {showMoveOutPicker && (
                  <DateTimePicker
                    value={moveOutDate ? new Date(moveOutDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleMoveOutChange}
                    textColor="#E51C4B"
                  />
                )}
                {errors.moveOutDate && <Text style={styles.errorText}>{errors.moveOutDate}</Text>}
              </>
            )}

            {/* Unit Picker */}
            {/* Unit Picker */}
            {/* <Text style={styles.label}>Select Unit</Text>
            <View style={[styles.pickerContainer, errors.unitId ? styles.inputError : {}]}>
              <Picker
                selectedValue={unitId}
                onValueChange={setUnitId}
                style={styles.picker}
              >
                <Picker.Item label="Select Unit" value="" />
                {units
                  .filter(u => u.isOccupied === false) // Only show units that are not occupied
                  .map(u => (
                    <Picker.Item key={u.id} label={u.unitNumber} value={u.id} />
                  ))}
              </Picker>
            </View>

            {errors.unitId && <Text style={styles.errorText}>{errors.unitId}</Text>} */}


            {/* Tenant Type Picker */}
            <Text style={styles.label}>Tenant Type</Text>
            <View style={[styles.pickerContainer, errors.tenantType ? styles.inputError : {}]}>
              <Picker selectedValue={tenantType} onValueChange={setTenantType} style={styles.picker}>
                <Picker.Item label="Select Tenant Type" value="" />
                {propertyTypes.map(type => <Picker.Item key={type.id} label={type.name} value={type.name} />)}
              </Picker>
            </View>
            {errors.tenantType && <Text style={styles.errorText}>{errors.tenantType}</Text>}
            {isEditMode && (
              <>
                <Text style={styles.label}>Tenant Images</Text>
                <ImageGallery
                  images={savedImages}
                  onDelete={(index, image) => {
                    console.log("Delete tenant image:", image);
                    // TODO: Call delete API here
                  }}
                />

                <ImageUploader
                  images={tenantImages}
                  onChange={(imgs) => setTenantImages(imgs)}
                />

                <Text style={styles.label}>PAN Card</Text>
                <ImageUploader
                  images={panCard}
                  onChange={(files) => setPanCard(files)}
                />

                <Text style={styles.label}>Aadhaar Card</Text>
                <ImageUploader
                  images={aadhaarCard}
                  onChange={(files) => setAadhaarCard(files)}
                />


              </>
            )}

            <TouchableOpacity style={styles.addPropertyButton} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color={Colors.whiteColor} size="small" /> : <Text style={styles.addPropertyButtonText}>{isEditMode ? "Update Tenant" : "Add Tenant"}</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TenantScreen;

// Styles remain mostly the same as your provided styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray, // Light gray background for the entire screen
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Sizes.fixPadding * 2, // Add some padding to the bottom
  },
  errorText: {
    color: "#E51C4B",
    fontSize: 12,
    marginBottom: Sizes.fixPadding,
    marginLeft: Sizes.fixPadding / 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor, // White header
    paddingVertical: Sizes.fixPadding * 1.5,
    paddingHorizontal: Sizes.fixPadding * 2,
    ...commonStyles.shadow, // Add shadow to header
  },
  backButton: {
    backgroundColor: "#E51C4B", // Red circle for back button
    borderRadius: 20,
    padding: 6,
    marginRight: Sizes.fixPadding * 1.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkColor, // Dark text for header title
  },
  formCard: {
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding * 2,
    marginTop: Sizes.fixPadding * 2,
    borderRadius: 10,
    padding: Sizes.fixPadding * 2,
    ...commonStyles.shadow,
    position: 'relative', // Needed for absolute positioning of close button
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Sizes.fixPadding * 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#E51C4B",
  },
  closeButton: {
    position: 'absolute',
    top: Sizes.fixPadding * 1.5,
    right: Sizes.fixPadding * 1.5,
    padding: Sizes.fixPadding / 2,
  },
  label: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: Sizes.fixPadding / 2,
    fontWeight: '500',
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: 8,
    marginBottom: Sizes.fixPadding * 1.5,
    color: Colors.blackColor,
    height: 50,
  },
  uploadPhotoContainer: {
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: 8,
    borderStyle: 'dashed',
    paddingVertical: Sizes.fixPadding * 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.fixPadding * 2.5,
    backgroundColor: Colors.lightGray,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: 8,
    marginBottom: Sizes.fixPadding * 1.5,
    overflow: "hidden", // important for Android to respect borderRadius
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: 8,
    padding: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 1.5,
    fontSize: 16,
    color: Colors.blackColor,
  },
  uploadPhotoContainer: {
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: 8,
    borderStyle: 'dashed',
    paddingVertical: Sizes.fixPadding * 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.fixPadding * 2.5,
    backgroundColor: Colors.lightGray,
  },
  addFileText: {
    fontSize: 14,
    color: Colors.grayColor,
    marginTop: Sizes.fixPadding / 2,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2, // Add margin below navigation buttons
  },
  goBackButton: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: 8,
    paddingVertical: Sizes.fixPadding,
    alignItems: 'center',
    marginRight: Sizes.fixPadding,
  },
  goBackText: {
    color: Colors.darkGray,
    fontSize: 16,
    fontWeight: '600',
  },
  goNextButton: {
    flex: 1,
    backgroundColor: "#E51C4B",
    borderRadius: 8,
    paddingVertical: Sizes.fixPadding,
    alignItems: 'center',
    marginLeft: Sizes.fixPadding,
  },
  goNextText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
  },
  addPropertyButton: {
    backgroundColor: "#E51C4B", // Red background for the "Add Property" button
    borderRadius: 10, // Slightly more rounded corners
    paddingVertical: Sizes.fixPadding * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizes.fixPadding * 2, // More margin above the button
    ...commonStyles.shadow, // Add shadow for a lifted effect
    shadowColor: "#E51C4B", // Red shadow to match the button
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8, // For Android shadow
  },
  addPropertyButtonText: {
    color: Colors.whiteColor,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5, // Slightly increased letter spacing
  },
});
