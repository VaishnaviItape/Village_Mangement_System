import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAttachments, getUnits } from "../../api/realApi";
import UnitCardList from "../../components/UnitCardList";

export default function UnitScreen() {
  const route = useRoute();
  const router = useRouter();
  const { propertyId, propertyName, showVacant = false, passedUnits } = route.params || {};
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        let unitsData = passedUnits ? JSON.parse(passedUnits) : await getUnits(token);

        if (showVacant) {
          unitsData = unitsData.filter((unit) => !unit.isOccupied);
        }

        // Fetch one latest image per unit
        const unitsWithImages = await Promise.all(
          unitsData.map(async (unit) => {
            try {
              const attachments = await getAttachments(unit.id, "Unit", token);


              const latestImage = attachments?.length
                ? attachments[attachments.length - 1].fileUrl.replace("http://", "https://")
                : null;
              return { ...unit, latestImage };
            } catch {
              return { ...unit, latestImage: null };
            }
          })
        );
        console.log("Units with images:", unitsWithImages);
        setUnits(unitsWithImages);
      } catch (err) {
        console.error("Failed to fetch units:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  return (
    <View style={styles.container}>
      {/* Units Section Header */}
      <View style={styles.unitsHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.unitsTitle}>
          {propertyName ? `Units of ${propertyName}` : "All Units"}
        </Text>

        {/* ✅ Updated Add Unit button (same as PropertyDetails.js) */}
        <TouchableOpacity
          style={styles.addUnitButton}
          onPress={() =>
            router.push({
              pathname: "/UnitForm/unitForm",
              params: { propertyId: propertyId ?? null },
            })
          }
        >
          <Ionicons name="add-outline" size={16} color="#fff" />
          <Text style={styles.addUnitButtonText}>Add Unit</Text>
        </TouchableOpacity>
      </View>

      {/* Loading or List */}
      {loading ? (
        <ActivityIndicator size="large" color="#E51C4B" style={{ marginTop: 40 }} />
      ) : (
        <UnitCardList units={units} showPropertyName={true} showVacant={showVacant} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8", paddingTop: 40 },

  unitsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  unitsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  // ✅ Add Unit button (updated to match PropertyDetails.js)
  addUnitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50", // Green same as propertyDetails
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  addUnitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 2,
  },

  backButton: {
    backgroundColor: "#E51C4B",
    borderRadius: 20,
    padding: 6,
  },
});
