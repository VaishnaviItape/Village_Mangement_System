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

import { getMySales } from "../../../api/realApi"; // ✅ Adjust path

const SalesListScreen = () => {
  const router = useRouter();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load all sales for employee
  const loadSales = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const data = await getMySales(token);
      setSales(data || []);
    } catch (error) {
      console.log("Error loading sales:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadSales();
  };

  const renderSale = ({ item }) => (
    <View style={styles.saleCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.saleDate}>
          {new Date(item.dateTime).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
      <Text style={styles.saleAmount}>₹{item.transactionAmount.toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Sales</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/salesForm/AddSaleScreen")}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e51c4b" style={{ marginTop: 40 }} />
      ) : sales.length === 0 ? (
        <Text style={styles.emptyText}>No sales found</Text>
      ) : (
        <FlatList
          data={sales}
          renderItem={renderSale}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

export default SalesListScreen;

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
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e51c4b",
  },
  addBtn: {
    backgroundColor: "#e51c4b",
    borderRadius: 50,
    padding: 8,
  },
  saleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  saleDate: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },
  saleAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e51c4b",
    alignSelf: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: 16,
    marginTop: 40,
  },
});
