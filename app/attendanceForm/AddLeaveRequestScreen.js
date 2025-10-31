import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { createLeaveRequest } from "../../api/realApi";

const AddLeaveRequestScreen = () => {
  const [leaveType, setLeaveType] = useState("Unplanned");
  const [isFullDay, setIsFullDay] = useState(true);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Calculate number of days
  const numberOfDays = Math.max(
    1,
    Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1
  );

  // ✅ Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "Please login again");
        return;
      }

      const payload = {
        leaveType,
        isFullDay,
        fromDate: fromDate.toISOString().split("T")[0],
        toDate: toDate.toISOString().split("T")[0],
        numberOfDays,
      };

      await createLeaveRequest(token, payload);
      Alert.alert("Success", "Leave request submitted successfully!");
      router.back();
    } catch (error) {
      console.error("Leave Request Error:", error.message);
      Alert.alert("Error", error.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>New Leave Request</Text>

      {/* Leave Type */}
      <Text style={styles.label}>Leave Type</Text>
      <View style={styles.optionGroup}>
        {["Sick", "Planned", "Unplanned"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.optionButton,
              leaveType === type && styles.optionSelected,
            ]}
            onPress={() => setLeaveType(type)}
          >
            <Text
              style={[
                styles.optionText,
                leaveType === type && styles.optionTextSelected,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Duration */}
      <Text style={styles.label}>Duration</Text>
      <View style={styles.optionGroup}>
        <TouchableOpacity
          style={[styles.optionButton, isFullDay && styles.optionSelected]}
          onPress={() => setIsFullDay(true)}
        >
          <Text
            style={[
              styles.optionText,
              isFullDay && styles.optionTextSelected,
            ]}
          >
            Full Day
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, !isFullDay && styles.optionSelected]}
          onPress={() => setIsFullDay(false)}
        >
          <Text
            style={[
              styles.optionText,
              !isFullDay && styles.optionTextSelected,
            ]}
          >
            Half Day
          </Text>
        </TouchableOpacity>
      </View>

      {/* From Date */}
      <Text style={styles.label}>From Date</Text>
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setShowFromPicker(true)}
      >
        <Ionicons name="calendar-outline" size={20} color="#e51c4b" />
        <Text style={styles.dateText}>
          {fromDate.toISOString().split("T")[0]}
        </Text>
      </TouchableOpacity>
      {showFromPicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowFromPicker(false);
            if (date) setFromDate(date);
          }}
        />
      )}

      {/* To Date */}
      <Text style={styles.label}>To Date</Text>
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setShowToPicker(true)}
      >
        <Ionicons name="calendar-outline" size={20} color="#e51c4b" />
        <Text style={styles.dateText}>{toDate.toISOString().split("T")[0]}</Text>
      </TouchableOpacity>
      {showToPicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowToPicker(false);
            if (date) setToDate(date);
          }}
        />
      )}

      {/* Number of Days */}
      <View style={styles.daysContainer}>
        <Text style={styles.daysLabel}>Total Days:</Text>
        <Text style={styles.daysValue}>{numberOfDays}</Text>
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
          <Text style={styles.submitText}>Submit Leave Request</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddLeaveRequestScreen;

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e51c4b",
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginTop: 10,
    marginBottom: 6,
  },
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: "#f4f4f4",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: "#e51c4b",
  },
  optionText: {
    fontSize: 14,
    color: "#444",
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  daysLabel: { fontSize: 15, color: "#444", fontWeight: "600" },
  daysValue: { fontSize: 16, fontWeight: "700", color: "#e51c4b" },
  submitBtn: {
    backgroundColor: "#e51c4b",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
