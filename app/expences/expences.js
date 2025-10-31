import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getExpenses } from "../../api/realApi";

export default function ExpenseScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRoute();
  const [expensesData, setExpensesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const { unitId } = route.params || {};

  useEffect(() => {
    fetchExpenses();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem("accessToken");
      if (!storedToken) return;
      setToken(storedToken);

      const data = await getExpenses(unitId, storedToken);
      setExpensesData(data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    router.push({
      pathname: "expencesForm/expencesForm",
      params: { unitId },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "expensesDetails/expensesDetails",
          params: { expenseId: item.id, unitId: item.unitId },
        })
      }
      activeOpacity={0.8}
    >
      {/* Left Image (Before Photo) */}
      {/* After Photo (small preview on right) */}
      <Image
        source={
          item.afterPhotoUrl
            ? { uri: item.afterPhotoUrl.startsWith("http") ? item.afterPhotoUrl : `https://rent-api.tmkcomputers.in/${item.afterPhotoUrl}` }
            : require("../../assets/images/Building/ImageSection.png") // fallback placeholder
        }
        style={styles.afterImage}
      />

      {/* Expense Details */}
      <View style={styles.cardContent}>
        <Text style={styles.expenseUnit}>🏠 Unit: {item.unitNumber || "N/A"}</Text>
        <Text style={styles.expenseAmount}>💰 Paid: ₹{item.paidAmount || 0}</Text>
        <Text style={styles.expenseDate}>
          📅 Date: {new Date(item.date).toDateString()}
        </Text>
        <Text style={styles.expenseDescription}>
          📝 {item.description || "No description provided"}
        </Text>

        {/* Image status row */}
        <View style={styles.photosRow}>
          <Text>Before: {item.beforePhotoUrl ? "✅" : "❌"}</Text>
          <Text>After: {item.afterPhotoUrl ? "✅" : "❌"}</Text>
        </View>
      </View>

      {/* After Photo (small preview on right) */}
      {item.afterPhotoUrl ? (
        <Image source={{ uri: item.afterPhotoUrl }} style={styles.afterImage} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Expenses</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Text style={styles.addButtonText}>+ Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#E51C4B" />
      ) : (
        <FlatList
          data={expensesData}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", paddingHorizontal: 15, paddingTop: 50 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#222" },
  addButton: {
    backgroundColor: "#E51C4B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
  },
  addButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 15,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: { width: 70, height: 70, borderRadius: 12, marginRight: 12, resizeMode: "cover" },
  cardContent: { flex: 1 },
  expenseUnit: { fontSize: 16, fontWeight: "700", color: "#222", marginBottom: 2 },
  expenseAmount: { fontSize: 13, color: "#444", marginBottom: 2 },
  expenseDate: { fontSize: 13, color: "#777", marginBottom: 4 },
  expenseDescription: { fontSize: 13, color: "#555", marginBottom: 4, fontStyle: "italic" },
  photosRow: { flexDirection: "row", justifyContent: "space-between", width: 150 },
  afterImage: { width: 50, height: 50, borderRadius: 8, marginLeft: 8, resizeMode: "cover" },
});
