import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getMyAttendanceMonth, getMyLeaveRequests } from "../../../api/realApi";

const AttendanceScreen = () => {
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const router = useRouter();

    // ✅ Fetch attendance and leave data for selected month
    const loadData = async (monthDate) => {
        try {
            const token = await AsyncStorage.getItem("accessToken");
            const from = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
            const to = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
            const [att, leave] = await Promise.all([
                getMyAttendanceMonth(token, from, to),
                getMyLeaveRequests(token),
            ]);
            setAttendance(att || []);
            setLeaves(leave || []);
        } catch (error) {
            console.log("Error loading attendance:", error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData(selectedMonth);
    }, [selectedMonth]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadData(selectedMonth);
    };

    // ✅ Convert 24-hour string (HH:mm:ss) → 12-hour AM/PM
    const to12Hour = (timeStr) => {
        if (!timeStr) return "-";
        const [hourStr, minuteStr] = timeStr.split(":");
        let hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.header}>Attendance</Text>

                <TouchableOpacity
                    onPress={() => setShowMonthPicker(!showMonthPicker)}
                    style={styles.monthPickerBtn}
                >
                    <Ionicons name="calendar-outline" size={18} color="#e51c4b" />
                    <Text style={styles.monthText}>
                        {selectedMonth.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ✅ Custom Month-Year Dropdown (works in Expo Go) */}
            {showMonthPicker && (
                <View style={styles.monthDropdownContainer}>
                    <View style={styles.monthDropdown}>
                        {[...Array(12)].map((_, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.monthOption}
                                onPress={() => {
                                    const newDate = new Date(selectedMonth);
                                    newDate.setMonth(i);
                                    setSelectedMonth(newDate);
                                    setShowMonthPicker(false);
                                }}
                            >
                                <Text style={styles.monthOptionText}>
                                    {new Date(2000, i, 1).toLocaleString("default", {
                                        month: "long",
                                    })}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.yearDropdown}>
                        {[2023, 2024, 2025, 2026, 2027].map((year) => (
                            <TouchableOpacity
                                key={year}
                                style={styles.yearOption}
                                onPress={() => {
                                    const newDate = new Date(selectedMonth);
                                    newDate.setFullYear(year);
                                    setSelectedMonth(newDate);
                                    setShowMonthPicker(false);
                                }}
                            >
                                <Text style={styles.yearOptionText}>{year}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {loading ? (
                <ActivityIndicator color="#e51c4b" size="large" style={{ marginTop: 40 }} />
            ) : (
                <>
                    {/* ✅ Attendance List */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>
                            Attendance ({selectedMonth.toLocaleString("default", {
                                month: "short",
                            })})
                        </Text>

                        {attendance.length === 0 ? (
                            <Text style={styles.noData}>No attendance records</Text>
                        ) : (
                            <>
                                {attendance.map((a) => {
                                    const totalHours = a.totalHoursWorked
                                        ? parseFloat(a.totalHoursWorked)
                                        : 0;

                                    let status = "Absent";
                                    let color = "#F44336";
                                    if (totalHours >= 9) {
                                        status = "Full Day";
                                        color = "#4CAF50";
                                    } else if (totalHours >= 4) {
                                        status = "Half Day";
                                        color = "#FFA000";
                                    }

                                    return (
                                        <View key={a.id} style={styles.attRow}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.attDate}>
                                                    {new Date(a.date).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                    })}
                                                </Text>
                                                <Text style={styles.attStatus}>
                                                    Check-In: {to12Hour(a.checkInTime)}
                                                </Text>
                                                <Text style={styles.attStatus}>
                                                    Check-Out: {to12Hour(a.checkOutTime)}
                                                </Text>
                                                <Text style={styles.attStatus}>
                                                    Hours Worked:{" "}
                                                    {totalHours ? totalHours.toFixed(1) : "0.0"} hrs
                                                </Text>
                                                <Text style={[styles.dayStatus, { color }]}>{status}</Text>
                                            </View>

                                            <Ionicons
                                                name={
                                                    status === "Full Day"
                                                        ? "checkmark-circle-outline"
                                                        : status === "Half Day"
                                                            ? "time-outline"
                                                            : "close-circle-outline"
                                                }
                                                size={24}
                                                color={color}
                                                style={{ alignSelf: "center" }}
                                            />
                                        </View>
                                    );
                                })}

                                {/* ✅ Monthly Summary */}
                                {(() => {
                                    let full = 0,
                                        half = 0,
                                        absent = 0,
                                        totalHrs = 0;
                                    attendance.forEach((a) => {
                                        const hours = a.totalHoursWorked
                                            ? parseFloat(a.totalHoursWorked)
                                            : 0;
                                        totalHrs += hours;
                                        if (hours >= 9) full++;
                                        else if (hours >= 4) half++;
                                        else absent++;
                                    });

                                    return (
                                        <View style={styles.summaryCard}>
                                            <Text style={styles.summaryHeader}>Monthly Summary</Text>
                                            <View style={styles.summaryRow}>
                                                <Text style={styles.summaryLabel}>Full Days</Text>
                                                <Text
                                                    style={[styles.summaryValue, { color: "#4CAF50" }]}
                                                >
                                                    {full}
                                                </Text>
                                            </View>
                                            <View style={styles.summaryRow}>
                                                <Text style={styles.summaryLabel}>Half Days</Text>
                                                <Text
                                                    style={[styles.summaryValue, { color: "#FFA000" }]}
                                                >
                                                    {half}
                                                </Text>
                                            </View>
                                            <View style={styles.summaryRow}>
                                                <Text style={styles.summaryLabel}>Absents</Text>
                                                <Text
                                                    style={[styles.summaryValue, { color: "#F44336" }]}
                                                >
                                                    {absent}
                                                </Text>
                                            </View>
                                            <View style={styles.summaryRow}>
                                                <Text style={styles.summaryLabel}>Total Hours</Text>
                                                <Text
                                                    style={[styles.summaryValue, { color: "#1976D2" }]}
                                                >
                                                    {totalHrs.toFixed(1)} hrs
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })()}
                            </>
                        )}
                    </View>

                    {/* ✅ Leave Requests Section */}
                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Leave Requests</Text>
                            <TouchableOpacity
                                onPress={() => router.push("/attendanceForm/AddLeaveRequestScreen")}
                            >
                                <Ionicons name="add-circle-outline" size={24} color="#e51c4b" />
                            </TouchableOpacity>
                        </View>

                        {leaves.length === 0 ? (
                            <Text style={styles.noData}>No leave requests</Text>
                        ) : (
                            leaves.map((l) => {
                                const statusColor =
                                    l.status === "Approved"
                                        ? "#4CAF50"
                                        : l.status === "Pending"
                                            ? "#FFA000"
                                            : "#F44336";

                                const bgColor =
                                    l.status === "Approved"
                                        ? "rgba(76, 175, 80, 0.15)"
                                        : l.status === "Pending"
                                            ? "rgba(255, 160, 0, 0.15)"
                                            : "rgba(244, 67, 54, 0.15)";

                                return (
                                    <View key={l.id} style={[styles.leaveRow, { backgroundColor: "#fafafa" }]}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.leaveDate}>
                                                {new Date(l.fromDate).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                })}{" "}
                                                -{" "}
                                                {new Date(l.toDate).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                })}{" "}
                                                ({l.numberOfDays} {l.numberOfDays > 1 ? "days" : "day"})
                                            </Text>

                                            <Text style={styles.leaveDetail}>
                                                Type: <Text style={{ fontWeight: "600" }}>{l.leaveType}</Text>
                                            </Text>

                                            <Text style={styles.leaveDetail}>
                                                Duration:{" "}
                                                {l.isFullDay ? (
                                                    <Text style={{ fontWeight: "600" }}>Full Day</Text>
                                                ) : (
                                                    <Text style={{ fontWeight: "600" }}>Half Day</Text>
                                                )}
                                            </Text>
                                        </View>

                                        {/* ✅ Status Badge */}
                                        <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
                                            <Text style={[styles.statusText, { color: statusColor }]}>
                                                {l.status}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </View>
                </>
            )}
        </ScrollView>
    );
};

export default AttendanceScreen;

// ---------- Styles ----------
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
        marginBottom: 12,
    },
    header: {
        fontSize: 22,
        fontWeight: "700",
        color: "#e51c4b",
    },
    monthPickerBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        elevation: 2,
    },
    monthText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    monthDropdownContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        elevation: 3,
        marginBottom: 15,
    },
    monthDropdown: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    monthOption: {
        width: "30%",
        paddingVertical: 8,
        alignItems: "center",
        borderRadius: 6,
        marginVertical: 4,
        backgroundColor: "#f9f9f9",
    },
    monthOptionText: { color: "#333", fontSize: 14 },
    yearDropdown: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    yearOption: {
        backgroundColor: "#f9f9f9",
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    yearOptionText: { fontSize: 15, color: "#333", fontWeight: "600" },
    sectionCard: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        marginBottom: 20,
        elevation: 2,
    },
    sectionHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between", // ✅ keeps title left & button right
        alignItems: "center",            // ✅ vertically centers both
        marginBottom: 10,
    },
    sectionTitle: { fontSize: 17, fontWeight: "700", color: "#333", marginBottom: 6 },
    attRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        borderColor: "#eee",
        paddingVertical: 8,
    },
    attDate: { fontSize: 15, fontWeight: "600", color: "#222" },
    attStatus: { fontSize: 13, color: "#666" },
    dayStatus: { marginTop: 3, fontWeight: "700", fontSize: 13 },
    summaryCard: {
        marginTop: 15,
        backgroundColor: "#f4f6f8",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    summaryHeader: {
        fontSize: 16,
        fontWeight: "700",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    summaryLabel: { fontSize: 14, color: "#555" },
    summaryValue: { fontSize: 15, fontWeight: "700" },
    leaveRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderColor: "#eee",
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 8,
        marginBottom: 8,
        elevation: 1,
    },
    leaveDate: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    leaveDetail: {
        fontSize: 13,
        color: "#666",
        marginTop: 2,
    },
    statusBadge: {
        alignSelf: "center",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
        minWidth: 85,
        alignItems: "center",
        justifyContent: "center",
    },
    statusText: {
        fontWeight: "700",
        fontSize: 12,
        textTransform: "uppercase",
    },
    noData: { textAlign: "center", color: "#888", marginTop: 8 },
});
