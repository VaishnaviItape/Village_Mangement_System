import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAttachments, getPropertyById, getUnitsByPropertyId } from "../../api/realApi";
import UnitCardList from "../../components/UnitCardList";
import { Colors } from "../../constants/styles";

export default function PropertyDetail() {
  const route = useRoute();
  const router = useRouter();
  const { propertyId } = route.params;

  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchPropertyAndUnits = async () => {
        try {
          setLoading(true);
          const storedToken = await AsyncStorage.getItem("accessToken");
          if (!storedToken || !propertyId) return;

          const [propertyData, propertyAttachments, unitsData] = await Promise.all([
            getPropertyById(propertyId, storedToken),
            getAttachments(propertyId, "Property", storedToken),
            getUnitsByPropertyId(propertyId, storedToken),
          ]);

          const unitsWithImages = await fetchUnitsWithAttachments(unitsData, storedToken);

          if (isActive) {
            setProperty(propertyData);
            setAttachments(propertyAttachments || []);
            setUnits(unitsWithImages);
          }

        } catch (err) {
          console.error("Failed to fetch property or units:", err);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchPropertyAndUnits();
      return () => (isActive = false);
    }, [propertyId])
  );
  const fetchUnitsWithAttachments = async (unitsData, token) => {
    const unitsWithImages = await Promise.all(
      unitsData.map(async (unit) => {
        const unitAttachments = await getAttachments(unit.id, "Unit", token);
        // Take first attachment as latestImage
        return {
          ...unit,
          latestImage: unitAttachments?.[0]?.fileUrl.replace("http://", "https://") || null
        };
      })
    );
    return unitsWithImages;
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#E51C4B" style={{ flex: 1, justifyContent: "center" }} />
    );

  if (!property)
    return (
      <Text style={{ flex: 1, textAlign: "center", marginTop: 50 }}>
        No property data found
      </Text>
    );

  // ✅ Header section (Property Info + Images)
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Details</Text>
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

      {/* Image Slider */}
      <View style={{ height: 250 }}>
        {attachments.length > 0 ? (
          <FlatList
            data={attachments}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.fileUrl.replace("http://", "https://") }}

                style={{
                  width: Dimensions.get("window").width,
                  height: 250,
                  resizeMode: "cover",
                }}
              />
            )}
          />
        ) : (
          <Image
            source={require("../../assets/images/Building/ImageSection.png")}
            style={{ width: "100%", height: 250, resizeMode: "cover" }}
          />
        )}
      </View>

      {/* Property Info */}
      <View style={styles.detailsContainer}>
        <Text style={styles.propertyName}>{property.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={16} color="#888" />
          <Text style={styles.locationText}>
            {property.address}, {property.pinCode}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Property Details</Text>
          {[
            { label: "Name", value: property.name },
            { label: "Type", value: property.propertyType },
            { label: "Address", value: property.address },
            { label: "Pin Code", value: property.pinCode },
            { label: "District", value: property.districtName },
            { label: "State", value: property.stateName },
            { label: "Total Units", value: property.totalUnits },
          ].map((item, idx) => (
            <View key={idx} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value || "N/A"}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 🔹 Divider line */}
      <View style={styles.sectionDivider} />

      {/* 🔹 Units Section (with shaded background) */}
      <View style={styles.unitsSection}>
        {/* Header Row */}
        <View style={styles.unitsHeaderRow}>
          <Text style={styles.unitsTitle}>Units</Text>
          <TouchableOpacity
            style={styles.addUnitButton}
            onPress={() =>
              router.push({
                pathname: "/UnitForm/unitForm",
                params: { propertyId: property?.id ?? null },
              })
            }
          >
            <Ionicons name="add-outline" size={16} color="#fff" />
            <Text style={styles.addUnitButtonText}>Add Unit</Text>
          </TouchableOpacity>
        </View>

        {/* Unit count summary */}
        <Text style={styles.unitsCountText}>
          {units.length > 0
            ? `Showing ${Math.min(2, units.length)} of ${units.length} Units`
            : "No units added yet"}
        </Text>

        {/* Unit list */}
        <UnitCardList units={units.slice(0, 2)} showPropertyName={false} />

        {/* Conditionally show View Remaining button */}
        {units.length > 2 && (
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <TouchableOpacity
              style={styles.viewRemainingButton}
              onPress={() =>
                router.push({
                  pathname: `/allUnits/allUnits`,
                  params: {
                    propertyId: property.id,
                    propertyName: property.name,
                    units: JSON.stringify(units),
                  },
                })
              }
            >
              <Text style={styles.viewRemainingButtonText}>
                View Remaining {units.length - 2} Units
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      data={[{}]} // dummy to render header
      renderItem={() => null}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: { backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
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
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E51C4B",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  editButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  detailsContainer: { padding: 20 },
  propertyName: { fontSize: 24, fontWeight: "bold", marginBottom: 5, color: "#333" },
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  locationText: { fontSize: 16, color: "#888", marginLeft: 5 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  infoLabel: { fontSize: 15, color: "#555", flex: 1 },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    flex: 1,
    textAlign: "right",
  },

  // 🔹 New Styles for Units Section
  sectionDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  unitsSection: {
    backgroundColor: "#fafafa",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  unitsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  unitsTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  addUnitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  addUnitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14, marginLeft: 2 },
  unitsCountText: { color: "#888", marginBottom: 10 },
  viewRemainingButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  viewRemainingButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
