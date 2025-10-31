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
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addTenantAgreement, getAttachments, getEnumValues, uploadAttachment } from "../../api/realApi";
import ImageGallery from "../../components/ImageGallery";
import ImageUploader from "../../components/ImageUploader";
import {
    Colors,
    Sizes, commonStyles
} from "../../constants/styles";
// <-- create API function for POST call

const TenantDetailScreen = () => {
    const route = useRoute();
    const router = useRouter();
    const { tenantId } = route.params || {}; // Tenant Id comes from navigation params

    // Form states
    const [agreementDate, setAgreementDate] = useState(new Date().toISOString().split("T")[0]);
    const [expiryDate, setExpiryDate] = useState(new Date().toISOString().split("T")[0]);
    const [validPeriodMonths, setValidPeriodMonths] = useState("");
    const [agreementType, setAgreementType] = useState(""); // Default to empty for validation
    const [securityDeposit, setSecurityDeposit] = useState("");
    const [rentAmount, setRentAmount] = useState("");
    const [maintenanceAmount, setMaintenanceAmount] = useState("");
    const [rentCycle, setRentCycle] = useState(""); // Default to empty for validation

    // Dropdown data
    const [agreementTypes, setAgreementTypes] = useState([]);
    const [rentCycles, setRentCycles] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    // Validation states
    const [agreementTypeError, setAgreementTypeError] = useState("");
    const [rentAmountError, setRentAmountError] = useState("");
    const [rentCycleError, setRentCycleError] = useState("");
    const [validPeriodMonthsError, setValidPeriodMonthsError] = useState("");
    const [securityDepositError, setSecurityDepositError] = useState("");
    const [maintenanceAmountError, setMaintenanceAmountError] = useState("");
    const [agreementDateError, setAgreementDateError] = useState("");
    const [expiryDateError, setExpiryDateError] = useState("");
    // Inside TenantDetailScreen component
    const [savedAgreements, setSavedAgreements] = useState([]); // Existing agreements from API
    const [tenantAgreements, setTenantAgreements] = useState([]); // Newly picked/uploaded agreements


    useEffect(() => {
        const fetchTenantAgreements = async () => {
            if (!tenantId) return;
            try {
                const token = await AsyncStorage.getItem("accessToken");
                const agreements = await getAttachments(tenantId, "TenantAgreement", token);
                setSavedAgreements(agreements);
            } catch (err) {
                console.error("Failed to fetch tenant agreements:", err);
            }
        };
        fetchTenantAgreements();
    }, [tenantId]);

    // Fetch enums (agreement types & rent cycles)
    useEffect(() => {
        const fetchEnums = async () => {
            try {
                const typeData = await getEnumValues("AgreementType");
                setAgreementTypes(typeData);

                const cycleData = await getEnumValues("RentCycle");
                setRentCycles(cycleData);
            } catch (err) {
                console.error("Failed to fetch enums:", err);
            }
        };
        fetchEnums();
    }, []);

    const handleSubmit = async () => {
        // Reset errors
        setAgreementTypeError("");
        setRentAmountError("");
        setRentCycleError("");
        setValidPeriodMonthsError("");
        setSecurityDepositError("");
        setMaintenanceAmountError("");
        setAgreementDateError("");
        setExpiryDateError("");


        let valid = true;

        if (!tenantId) {
            Alert.alert("Error", "Tenant ID not found.");
            valid = false;
        }

        // Validate Agreement Date
        if (!agreementDate) {
            setAgreementDateError("Agreement Date cannot be empty.");
            valid = false;
        }

        // Validate Expiry Date
        if (!expiryDate) {
            setExpiryDateError("Expiry Date cannot be empty.");
            valid = false;
        }

        // Validate Valid Period (Months)
        if (!validPeriodMonths || isNaN(validPeriodMonths) || parseInt(validPeriodMonths) <= 0) {
            setValidPeriodMonthsError("Please enter a valid positive number for months.");
            valid = false;
        }

        // Validate Agreement Type
        if (!agreementType) {
            setAgreementTypeError("Please select an Agreement Type.");
            valid = false;
        }

        // Validate Security Deposit
        if (securityDeposit && isNaN(securityDeposit)) {
            setSecurityDepositError("Please enter a valid Security Deposit amount.");
            valid = false;
        }

        // Validate Rent Amount
        if (!rentAmount || isNaN(rentAmount) || parseFloat(rentAmount) <= 0) {
            setRentAmountError("Please enter a valid Rent Amount.");
            valid = false;
        }

        // Validate Maintenance Amount
        if (maintenanceAmount && isNaN(maintenanceAmount)) {
            setMaintenanceAmountError("Please enter a valid Maintenance Amount.");
            valid = false;
        }


        // Validate Rent Cycle
        if (!rentCycle) {
            setRentCycleError("Please select a Rent Cycle.");
            valid = false;
        }

        if (!valid) {
            return;
        }

        setIsLoading(true);

        const agreementData = {
            agreementDate: new Date(agreementDate).toISOString(),
            expiryDate: new Date(expiryDate).toISOString(),
            validPeriodMonths: parseInt(validPeriodMonths || 0),
            agreementType,
            securityDeposit: parseFloat(securityDeposit || 0),
            rentAmount: parseFloat(rentAmount || 0),
            maintenanceAmount: parseFloat(maintenanceAmount || 0),
            rentCycle,
        };

        try {
            const token = await AsyncStorage.getItem("accessToken");
            if (!token) throw new Error("Auth token not found");

            await addTenantAgreement(tenantId, agreementData, token);
            // After sending agreement form data
            if (tenantAgreements.length > 0) {
                await uploadAttachment(tenantAgreements, tenantId, "TenantAgreement", token);
            }

            Alert.alert("Success", "Tenant Agreement saved successfully!");
            router.back();
        } catch (err) {
            console.error("Failed to save agreement:", err);
            Alert.alert("Error", err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tenant Agreement</Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    <Text style={styles.label}>Agreement Date</Text>
                    <TextInput
                        style={[styles.input, agreementDateError && styles.inputError]}
                        value={agreementDate}
                        onChangeText={setAgreementDate}
                        placeholder="YYYY-MM-DD"
                        onBlur={() => setAgreementDateError(agreementDate ? "" : "Agreement Date cannot be empty.")}
                    />
                    {agreementDateError ? <Text style={styles.errorText}>{agreementDateError}</Text> : null}

                    <Text style={styles.label}>Expiry Date</Text>
                    <TextInput
                        style={[styles.input, expiryDateError && styles.inputError]}
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                        placeholder="YYYY-MM-DD"
                        onBlur={() => setExpiryDateError(expiryDate ? "" : "Expiry Date cannot be empty.")}
                    />
                    {expiryDateError ? <Text style={styles.errorText}>{expiryDateError}</Text> : null}

                    <Text style={styles.label}>Valid Period (Months)</Text>
                    <TextInput
                        style={[styles.input, validPeriodMonthsError && styles.inputError]}
                        keyboardType="numeric"
                        value={validPeriodMonths}
                        onChangeText={(text) => {
                            setValidPeriodMonths(text);
                            if (text && !isNaN(text) && parseInt(text) > 0) {
                                setValidPeriodMonthsError("");
                            }
                        }}
                        placeholder="Enter months"
                        onBlur={() => {
                            if (!validPeriodMonths || isNaN(validPeriodMonths) || parseInt(validPeriodMonths) <= 0) {
                                setValidPeriodMonthsError("Please enter a valid positive number for months.");
                            }
                        }}
                    />
                    {validPeriodMonthsError ? <Text style={styles.errorText}>{validPeriodMonthsError}</Text> : null}

                    <Text style={styles.label}>Agreement Type</Text>
                    <View style={[styles.pickerContainer, agreementTypeError && styles.pickerContainerError]}>
                        <Picker selectedValue={agreementType}
                            onValueChange={(itemValue) => {
                                setAgreementType(itemValue);
                                setAgreementTypeError(itemValue ? "" : "Please select an Agreement Type.");
                            }}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Type" value="" />
                            {agreementTypes.map((t) => (
                                <Picker.Item key={t.id} label={t.name} value={t.name} />
                            ))}
                        </Picker>
                    </View>
                    {agreementTypeError ? <Text style={styles.errorText}>{agreementTypeError}</Text> : null}


                    <Text style={styles.label}>Security Deposit</Text>
                    <TextInput
                        style={[styles.input, securityDepositError && styles.inputError]}
                        keyboardType="numeric"
                        value={securityDeposit}
                        onChangeText={(text) => {
                            setSecurityDeposit(text);
                            if (text && !isNaN(text)) {
                                setSecurityDepositError("");
                            }
                        }}
                        placeholder="Enter amount"
                        onBlur={() => {
                            if (securityDeposit && isNaN(securityDeposit)) {
                                setSecurityDepositError("Please enter a valid Security Deposit amount.");
                            }
                        }}
                    />
                    {securityDepositError ? <Text style={styles.errorText}>{securityDepositError}</Text> : null}

                    <Text style={styles.label}>Rent Amount</Text>
                    <TextInput
                        style={[styles.input, rentAmountError && styles.inputError]}
                        keyboardType="numeric"
                        value={rentAmount}
                        onChangeText={(text) => {
                            setRentAmount(text);
                            if (text && !isNaN(text) && parseFloat(text) > 0) {
                                setRentAmountError("");
                            }
                        }}
                        placeholder="Enter amount"
                        onBlur={() => {
                            if (!rentAmount || isNaN(rentAmount) || parseFloat(rentAmount) <= 0) {
                                setRentAmountError("Please enter a valid Rent Amount.");
                            }
                        }}
                    />
                    {rentAmountError ? <Text style={styles.errorText}>{rentAmountError}</Text> : null}

                    <Text style={styles.label}>Maintenance Amount</Text>
                    <TextInput
                        style={[styles.input, maintenanceAmountError && styles.inputError]}
                        keyboardType="numeric"
                        value={maintenanceAmount}
                        onChangeText={(text) => {
                            setMaintenanceAmount(text);
                            if (text && !isNaN(text)) {
                                setMaintenanceAmountError("");
                            }
                        }}
                        placeholder="Enter amount"
                        onBlur={() => {
                            if (maintenanceAmount && isNaN(maintenanceAmount)) {
                                setMaintenanceAmountError("Please enter a valid Maintenance Amount.");
                            }
                        }}
                    />
                    {maintenanceAmountError ? <Text style={styles.errorText}>{maintenanceAmountError}</Text> : null}

                    <Text style={styles.label}>Rent Cycle</Text>
                    <View style={[styles.pickerContainer, rentCycleError && styles.pickerContainerError]}>
                        <Picker selectedValue={rentCycle}
                            onValueChange={(itemValue) => {
                                setRentCycle(itemValue);
                                setRentCycleError(itemValue ? "" : "Please select a Rent Cycle.");
                            }}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Cycle" value="" />
                            {rentCycles.map((c) => (
                                <Picker.Item key={c.id} label={c.name} value={c.name} />
                            ))}
                        </Picker>
                    </View>
                    {rentCycleError ? <Text style={styles.errorText}>{rentCycleError}</Text> : null}
                    {/* Tenant Agreement */}
                    <Text style={styles.label}>Tenant Agreement</Text>

                    <ImageGallery
                        images={savedAgreements}
                        onDelete={(index, file) => {
                            console.log("Delete tenant agreement:", file);
                            // TODO: call delete API
                        }}
                    />

                    <ImageUploader
                        images={tenantAgreements}
                        onChange={(files) => setTenantAgreements(files)}
                    />

                    {/* Save Button */}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={Colors.whiteColor} />
                        ) : (
                            <Text style={styles.addButtonText}>Save Agreement</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TenantDetailScreen;

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
    addButton: {
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
    addButtonText: {
        color: Colors.whiteColor,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5, // Slightly increased letter spacing
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
        // borderWidth: 1, // This is handled by pickerContainer
        // borderColor: Colors.grayColor,
        // borderRadius: 8,
        // marginBottom: Sizes.fixPadding * 1.5, // Margin handled by parent view
        color: Colors.blackColor,
        height: 50,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.grayColor,
        borderRadius: 8,
        marginBottom: Sizes.fixPadding * 1.5,
        overflow: 'hidden', // Ensures the picker's border radius is respected
    },
    pickerContainerError: {
        borderColor: '#E51C4B', // Red border for error
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
    inputError: {
        borderColor: '#E51C4B', // Red border for error
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