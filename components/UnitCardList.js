import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UnitCardList({
  units = [],
  showPropertyName = false,
  showVacant = false,
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(showVacant ? "VACANT" : "ALL");

  // Filter units based on tab selection
  const filteredUnits =
    activeTab === "ALL"
      ? units
      : activeTab === "OCCUPIED"
        ? units.filter((unit) => unit.isOccupied)
        : units.filter((unit) => !unit.isOccupied);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.unitCard}
      onPress={() =>
        router.push({
          pathname: `/unitDetails/unitDetails`,
          params: { unitId: item.id },
        })
      }
    >
      {/* Unit Image */}
      <Image
        source={
          item.latestImage
            ? { uri: item.latestImage }
            : require("../assets/images/Building/ImageSection.png")
        }
        style={styles.unitImage}
      />

      {/* Unit Info */}
      <View style={styles.unitInfo}>
        <Text style={styles.unitTitle}>Unit {item.unitNumber || "N/A"}</Text>
        {showPropertyName && (
          <Text style={styles.propertyName}>
            {item.propertyName || "Unknown Property"}
          </Text>
        )}
        <Text style={styles.detailText}>
          {item.unitType || "N/A"} | {item.unitNumber || "N/A"}
        </Text>
        <Text style={styles.rentText}>₹{item.rentAmount || "0"}/month</Text>
      </View>

      {/* Occupancy Badge */}
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: item.isOccupied ? "#E51C4B" : "#4CAF50" },
        ]}
      >
        <Text style={styles.statusText}>
          {item.isOccupied ? "OCCUPIED" : "VACANT"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {/* Show only when showVacant is false */}
        {!showVacant && (
          <>
            <TouchableOpacity
              style={[styles.tab, activeTab === "ALL" && styles.activeTab]}
              onPress={() => setActiveTab("ALL")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "ALL" && styles.activeTabText,
                ]}
              >
                ALL
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "OCCUPIED" && styles.activeTab]}
              onPress={() => setActiveTab("OCCUPIED")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "OCCUPIED" && styles.activeTabText,
                ]}
              >
                OCCUPIED
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Always show VACANT tab */}
        <TouchableOpacity
          style={[styles.tab, activeTab === "VACANT" && styles.activeTab]}
          onPress={() => setActiveTab("VACANT")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "VACANT" && styles.activeTabText,
            ]}
          >
            VACANT
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUnits}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : `unit-${index}`)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  unitCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  unitImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  unitInfo: { flex: 1 },
    unitTitle: { fontSize: 16, fontWeight: "700", color: "#222" },
    propertyName: { fontSize: 14, color: "#666", marginBottom: 3 },
    detailText: { color: "#444", fontSize: 13 },
    rentText: { color: "#E51C4B", fontWeight: "600", marginTop: 4 },
    statusBadge: {
      position: "absolute",
      right: 10,
      top: 10,
      borderRadius: 14,
      paddingVertical: 4,
      paddingHorizontal: 10,
    },
    statusText: { color: "#fff", fontSize: 12, fontWeight: "700" },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: "#f2f2f2",
      paddingVertical: 10,
      borderRadius: 8,
      marginBottom: 10,
    },
    tab: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    activeTab: {
      backgroundColor: "#E51C4B",
    },
    tabText: {
      color: "#000",
      fontWeight: "600",
    },
    activeTabText: {
      color: "#fff",
    },
});
