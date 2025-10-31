import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMyExpenses } from "../../../api/realApi";

const ExpensesScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadData = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await getMyExpenses(token);
      setExpenses(res || []);
    } catch (err) {
      console.log("Error loading expenses:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderExpense = ({ item }) => {
    const statusColor =
      item.status === "HRApproved"
        ? "#4CAF50"
        : item.status === "ManagerApproved"
        ? "#1976D2"
        : item.status === "Rejected"
        ? "#F44336"
        : "#FFA000";

    const bgColor =
      item.status === "HRApproved"
        ? "rgba(76, 175, 80, 0.1)"
        : item.status === "ManagerApproved"
        ? "rgba(25, 118, 210, 0.1)"
        : item.status === "Rejected"
        ? "rgba(244, 67, 54, 0.1)"
        : "rgba(255, 160, 0, 0.1)";

    return (
      <View style={[styles.card, { backgroundColor: "#fff" }]}>
        <View style={styles.cardRow}>
          <Text style={styles.typeText}>{item.expenseType}</Text>
          <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.replace("Approved", " Approved")}
            </Text>
          </View>
        </View>

        <Text style={styles.amountText}>₹{item.amount.toLocaleString()}</Text>
        <Text style={styles.descText}>{item.description}</Text>
        <Text style={styles.dateText}>
          {new Date(item.expenseDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>My Expenses</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/expencesForm/AddExpenseScreen")}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#e51c4b" size="large" style={{ marginTop: 40 }} />
      ) : expenses.length === 0 ? (
        <Text style={styles.noData}>No expenses found</Text>
      ) : (
        <FlatList
          data={expenses}
          renderItem={renderExpense}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
};

export default ExpensesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 18,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e51c4b",
  },
  addBtn: {
    backgroundColor: "#e51c4b",
    borderRadius: 50,
    padding: 8,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  typeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e51c4b",
    marginBottom: 2,
  },
  descText: {
    fontSize: 13,
    color: "#555",
  },
  dateText: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  noData: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginTop: 40,
  },
});
