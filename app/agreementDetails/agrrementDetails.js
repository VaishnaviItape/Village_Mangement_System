import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { getUnitDetails } from "../../api/realApi";
import { Colors } from "../../constants/styles";

export default function AgreementDetail() {
    const route = useRoute();
    const router = useRouter();
    const { tenantId } = route.params || {};

    const [agreement, setAgreement] = useState(null);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const fetchData = async () => {
                console.log(tenantId)
                if (!tenantId) return;
                try {
                    setLoading(true);
                    const token = await AsyncStorage.getItem("accessToken");
                    if (!token) return;

                    const agreementData = await getUnitDetails(tenantId, token);
                    console.log("Agreement data:", agreementData);

                    if (isActive) setAgreement(agreementData);
                } catch (err) {
                    console.error("Failed to fetch data:", err);
                } finally {
                    if (isActive) setLoading(false);
                }
            };

            fetchData();
            return () => {
                isActive = false;
            };
        }, [tenantId])
    );

    if (loading)
        return (
            <ActivityIndicator
                size="large"
                color={Colors.primaryColor}
                style={{ flex: 1, justifyContent: "center" }}
            />
        );

    if (!agreement)
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>No agreement data found</Text>
            </View>
        );

    const tenant = agreement.tenant || {};
    const activeAgreement = agreement.activeAgreement || {};

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Agreement Details</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                        router.push({
                            pathname: "tenantAgrrement/tenantAgreementScreen",
                            params: { tenantId: tenant.tenantId },
                        })
                    }
                >
                    <Ionicons name="create-outline" size={16} color="#fff" />
                    <Text style={styles.editButtonText}> Edit</Text>
                </TouchableOpacity>
            </View>

            {/* Property Info */}
            <View style={styles.container}>
                <Text style={styles.propertyName}>{agreement.propertyName}</Text>
                <Text style={styles.unitType}>{agreement.unitType}</Text>
                <Text style={styles.subtle}>Floor: {agreement.floor}</Text>

                {/* Agreement Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Agreement Information</Text>
                    {[
                        { label: "Agreement ID", value: activeAgreement.agreementId },
                        { label: "Agreement Date", value: activeAgreement.agreementDate?.split("T")[0] },
                        { label: "Expiry Date", value: activeAgreement.expiryDate?.split("T")[0] },
                        { label: "Rent Amount", value: `₹ ${agreement.rent}` },
                        { label: "Security Deposit", value: `₹ ${activeAgreement.securityDeposit}` },
                        { label: "Next Vacating Date", value: agreement.nextVacatingDate?.split("T")[0] },
                    ].map((item, index) => (
                        <View key={index} style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{item.label}</Text>
                            <Text style={styles.infoValue}>{item.value || "N/A"}</Text>
                        </View>
                    ))}
                </View>

                {/* Tenant Info */}
                {/* <View style={styles.card}>
                    <Text style={styles.cardTitle}>Tenant Information</Text>
                    {[
                        { label: "Full Name", value: tenant.fullName },
                        { label: "Email", value: tenant.email },
                        { label: "Phone", value: tenant.phoneNumber },
                        { label: "Move In Date", value: tenant.moveInDate?.split("T")[0] },
                        { label: "Move Out Date", value: tenant.moveOutDate?.split("T")[0] },
                    ].map((item, index) => (
                        <View key={index} style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{item.label}</Text>
                            <Text style={styles.infoValue}>{item.value || "N/A"}</Text>
                        </View>
                    ))}
                </View> */}

                {/* Invoice Section */}
                {agreement.invoices?.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Invoices</Text>
                        {agreement.invoices.map((inv, i) => (
                            <View key={i} style={styles.invoiceRow}>
                                <View>
                                    <Text style={styles.invoiceLabel}>Invoice No: {inv.invoiceNo}</Text>
                                    <Text style={styles.invoiceSub}>Month: {inv.month}</Text>
                                </View>
                                <View style={{ alignItems: "flex-end" }}>
                                    <Text style={styles.invoiceAmount}>₹ {inv.amount}</Text>
                                    <Text style={styles.invoiceStatus}>{inv.status}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Photos */}
                {/* {agreement.unitPhotos?.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Unit Photos</Text>
                        <View style={styles.photoContainer}>
                            {agreement.unitPhotos.map((photo) => (
                                <Image
                                    key={photo.id}
                                    source={{ uri: photo.fileUrl }}
                                    style={styles.photo}
                                />
                            ))}
                        </View>
                    </View>
                )} */}
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
    },
    headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
    backButton: {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 20,
        padding: 6,
    },
    backButton: { backgroundColor: "#E51C4B", borderRadius: 20, padding: 6 },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E51C4B",
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    editButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
    container: { padding: 20 },
    propertyName: { fontSize: 24, fontWeight: "bold", color: "#333" },
    unitType: { fontSize: 16, color: "#777", marginBottom: 4 },
    subtle: { fontSize: 14, color: "#999", marginBottom: 15 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        flexWrap: "wrap", // ✅ allows wrapping
        alignItems: "flex-start", // ✅ aligns text properly if wrapped
    },
    infoLabel: {
        color: "#666",
        fontSize: 15,
        flex: 1, // ✅ allows label to take needed width
        flexWrap: "wrap",
    },
    infoValue: {
        fontWeight: "600",
        color: "#222",
        fontSize: 15,
        flex: 1, // ✅ prevents overflow
        textAlign: "right",
        flexWrap: "wrap",
    },

    invoiceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: "#eee",
        paddingVertical: 8,
    },
    invoiceLabel: { color: "#333", fontWeight: "500" },
    invoiceSub: { color: "#777", fontSize: 13 },
    invoiceAmount: { color: "#111", fontWeight: "bold" },
    invoiceStatus: { color: "#28a745", fontWeight: "600", fontSize: 13 },
    photoContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
});
