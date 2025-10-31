import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getRentInvoicesByAgreement } from "../../api/realApi";
import { Colors } from "../../constants/styles";
export default function RentInvoiceDetails() {
    const route = useRoute();
    const router = useRouter();
    const { tenantAgreementId } = route.params || {};

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            console.log(tenantAgreementId)
            const fetchInvoices = async () => {
                try {
                    setLoading(true);
                    const token = await AsyncStorage.getItem("accessToken");
                    if (!token || !tenantAgreementId) {
                        Alert.alert("Error", "Missing Agreement ID or Token");
                        return;
                    }

                    const data = await getRentInvoicesByAgreement(tenantAgreementId, token);
                    if (isActive) setInvoices(data || []);
                } catch (err) {
                    console.error("Failed to fetch invoices:", err);
                    Alert.alert("Error", "Unable to fetch invoice data.");
                } finally {
                    if (isActive) setLoading(false);
                }
            };

            fetchInvoices();
            return () => (isActive = false);
        }, [tenantAgreementId])
    );
    // 🔹 Header section
    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Rent Invoices</Text>
            <TouchableOpacity
                style={styles.editButton}
            >
                <Ionicons name="create-outline" size={16} color="#fff" />
                <Text style={styles.editButtonText}> Edit</Text>
            </TouchableOpacity> {/* Placeholder to balance header layout */}
        </View>
    );


    const renderInvoiceRow = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={[styles.td, { flex: 1.2 }]}>{item.month}</Text>
            <Text style={[styles.td, { flex: 1 }]}>{item.invoiceNo ?? "—"}</Text>
            <Text style={[styles.td, { flex: 1 }]}>
                ₹{Number(item.amount).toLocaleString("en-IN")}
            </Text>
            <Text
                style={[
                    styles.td,
                    {
                        flex: 1,
                        color: item.status === "Paid" ? "#2e7d32" : "#b26a00",
                        fontWeight: "600",
                    },
                ]}
            >
                {item.status}
            </Text>
            <TouchableOpacity
                style={{ width: 42, alignItems: "center" }}
                onPress={() => item.pdfUrl && Linking.openURL(item.pdfUrl)}
                disabled={!item.pdfUrl}
            >
                <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={item.pdfUrl ? "#333" : "#bbb"}
                />
            </TouchableOpacity>
        </View>
    );

    // 🔹 Loader
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#E51C4B" />
            </View>
        );
    }

    // 🔹 Empty
    if (!invoices.length) {
        return (
            <View style={styles.container}>
                {renderHeader()}
                <View style={styles.card}>
                    <Text style={styles.emptyText}>No invoices found</Text>
                </View>
            </View>
        );
    }

    // 🔹 Main layout
    return (
        <View style={styles.container}>
            {renderHeader()}

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Invoice Details</Text>

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.th, { flex: 1.2 }]}>Month</Text>
                        <Text style={[styles.th, { flex: 1 }]}>Invoice #</Text>
                        <Text style={[styles.th, { flex: 1 }]}>Amount</Text>
                        <Text style={[styles.th, { flex: 1 }]}>Status</Text>
                        <Text style={[styles.th, { width: 42, textAlign: "center" }]}>PDF</Text>
                    </View>

                    <FlatList
                        data={invoices}
                        keyExtractor={(item) => item.invoiceId}
                        renderItem={renderInvoiceRow}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fafafa" },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E51C4B",
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    editButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 20,
        paddingTop: 50,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    backButton: { backgroundColor: "#E51C4B", borderRadius: 20, padding: 6 },
    headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
    card: {
        backgroundColor: "#fff",
        margin: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
        textAlign: "center",
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 6,
        marginBottom: 4,
    },
    th: { fontWeight: "bold", fontSize: 13, color: "#555" },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: "#eee",
    },
    td: { fontSize: 13, color: "#333" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyText: { textAlign: "center", color: "#888", fontSize: 16, padding: 30 },
});
