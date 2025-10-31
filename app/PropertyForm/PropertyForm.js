import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { addproperty, deleteAttachment, getAttachments, getDistricts, getEnumValues, getPropertyById, getStates, updateProperty, uploadAttachment } from "../../api/realApi";
import ImageGallery from "../../components/ImageGallery";
import ImageUploader from "../../components/ImageUploader";
import { Colors, Sizes, commonStyles } from "../../constants/styles";

const BookingSuccessScreen = () => {
  const route = useRoute();
  const router = useRouter();
  const { propertyId } = route.params || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [savedImages, setSavedImages] = useState([]);
  const [propertyImages, setPropertyImages] = useState([]);

  // Dropdown data
  const [States, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Fetch property types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const data = await getEnumValues("PropertyType");
        setPropertyTypes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTypes();
  }, []);

  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await getStates();
        setStates(data);
        const maharashtra = data.find(s => s.name === "Maharashtra");
        if (maharashtra) {
          setStateId(maharashtra.id);
          fetchDistricts(maharashtra.id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStates();
  }, []);

  const fetchDistricts = async (stateId) => {
    try {
      const data = await getDistricts(stateId);
      setDistricts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch property data if editing
  useEffect(() => {
    if (propertyId) {
      setIsEditMode(true);
      const fetchProperty = async () => {
        try {
          const token = await AsyncStorage.getItem('accessToken');
          const propertyData = await getPropertyById(propertyId, token);
          setName(propertyData.name);
          setPropertyType(propertyData.propertyType);
          setAddress(propertyData.address);
          setPinCode(propertyData.pinCode.toString());
          setTotalUnits(propertyData.totalUnits.toString());
          setStateId(propertyData.stateId);
          setDistrictId(propertyData.districtId);
          const formatImages = (attachments) => {
            return attachments.map(att => ({
              id: att.id,
              uri: att.fileUrl.startsWith("http://")
                ? att.fileUrl.replace("http://", "https://")
                : att.fileUrl
            }));
          };

          // Fetch attached images
          const attachments = await getAttachments(propertyId, "Property", token);
          setSavedImages(formatImages(attachments));

          console.log(attachments, "attachments")
        } catch (err) {
          console.error("Failed to fetch property:", err);
        }
      };
      fetchProperty();
    }
  }, [propertyId]);

  const validate = () => {
    const temp = {};
    if (!name) temp.name = "Property Name required";
    if (!propertyType) temp.propertyType = "Select Property Type";
    if (!address) temp.address = "Address required";
    if (!pinCode) temp.pinCode = "Pin code required";
    if (!totalUnits) temp.totalUnits = "Total Units required";
    if (!stateId) temp.stateId = "Select State";
    if (!districtId) temp.districtId = "Select District";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('accessToken'); // <--- fetch token here
      if (!token) throw new Error("Token not found");

      const propertyData = {
        name,
        propertyType,
        address,
        pinCode: parseInt(pinCode),
        districtId,
        stateId,
        totalUnits: parseInt(totalUnits),
      };

      if (isEditMode) {
        await updateProperty(propertyId, propertyData, token);
        if (propertyImages.length > 0) {
          await uploadAttachment(
            propertyImages,          // file object      // docType
            propertyId,             // entityId
            "Property",             // entityType
            token                   // access token
          );

        }
        setIsLoading(false);
        Alert.alert("Success", "Property updated successfully!");
      } else {
        await addproperty(propertyData, token);
        setIsLoading(false);
        Alert.alert("Success", "Property added successfully!");

      }

      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message || "Something went wrong");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}> <Ionicons name="create-outline" size={16} color="#fff" />{isEditMode ? "Edit Property" : "Add Property"}</Text>
        </View>
        <View style={styles.formCard}>
          <Text style={styles.label}>Property Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter Property Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={Colors.grayColor}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Text style={styles.label}>Property Type</Text>
          <View style={[styles.pickerContainer, errors.propertyType && styles.inputError]}>
            <Picker
              selectedValue={propertyType}
              onValueChange={(val) => setPropertyType(val)}
              style={styles.picker}
            >
              <Picker.Item label="Select Property Type" value="" />
              {propertyTypes.map((type) => (
                <Picker.Item key={type.id} label={type.name} value={type.name} />
              ))}
            </Picker>
          </View>
          {errors.propertyType && <Text style={styles.errorText}>{errors.propertyType}</Text>}

          <Text style={styles.label}>State</Text>
          <View style={[styles.pickerContainer, errors.stateId && styles.inputError]}>
            <Picker
              selectedValue={stateId}
              onValueChange={(val) => {
                setStateId(val);
                fetchDistricts(val);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select State" value="" />
              {States.map((state) => (
                <Picker.Item key={state.id} label={state.name} value={state.id} />
              ))}
            </Picker>
          </View>
          {errors.stateId && <Text style={styles.errorText}>{errors.stateId}</Text>}

          <Text style={styles.label}>District</Text>
          <View style={[styles.pickerContainer, errors.districtId && styles.inputError]}>
            <Picker
              selectedValue={districtId}
              onValueChange={setDistrictId}
              style={styles.picker}
            >
              <Picker.Item label="Select District" value="" />
              {districts.map((district) => (
                <Picker.Item key={district.id} label={district.name} value={district.id} />
              ))}
            </Picker>
          </View>
          {errors.districtId && <Text style={styles.errorText}>{errors.districtId}</Text>}

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, errors.address && styles.inputError]}
            placeholder="Enter Address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor={Colors.grayColor}
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

          <Text style={styles.label}>Pin Code</Text>
          <TextInput
            style={[styles.input, errors.pinCode && styles.inputError]}
            placeholder="Enter Pin Code"
            value={pinCode}
            onChangeText={setPinCode}
            keyboardType="numeric"
            maxLength={6}
            placeholderTextColor={Colors.grayColor}
          />
          {errors.pinCode && <Text style={styles.errorText}>{errors.pinCode}</Text>}

          <Text style={styles.label}>Total Units</Text>
          <TextInput
            style={[styles.input, errors.totalUnits && styles.inputError]}
            placeholder="Enter Total Units"
            value={totalUnits}
            onChangeText={setTotalUnits}
            keyboardType="numeric"
            placeholderTextColor={Colors.grayColor}
          />
          {errors.totalUnits && <Text style={styles.errorText}>{errors.totalUnits}</Text>}
          {isEditMode && (
            <>
              <Text style={styles.label}>Property Images</Text>
              <ImageGallery
                images={savedImages}
                onDelete={async (index, image) => {
                  Alert.alert(
                    "Delete Image",
                    "Are you sure you want to delete this image?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Yes",
                        onPress: async () => {
                          try {
                            const token = await AsyncStorage.getItem('accessToken');
                            if (!token) throw new Error("Token not found");

                            await deleteAttachment(image.id, token);

                            setSavedImages(prev =>
                              prev.filter(img => img.id !== image.id)
                            );

                            Alert.alert("Success", "Image deleted successfully!");
                          } catch (err) {
                            console.error(err);
                            Alert.alert("Error", err.message || "Failed to delete image");
                          }
                        },
                      },
                    ],
                    { cancelable: true }
                  );
                }}
              />
              <ImageUploader
                images={propertyImages}
                onChange={(imgs) => setPropertyImages(imgs)}
              />
            </>
          )}


          <TouchableOpacity style={styles.addPropertyButton} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={Colors.whiteColor} />
            ) : (
              <Text style={styles.addPropertyButtonText}>{isEditMode ? "Update Property" : "Add Property"}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingSuccessScreen;



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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: 8,
    marginBottom: Sizes.fixPadding * 1.5,
    overflow: 'hidden', // Ensures rounded corners
    backgroundColor: Colors.whiteColor, // Optional: white background
  },
  picker: {
    height: 50,
    color: Colors.blackColor,
  },
  inputError: {
    borderColor: "#E51C4B", // Red border on error
  }
  ,

  input: {
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: 8,
    padding: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 1.5,
    fontSize: 16,
    color: Colors.blackColor,
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