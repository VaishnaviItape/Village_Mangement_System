import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getTenantDetails } from "../../api/realApi";
export default function TenantDetails() {
  const route = useRoute();
  const router = useRouter();
  const navigation = useNavigation();
  const { tenantId } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const res = await getTenantDetails(tenantId, token);
        setData(res);
      } catch (err) {
        console.error("Failed to load tenant details:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [tenantId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#E51C4B" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loader}>
        <Text>No tenant found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      {/* Custom Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tenant Details</Text>
        <View style={{ width: 22 }} />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push({
              pathname: `/PropertyForm/PropertyForm`,
              params: { propertyId: property.id },
            })
          }
        >
          <Ionicons name="create-outline" size={16} color="#fff" />
          <Text style={styles.editButtonText}> Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tenant Header */}
        <View style={styles.headerCard}>
          <Image
            source={require("../../assets/images/users/default-user.png")}
            style={styles.avatar}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.name}>{data.fullName}</Text>
            <Text style={styles.contact}>📞 {data.phoneNumber}</Text>
            <Text style={styles.contact}>✉️ {data.email}</Text>
          </View>
        </View>

        {/* ID Proofs */}
        <Text style={styles.sectionTitle}>ID Proofs</Text>
        <View style={styles.proofsRow}>
          {data.idProofs?.length ? (
            data.idProofs.map((p) => (
              <Image key={p.id} source={{ uri: p.url }} style={styles.idProof} />
            ))
          ) : (
            <Text style={styles.empty}>No ID proofs uploaded</Text>
          )}
        </View>

        {/* Current Lease */}
        {data.currentAgreement && (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Current Agreement</Text>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={26}
                color="#E51C4B"
              />
            </View>

            <Text style={styles.subText}>
              {data.propertyName} · {data.unitNumber}
            </Text>

            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.label}>Start Date</Text>
                <Text style={styles.value}>
                  {new Date(
                    data.currentAgreement.agreementDate
                  ).toLocaleDateString()}
                </Text>
              </View>
              <View>
                <Text style={styles.label}>End Date</Text>
                <Text style={styles.value}>
                  {new Date(
                    data.currentAgreement.expiryDate
                  ).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.value}>
                Rent ₹{data.currentAgreement.rentAmount}
              </Text>
              <Text style={styles.value}>
                Security Deposit ₹{data.currentAgreement.securityDeposit}
              </Text>
            </View>
          </View>
        )}

        {/* Rent Invoices */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rent Invoices</Text>
          {data.invoices?.length ? (
            data.invoices.map((inv, i) => (
              <View key={i} style={styles.invoiceRow}>
                <Text style={[styles.value, { flex: 1.5 }]}>{inv.month}</Text>
                <Text style={[styles.value, { flex: 1 }]}>₹{inv.amount}</Text>
                <Text
                  style={[
                    styles.status,
                    {
                      color:
                        inv.status === "Paid"
                          ? "#4CAF50"
                          : inv.status === "Overdue"
                            ? "#E51C4B"
                            : "#FF9800",
                    },
                  ]}
                >
                  {inv.status}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>No invoices available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E51C4B",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  name: { fontSize: 18, fontWeight: "700", color: "#333" },
  contact: { fontSize: 14, color: "#555", marginTop: 2 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  proofsRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  idProof: { width: 70, height: 70, borderRadius: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  subText: { color: "#555", marginBottom: 6 },
  label: { fontSize: 13, color: "#777" },
  value: { fontSize: 14, fontWeight: "600", color: "#333" },
  status: { flex: 1, textAlign: "right", fontWeight: "700" },
  invoiceRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  empty: { color: "#777", fontStyle: "italic" },
});
