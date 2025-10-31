import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
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
import ImageGallery from "../../components/ImageGallery";
import ImageUploader from "../../components/ImageUploader";

import { addUnit, deleteAttachment, getAttachments, getEnumValues, getUnitId, getproperty, updateUnit, uploadAttachment } from "../../api/realApi";
import { Colors, Sizes, commonStyles } from "../../constants/styles";
const UnitFormScreen = () => {
  const route = useRoute();
  const [buildingName, setBuildingName] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [unitType, setUnitType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [areaInSqFt, setAreaInSqFt] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [savedImages, setSavedImages] = useState([]);
  const [unitImages, setUnitImages] = useState([]);

  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const router = useRouter();
  const { unitId = null, propertyId: paramPropertyId = null } = route.params || {};

  const [isEditMode, setIsEditMode] = useState(false);
  const [propertyImage, setPropertyImage] = useState(null);
  // Fetch Unit data if editing
  useEffect(() => {
    if (unitId) {
      setIsEditMode(true);
      const fetchUnit = async () => {
        try {
          const token = await AsyncStorage.getItem('accessToken');
          const unitData = await getUnitId(unitId, token);

          if (unitData) {
            setBuildingName(unitData.buildingName || "");
            setUnitNumber(unitData.unitNumber?.toString() || "");
            setUnitType(unitData.unitType || "");
            setCapacity(unitData.capacity?.toString() || "");
            setFloorNumber(unitData.floorNumber?.toString() || "");
            setAreaInSqFt(unitData.areaInSqFt?.toString() || "");
            setRentAmount(unitData.rentAmount?.toString() || "");
            setPropertyId(unitData.propertyId || "");
          }

          // ✅ Fetch existing attachments
          // ✅ Fetch existing attachments and format them for ImageGallery
          const attachments = await getAttachments(unitId, "Unit", token);
          const formattedImages = attachments.map(att => ({
            id: att.id,
            fileUrl: att.fileUrl.startsWith("http://")
              ? att.fileUrl.replace("http://", "https://")
              : att.fileUrl
          }));
          setSavedImages(formattedImages);
          console.log("setSavedImages", formattedImages);

        } catch (err) {
          console.error("Failed to fetch unit:", err);
        }
      };
      fetchUnit();
    }
  }, [unitId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPropertyImage(result.assets[0]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) throw new Error("Auth token not found. Please login again.");

        const propertyData = await getproperty(token);
        setProperties(propertyData);

        const propertyTypeData = await getEnumValues("UnitType");
        setPropertyTypes(propertyTypeData);

        // ✅ Set default propertyId from route params
        if (paramPropertyId) {
          // Make sure this property exists in fetched data
          const propertyExists = propertyData.some(d => d.id === paramPropertyId);
          if (propertyExists) setPropertyId(paramPropertyId);
        }
      } catch (error) {
        console.error("Failed to fetch enums or properties:", error);
        Alert.alert("Error", error.message || "Failed to fetch data.");
      }
    };

    fetchData();
  }, []);



  const handleSubmit = async () => {
    // Reset errors
    setErrors({});
    let hasError = false;
    const newErrors = {};

    if (!buildingName) { newErrors.buildingName = "Building Name cannot be empty."; hasError = true; }
    if (!unitNumber) { newErrors.unitNumber = "Unit Number cannot be empty."; hasError = true; }
    if (!unitType) { newErrors.unitType = "Please select Unit Type."; hasError = true; }
    if (!propertyId) { newErrors.propertyId = "Please select Property."; hasError = true; }
    if (!capacity || isNaN(parseInt(capacity))) { newErrors.capacity = "Capacity must be a number."; hasError = true; }
    if (!floorNumber || isNaN(parseInt(floorNumber))) { newErrors.floorNumber = "Floor Number must be a number."; hasError = true; }
    if (!areaInSqFt || isNaN(parseInt(areaInSqFt))) { newErrors.areaInSqFt = "Area must be a number."; hasError = true; }
    if (!rentAmount || isNaN(parseInt(rentAmount))) { newErrors.rentAmount = "Rent Amount must be a number."; hasError = true; }

    if (hasError) { setErrors(newErrors); return; }

    setIsLoading(true);

    const unitData = {
      buildingName,
      unitNumber,
      unitType,
      capacity: parseInt(capacity),
      floorNumber: parseInt(floorNumber),
      areaInSqFt: parseInt(areaInSqFt),
      rentAmount: parseInt(rentAmount),
      propertyId
    };

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (isEditMode) {
        await updateUnit(unitId, unitData, token);
        if (unitImages.length > 0) {
          await uploadAttachment(unitImages, unitId, "Unit", token);
        }
        Alert.alert("Success", "Unit updated successfully!");
      } else {
        await addUnit(unitData, token);
        Alert.alert("Success", "Unit added successfully!");
      }


      router.back();
    } catch (error) {
      console.error("Failed to add property:", error);
      Alert.alert("Error", error.message || "Failed to add property. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}> {isEditMode ? "Edit Unit" : "Add New Unit"}</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Property</Text>
          {paramPropertyId || isEditMode ? (
            // Read-only view if propertyId exists
            <View style={[styles.pickerContainer, { justifyContent: 'center', paddingHorizontal: 10 }]}>
              <Text style={{ fontSize: 16, color: Colors.blackColor }}>
                {properties.find(d => d.id === propertyId)?.name || "Property not found"}
              </Text>
            </View>
          ) : (
            // Editable dropdown if creating a new unit
            <View style={[styles.pickerContainer, errors.propertyId ? styles.inputError : {}]}>
              <Picker
                selectedValue={String(propertyId)}
                onValueChange={(val) => setPropertyId(String(val))}
              >
                <Picker.Item label="Select Property" value="" />
                {properties.map(d => (
                  <Picker.Item key={d.id} label={d.name} value={String(d.id)} />
                ))}
              </Picker>
            </View>
          )}
          {errors.propertyId && <Text style={styles.errorText}>{errors.propertyId}</Text>}

          {/* <Text style={styles.label}>Select Property</Text>
          <View style={[styles.pickerContainer, errors.propertyId ? styles.inputError : {}]}>
            <Picker
              selectedValue={String(propertyId)}
              onValueChange={(val) => setPropertyId(String(val))}
            >
              <Picker.Item label="Select Property" value="" />
              {properties.map(d => (
                <Picker.Item key={d.id} label={d.name} value={String(d.id)} />
              ))}
            </Picker>
          </View>
          {errors.propertyId && <Text style={styles.errorText}>{errors.propertyId}</Text>} */}

          <Text style={styles.label}>Building Name</Text>
          <TextInput
            style={[styles.input, errors.buildingName ? styles.inputError : {}]}
            placeholder="Enter Building Name"
            value={buildingName}
            onChangeText={setBuildingName}
            placeholderTextColor={Colors.grayColor}
          />
          {errors.buildingName && <Text style={styles.errorText}>{errors.buildingName}</Text>}

          <Text style={styles.label}>Unit Number</Text>
          <TextInput
            style={[styles.input, errors.unitNumber ? styles.inputError : {}]}
            placeholder="Enter Unit Number"
            value={unitNumber}
            onChangeText={setUnitNumber}
            placeholderTextColor={Colors.grayColor}
          />
          {errors.unitNumber && <Text style={styles.errorText}>{errors.unitNumber}</Text>}

          <Text style={styles.label}>Unit Type</Text>
          <View style={[styles.pickerContainer, errors.unitType ? styles.inputError : {}]}>
            <Picker
              selectedValue={unitType}
              onValueChange={setUnitType}
              dropdownIconColor="#000"       // ✅ ensures black dropdown arrow
              style={styles.picker}            // ✅ apply text color
            >
              <Picker.Item label="Select Unit Type" value="" />
              {propertyTypes.map(type => (
                <Picker.Item key={type.id} label={type.name} value={type.name} />
              ))}
            </Picker>

          </View>
          {errors.unitType && <Text style={styles.errorText}>{errors.unitType}</Text>}

          <Text style={styles.label}>Capacity</Text>
          <TextInput
            style={[styles.input, errors.capacity ? styles.inputError : {}]}
            placeholder="Enter Capacity"
            keyboardType="numeric"
            value={capacity}
            onChangeText={setCapacity}
            placeholderTextColor={Colors.grayColor}
          />
          {errors.capacity && <Text style={styles.errorText}>{errors.capacity}</Text>}

          <Text style={styles.label}>Floor Number</Text>
          <TextInput
            style={[styles.input, errors.floorNumber ? styles.inputError : {}]}
            placeholder="Enter Floor Number"
            keyboardType="numeric"
            value={floorNumber}
            onChangeText={setFloorNumber}
            placeholderTextColor={Colors.grayColor}
          />
          {errors.floorNumber && <Text style={styles.errorText}>{errors.floorNumber}</Text>}

          <Text style={styles.label}>Area (sq ft)</Text>
          <TextInput
            style={[styles.input, errors.areaInSqFt ? styles.inputError : {}]}
            placeholder="Enter Area in SqFt"
            keyboardType="numeric"
            value={areaInSqFt}
            onChangeText={setAreaInSqFt}
            placeholderTextColor={Colors.grayColor}
          />
          {errors.areaInSqFt && <Text style={styles.errorText}>{errors.areaInSqFt}</Text>}

          <Text style={styles.label}>Rent Amount</Text>
          <TextInput
            style={[styles.input, errors.areaInSqFt ? styles.inputError : {}]}
            placeholder="Enter Rent Amount"
            keyboardType="numeric"
            value={rentAmount}
            onChangeText={setRentAmount}
            placeholderTextColor={Colors.grayColor}
          />
          {errors.rentAmount && <Text style={styles.errorText}>{errors.rentAmount}</Text>}

          {isEditMode && (
            <>
              <Text style={styles.label}>Unit Images</Text>
              <ImageGallery
                images={
                  savedImages.length > 0
                    ? savedImages.map(img => ({ id: img.id, fileUrl: img.fileUrl })) // map saved images correctly
                    : [{ fileUrl: "https://via.placeholder.com/150" }]   // placeholder if empty
                }
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
                images={unitImages}
                onChange={(imgs) => setUnitImages(imgs)}
              />
            </>
          )}


          <TouchableOpacity
            style={styles.addPropertyButton}
            onPress={handleSubmit}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.whiteColor} size="small" />
            ) : (

              <Text style={styles.addPropertyButtonText}>
                <Ionicons name="create-outline" size={16} color="#fff" /> {isEditMode ? "Edit Unit" : "Add Unit"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default UnitFormScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    paddingTop: 40// Light gray background for the entire screen
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Sizes.fixPadding * 2, // Add some padding to the bottom
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: 8,
    marginBottom: Sizes.fixPadding * 1.5,
    backgroundColor: Colors.whiteColor, // Make container white
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 10,
    color: "#000",// optional, for inner padding
  },
  picker: {
    color: "#000", // ✅ ensures selected text is visible
    fontSize: 15,
    width: "100%",
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
