// screens/units/unitDetails.js  (replace content)
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { getUnitDetails } from "../../api/realApi";

export default function UnitDetail() {
  const router = useRouter();
  const { unitId } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const dto = await getUnitDetails(unitId, token);
        if (alive) setData(dto);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [unitId]);
  // ✅ move useMemo BEFORE any return
  const topInfo = useMemo(() => {
    console.log(data)
    // console.log(data.tenant.tenantId)
    if (!data) return [];
    return [
      { label: "Property", value: data.propertyName },
      { label: "Unit type", value: data.unitType },
      { label: "Floor", value: data.floor },
      { label: "Rent", value: `₹${Number(data.rent).toLocaleString("en-IN")}/ month` },
      {
        label: "Next vacating date",
        value: data.nextVacatingDate
          ? new Date(data.nextVacatingDate).toLocaleDateString()
          : "—",
      },
    ];
  }, [data]);

  if (loading) {
    return <ActivityIndicator size="large" color="#E51C4B" style={{ flex: 1, marginTop: 40 }} />;
  }
  if (!data) {
    return <Text style={{ marginTop: 40, textAlign: "center" }}>No data</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Unit Details</Text>

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push({
              pathname: `/UnitForm/unitForm`,
              params: { unitId: unitId },
            })
          }
        >
          <Ionicons name="create-outline" size={16} color="#fff" />
          <Text style={styles.editButtonText}> Edit</Text>
        </TouchableOpacity>
      </View>


      {/* Image carousel (unit photos) */}
      <View style={{ height: 220 }}>
        {data.unitPhotos?.length ? (
          <FlatList
            data={data.unitPhotos}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const imageUrl =
                item.fileUrl && item.fileUrl.trim() !== ""
                  ? { uri: item.fileUrl.replace("http://", "https://") } // force https
                  : require("../../assets/images/Building/ImageSection.png");
              return (
                <View style={{ width, height: 220 }}>
                  <Image
                    source={imageUrl}
                    style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                  />
                </View>
              );
            }}
          />
        ) : (
          <Image
            source={require("../../assets/images/Building/ImageSection.png")}
            style={{ width: "100%", height: 220, resizeMode: "cover" }}
          />
        )}


      </View>

      {/* top summary card */}
      <View style={styles.card}>
        {topInfo.map((row, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.k}>{row.label}</Text>
            <Text style={styles.v}>{row.value}</Text>
          </View>
        ))}
      </View>

      {/* tenant details card */}
      {data.tenant ? (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/tenentDetailsScreen/tenentDetails`,
              params: { tenantId: data.tenant.tenantId },
            })
          } activeOpacity={0.8}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tenant Details</Text>

            <View style={styles.row}>
              <Text style={styles.k}>{data.tenant.fullName}</Text>
              <View />
            </View>
            <Text style={styles.subvalue}>{data.tenant.phoneNumber}</Text>
            <Text style={styles.subvalue}>{data.tenant.email}</Text>

            {/* Tenant ID proofs grid */}
            <Text style={[styles.smallTitle, { marginTop: 12 }]}>Tenant ID Proof</Text>
            {data.tenantIdProofs?.length ? (
              <View style={styles.grid}>
                {data.tenantIdProofs.map((a) => (
                  <Image key={a.id} source={{ uri: a.url }} style={styles.thumb} />
                ))}
              </View>
            ) : (
              <Text style={styles.empty}>No ID proof uploaded</Text>
            )}

            {/* Rent Agreement button / thumbnails */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/tenentDetailsScreen/tenentDetails`,
                  params: { tenantId: data.tenant.tenantId },
                })
              } activeOpacity={0.8}>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.smallTitle}>Rent Agreement</Text>
                {data.agreementFiles?.length ? (
                  <View style={styles.rowStart}>
                    {data.agreementFiles.map((f) => (
                      <TouchableOpacity key={f.id} style={styles.docBtn} onPress={() => Linking.openURL(f.url)}>
                        <Ionicons name={f.contentType?.includes("pdf") ? "document-text-outline" : "image-outline"} size={18} color="#333" />
                        <Text numberOfLines={1} style={{ marginLeft: 6, maxWidth: 180 }}>{f.fileName}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.empty}>No agreement uploaded</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tenant Details</Text>
          <Text style={styles.empty}>No tenant assigned</Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push({ pathname: "tenantForm/tenantForm", params: { unitId: data.unitId } })}
          >
            <Text style={styles.primaryBtnText}>Add Tenant</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* active agreement card (quick facts) */}
      {data.activeAgreement && (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `agreementDetails/agrrementDetails`,
              params: { tenantId: unitId },
            })
          } activeOpacity={0.8}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Agreement Details</Text>
            <View style={styles.row}><Text style={styles.k}>Agreement ID</Text><Text style={styles.v}>{data.activeAgreement.agreementId}</Text></View>
            <View style={styles.row}><Text style={styles.k}>Agreement Date</Text><Text style={styles.v}>{new Date(data.activeAgreement.agreementDate).toLocaleDateString()}</Text></View>
            <View style={styles.row}><Text style={styles.k}>Expiry Date</Text><Text style={styles.v}>{new Date(data.activeAgreement.expiryDate).toLocaleDateString()}</Text></View>
            <View style={styles.row}><Text style={styles.k}>Rent Amount</Text><Text style={styles.v}>₹{Number(data.activeAgreement.rentAmount).toLocaleString("en-IN")}</Text></View>
            <View style={styles.row}><Text style={styles.k}>Security Deposit</Text><Text style={styles.v}>₹{Number(data.activeAgreement.securityDeposit).toLocaleString("en-IN")}</Text></View>
          </View>
        </TouchableOpacity>
      )}

      {/* invoices table */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: `rentInvoices/rentinvicedetails`,
            params: { tenantAgreementId: data.tenant.tenantId },
          })
        } activeOpacity={0.8}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rent Invoices</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 1.2 }]}>Month</Text>
            <Text style={[styles.th, { flex: 1 }]}>Invoice #</Text>
            <Text style={[styles.th, { flex: 1 }]}>Amount</Text>
            <Text style={[styles.th, { flex: 1 }]}>Status</Text>
            <Text style={[styles.th, { width: 42, textAlign: "center" }]}>PDF</Text>
          </View>
          {data.invoices?.length ? data.invoices.map((r) => (
            <View key={r.invoiceId} style={styles.tr}>
              <Text style={[styles.td, { flex: 1.2 }]}>{r.month}</Text>
              <Text style={[styles.td, { flex: 1 }]}>{r.invoiceNo?.toString() ?? "—"}</Text>

              <Text style={[styles.td, { flex: 1 }]}>₹{Number(r.amount).toLocaleString("en-IN")}</Text>
              <Text style={[styles.td, { flex: 1, color: r.status === "Paid" ? "#2e7d32" : "#b26a00" }]}>{r.status}</Text>
              <TouchableOpacity
                style={{ width: 42, alignItems: "center" }}
                onPress={() => r.pdfUrl && Linking.openURL(r.pdfUrl)}
                disabled={!r.pdfUrl}
              >
                <Ionicons name="document-text-outline" size={18} color={r.pdfUrl ? "#333" : "#bbb"} />
              </TouchableOpacity>
            </View>
          )) : (
            <Text style={styles.empty}>No invoices</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* unit photos (grid) */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Unit Photos</Text>
        {data.unitPhotos?.length ? (
          <View style={styles.grid}>
            {data.unitPhotos.map((a) => {
              const imgSource =
                a.fileUrl && a.fileUrl.trim() !== ""
                  ? { uri: a.fileUrl.replace("http://", "https://") } // force https
                  : require("../../assets/images/Building/ImageSection.png"); // default image
              const key = a.id || Math.random().toString(); // unique key
              return <Image key={key} source={imgSource} style={styles.thumb} />;
            })}
          </View>
        ) : (
          <Text style={styles.empty}>No photos uploaded</Text>
        )}
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7fb" },
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
    paddingTop: 52, paddingBottom: 14, paddingHorizontal: 16,
    backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 2
  },
  backButton: { backgroundColor: "#E51C4B", padding: 6, borderRadius: 18 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },

  card: {
    backgroundColor: "#fff", marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 14,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },

  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  rowStart: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  k: { color: "#666", fontSize: 14 },
  v: { color: "#222", fontWeight: "600", fontSize: 14, marginLeft: 8 },

  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 8 },
  smallTitle: { fontSize: 13, fontWeight: "600", color: "#444" },
  subvalue: { color: "#444", marginBottom: 2 },

  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 6, marginBottom: 6 },
  th: { fontWeight: "700", color: "#555", fontSize: 12 },
  tr: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f1f1f1" },
  td: { fontSize: 13, color: "#333" },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 },
  thumb: { width: 84, height: 84, borderRadius: 8, backgroundColor: "#eee" },

  docBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#f2f2f6", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, marginRight: 10 },

  empty: { color: "#888", fontStyle: "italic", marginTop: 4 },
  primaryBtn: { backgroundColor: "#E51C4B", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginTop: 10, alignSelf: "flex-start" },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
});
