import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts, postSale } from "../../api/realApi"; // adjust path if needed

const AddSaleScreen = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Load products list from API
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const list = await getProducts(token);
        setProducts(list || []);
      } catch (error) {
        console.log("Failed to load products:", error.message);
        Alert.alert("Error", "Unable to load products");
      }
    })();
  }, []);

  // ✅ Handle submit
  const handleSubmit = async () => {
    if (!selectedProduct || !amount) {
      Alert.alert("Missing Info", "Please select a product and enter amount");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const payload = {
        productId: selectedProduct,
        amount: parseFloat(amount),
        date: date.toISOString(),
      };

      const response = await postSale(payload, token);
      console.log('postSale response', response);
      if (response && response.id) {
        Alert.alert("Success", "Sale added successfully!");
        setSelectedProduct("");
        setAmount("");
        setDate(new Date());
      } else {
        Alert.alert("Failed", response?.message || "Could not save sale");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Add New Sale</Text>

        {/* Product Dropdown */}
        <Text style={styles.label}>Select Product</Text>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedProduct}
            onValueChange={(val) => setSelectedProduct(val)}
          >
            <Picker.Item label="-- Select Product --" value="" />
            {products.map((p) => (
              <Picker.Item key={p.id} label={p.name} value={p.id} />
            ))}
          </Picker>
        </View>

        {/* Transaction Amount */}
        <Text style={styles.label}>Transaction Amount (₹)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Date Picker */}
        <Text style={styles.label}>Transaction Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selected) => {
              setShowDatePicker(false);
              if (selected) setDate(selected);
            }}
          />
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? "Submitting..." : "Submit Sale"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddSaleScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
    flexGrow: 1,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e51c4b",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    overflow: "hidden",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    elevation: 2,
  },
  dateButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  submitBtn: {
    backgroundColor: "#e51c4b",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
