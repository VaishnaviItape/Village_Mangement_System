import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createExpense } from "../../api/realApi";

const AddExpenseScreen = () => {
  const router = useRouter();

  const [expenseType, setExpenseType] = useState("Travel"); // Travel | Food | Other
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return false;
    }
    if (!expenseType) {
      Alert.alert("Missing Type", "Please select an expense type.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Session expired", "Please login again.");
        return;
      }

      // Backend expects: ExpenseType enum (Travel/Food/Other), Amount (decimal), Description, ExpenseDate (date)
      const payload = {
        expenseType, // "Travel" | "Food" | "Other" -> maps to enum in service
        amount: Number(amount),
        description,
        expenseDate: expenseDate.toISOString().split("T")[0],
      };

      await createExpense(token, payload);
      Alert.alert("Success", "Expense submitted!");
      router.back();
    } catch (err) {
      console.error("Create Expense Error:", err.message);
      Alert.alert("Error", err.message || "Failed to submit expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1, backgroundColor: "#f9fafb" }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Add Expense</Text>

        {/* Expense Type */}
        <Text style={styles.label}>Expense Type</Text>
        <View style={styles.pillGroup}>
          {["Travel", "Food", "Other"].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.pill, expenseType === t && styles.pillActive]}
              onPress={() => setExpenseType(t)}
            >
              <Text
                style={[
                  styles.pillText,
                  expenseType === t && styles.pillTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount */}
        <Text style={styles.label}>Amount (₹)</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="cash-outline" size={18} color="#e51c4b" />
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            style={styles.input}
          />
        </View>

        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.inputWrap}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={18} color="#e51c4b" />
          <Text style={styles.valueText}>
            {expenseDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={expenseDate}
            mode="date"
            display="default"
            onChange={(e, d) => {
              setShowDatePicker(false);
              if (d) setExpenseDate(d);
            }}
          />
        )}

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <View style={[styles.inputWrap, { alignItems: "flex-start" }]}>
          <Ionicons
            name="document-text-outline"
            size={18}
            color="#e51c4b"
            style={{ marginTop: 10 }}
          />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add a note (optional)"
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Expense</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f9fafb",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e51c4b",
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginTop: 12,
    marginBottom: 6,
  },
  pillGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  pillActive: {
    backgroundColor: "#e51c4b",
  },
  pillText: {
    color: "#333",
    fontSize: 13,
    fontWeight: "600",
  },
  pillTextActive: {
    color: "#fff",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#333",
  },
  valueText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: "#e51c4b",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
