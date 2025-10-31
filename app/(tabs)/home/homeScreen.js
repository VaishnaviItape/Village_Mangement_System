import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { BarChart, ProgressChart } from "react-native-chart-kit";
import {
  checkInAttendance,
  checkOutAttendance,
  getActivities,
  getCurrentUser,
  getDashboard,
  getMyAttendance,
} from "../../../api/realApi";
import {
  getLocationPermissionStatus,
  isTrackingActive,
  requestLocationPermissions,
  startBackgroundTracking,
  stopBackgroundTracking,
} from "../../../utils/backgroundTracking";
import { formatServerTime } from "../../../utils/timeFormatter";
const TrackingIndicator = ({ active }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.3,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scale.setValue(1);
    }
  }, [active]);

  return (
    <Animated.View
      style={{
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: active ? "#22c55e" : "#9ca3af", // green vs gray
        transform: [{ scale }],
        marginLeft: 8,
      }}
    />
  );
};

const screenWidth = Dimensions.get("window").width;

// -------- Util helpers --------
const todayKey = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `attendance:${yyyy}-${mm}-${dd}`;
};
const formatTime = (date = new Date()) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const HomeScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [activities, setActivities] = useState([]);

  // Attendance local state
  // status: 'none' | 'checkedIn' | 'checkedOut'
  const [attStatus, setAttStatus] = useState("none");
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const [trackingStatus, setTrackingStatus] = useState("checking"); // checking | active | idle | off
  const [locationPermission, setLocationPermission] = useState({ granted: false });

  // Report tab state
  const [reportTab, setReportTab] = useState("Week"); // Week | Month | Year

  // -------- Data fetchers --------
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return;
        const [me, dash, activities] = await Promise.all([getCurrentUser(token), getDashboard(token), getActivities(token)]);
        setUser(me);
        setDashboard(dash);
        setActivities(activities);
      } catch (e) {
        console.log("init load error:", e?.message);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const active = await isTrackingActive();
      setTrackingStatus(active ? "active" : "off");
    }, 120000); // 2 min
    return () => clearInterval(interval);
  }, []);

  // Hydrate attendance on screen focus and do daily reset automatically
  useFocusEffect(
    useCallback(() => {
      const hydrate = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return;

        const key = todayKey();
        const cached = await AsyncStorage.getItem(key);
        // If there is any stale key from previous dates, clean them (optional light sweep)
        // We only rely on today key; old ones are harmless.

        try {
          const server = await getMyAttendance(token); // server is source of truth (today only or latest)
          // If API returns today's record, align state
          if (server?.date) {
            const isToday = key.endsWith(server.date);
            if (isToday) {
              const next = {
                status: server.checkOutTime
                  ? "checkedOut"
                  : server.checkInTime
                  ? "checkedIn"
                  : "none",
                checkInTime: server.checkInTime ?? null,
                checkOutTime: server.checkOutTime ?? null,
              };
              await AsyncStorage.setItem(key, JSON.stringify(next));
              setAttStatus(next.status);
              setCheckInTime(formatServerTime(next.checkInTime));
              setCheckOutTime(formatServerTime(next.checkOutTime));
              return;
            }
          }
        } catch (err) {
          console.log("getMyAttendance failed, falling back to cache:", err?.message);
        }

        // Fallback to local cache (or reset if none)
        if (cached) {
          try {
            const obj = JSON.parse(cached);
            setAttStatus(obj.status ?? "none");
            setCheckInTime(formatServerTime(obj.checkInTime ?? null));
            setCheckOutTime(formatServerTime(obj.checkOutTime ?? null));
          } catch {
            await AsyncStorage.removeItem(key);
            setAttStatus("none");
            setCheckInTime(null);
            setCheckOutTime(null);
          }
        } else {
          // daily reset – start fresh
          setAttStatus("none");
          setCheckInTime(null);
          setCheckOutTime(null);
        }
      };

      const checkTrackingAndPerms = async () => {
        const active = await isTrackingActive();
        const perms = await getLocationPermissionStatus();
        setTrackingStatus(active ? "active" : "off");
        setLocationPermission(perms);
      };

      hydrate();
      checkTrackingAndPerms();
    }, [])
  );

  // -------- UI datasets (from dashboard or message fallback) --------
  const progressData = useMemo(() => {
    if (!dashboard || !dashboard.progressData) return null;
    return dashboard.progressData;
  }, [dashboard]);

  // -------- Report dataset --------
  const reportData = useMemo(() => {
    if (!dashboard || !dashboard.reportData) return null;
    return dashboard.reportData;
  }, [dashboard]);

  // -------- Attendance handlers --------
  const persistAttendance = async (next) => {
    await AsyncStorage.setItem(todayKey(), JSON.stringify(next));
    setAttStatus(next.status);
    setCheckInTime(next.checkInTime ?? null);
    setCheckOutTime(next.checkOutTime ?? null);
  };

  const handleCheckIn = async () => {
    if (attStatus !== "none") return;
    setLoadingAttendance(true);
    const optimistic = { status: "checkedIn", checkInTime: formatTime(), checkOutTime: null };
    await persistAttendance(optimistic);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const result = await checkInAttendance({}, token);

      // Store current attendance ID for tracking
      if (result?.id) {
        await AsyncStorage.setItem("currentAttendanceId", result.id);
        console.log("Saved attendanceId:", result.id);
      }

      // Start GPS tracking
      await startBackgroundTracking();

      setTrackingStatus("active");

      // Re-fetch to ensure server alignment (idempotent)
      const server = await getMyAttendance(token);
      if (server?.checkInTime) {
        await persistAttendance({
          status: server.checkOutTime ? "checkedOut" : "checkedIn",
          checkInTime: server.checkInTime,
          checkOutTime: server.checkOutTime ?? null,
        });

        // Also ensure latest attendanceId is persisted
        if (server?.id) {
          await AsyncStorage.setItem("currentAttendanceId", server.id);
        }
      }
    } catch (e) {
      // rollback
      await persistAttendance({ status: "none", checkInTime: null, checkOutTime: null });
      await AsyncStorage.removeItem("currentAttendanceId");
      Alert.alert("Check-In Failed", e?.message || "Please try again.");
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleCheckOut = async () => {
    if (attStatus !== "checkedIn") return;
    setLoadingAttendance(true);
    const optimistic = { status: "checkedOut", checkInTime, checkOutTime: formatTime() };
    await persistAttendance(optimistic);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      await checkOutAttendance({}, token);

      // ✅ Stop background tracking and force last upload
      await stopBackgroundTracking();

      setTrackingStatus("off");

      // ✅ Clear stored attendanceId
      await AsyncStorage.removeItem("currentAttendanceId");

      const server = await getMyAttendance(token);
      if (server?.checkOutTime) {
        await persistAttendance({
          status: "checkedOut",
          checkInTime: server.checkInTime ?? checkInTime,
          checkOutTime: server.checkOutTime,
        });
      }
    } catch (e) {
      Alert.alert("Check-Out Failed", e?.message || "Please try again.");
    } finally {
      setLoadingAttendance(false);
    }
  };

  // -------- Render --------
  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/confirmDetail/confirmDetailScreen")}>
          <Image
            source={require("../../../assets/images/users/user.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeName}>Hi, {user?.fullName || "Guest"} 👋</Text>
          <Text style={styles.roleText}>{user?.roles ? user.roles[0] : ""}</Text>
        </View>
        <Ionicons name="notifications-outline" size={26} color="#e51c4b" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18 }}>
        {attendanceSection()}
        {trackingSection()}
        {quickActions()}
        {targetChart()}
        {reportSection()}
        {recentActivity()}
      </ScrollView>
    </View>
  );

  // -------- Sections --------
  function attendanceSection() {
    return (
      <LinearGradient
        colors={["#1E90FF", "#007AFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.attendanceBar}
      >
        {/* Left: Check-In */}
        <TouchableOpacity
          style={styles.attendanceHalf}
          disabled={attStatus !== "none" || loadingAttendance}
          onPress={handleCheckIn}
        >
          <Ionicons
            name="arrow-down"
            size={20}
            color={attStatus === "checkedIn" || attStatus === "checkedOut" ? "#fff" : "#00FF88"}
          />
          <View style={{ marginLeft: 6 }}>
            {checkInTime ? (
              <>
                <Text style={styles.checkLabel}>Checked-In At</Text>
                <Text style={styles.checkTime}>{formatServerTime(checkInTime)}</Text>
              </>
            ) : (
              <Text style={styles.checkLabel}>Check-In</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.attendanceDivider} />

        {/* Right: Check-Out */}
        <TouchableOpacity
          style={styles.attendanceHalf}
          disabled={attStatus !== "checkedIn" || loadingAttendance}
          onPress={handleCheckOut}
        >
          <Ionicons
            name="arrow-up"
            size={20}
            color={attStatus === "checkedOut" ? "#fff" : "#FF7058"}
          />
          <View style={{ marginLeft: 6 }}>
            {checkOutTime ? (
              <>
                <Text style={styles.checkLabel}>Checked-Out At</Text>
                <Text style={styles.checkTime}>{formatServerTime(checkOutTime)}</Text>
              </>
            ) : (
              <Text style={styles.checkLabel}>Check-Out</Text>
            )}
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  function trackingSection() {
    return (
      <View style={{ alignItems: "center", marginBottom: 15 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TrackingIndicator active={trackingStatus === "active"} />
          <Text
            style={{
              fontSize: 13,
              marginLeft: 6,
              color: trackingStatus === "active" ? "green" : "gray",
            }}
          >
            {trackingStatus === "checking"
              ? "Checking tracking status..."
              : trackingStatus === "active"
              ? "📍 Location tracking in progress"
              : "⚠️ Location tracking is OFF"}
          </Text>
        </View>
        {!locationPermission.granted && (
          <TouchableOpacity
            style={{
              marginTop: 8,
              backgroundColor: "#e51c4b",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
            onPress={async () => {
              const res = await requestLocationPermissions();
              setLocationPermission(res);
              Alert.alert(
                res.granted ? "Permissions Enabled" : "Permissions Missing",
                res.granted
                  ? "Background location tracking is now enabled."
                  : "Please enable location permissions from settings."
              );
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Enable Location Permission
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function quickActions() {
    const router = useRouter();

    const actions = [
      { id: 1, icon: "person-add-outline", label: "Add Lead", route: "/leads/AddLeadScreen" },
      { id: 2, icon: "cart-outline", label: "Add Sales", route: "/salesForm/AddSaleScreen" },
      { id: 3, icon: "people-outline", label: "Site Attendance", route: "/attendance/AttendanceScreen" },
      { id: 4, icon: "cash-outline", label: "Submit Expense", route: "/expencesForm/AddExpenseScreen" },
    ];

    return (
      <View style={{ marginTop: 25 }}>
        <Text style={styles.sectionHeader}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {actions.map((a) => (
            <TouchableOpacity
              key={a.id}
              style={styles.quickItem}
              onPress={() => {
                if (a.route) router.push(a.route);
                else Alert.alert("Coming soon", `${a.label} feature not implemented yet.`);
              }}
            >
              <Ionicons name={a.icon} size={28} color="#e51c4b" />
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function targetChart() {
    if (!progressData) {
      return (
        <View style={styles.chartCard}>
          <Text style={styles.sectionHeader}>Target vs Achievement</Text>
          <Text style={styles.noDataText}>Unable to fetch dashboard data</Text>
        </View>
      );
    }

    const total = Number(dashboard?.targetTotal ?? 0);
    const completed = Number(dashboard?.targetCompleted ?? 0);
    const remaining = Number(dashboard?.remaining ?? 0);

    // ✅ Calculate percentage safely
    let percentage = 0;
    if (total > 0) {
      percentage = ((completed / total) * 100).toFixed(1);
    }

    return (
      <View style={styles.chartCard}>
        <Text style={styles.sectionHeader}>Target vs Achievement</Text>
        <ProgressChart
          data={progressData}
          width={screenWidth - 60}
          height={200}
          strokeWidth={12}
          radius={70}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1, index) =>
              index === 0
                ? `rgba(229, 28, 75, ${opacity})`
                : `rgba(200,200,200,${opacity})`,
          }}
          hideLegend
        />
        {/* ✅ Add these values below the chart */}
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#e51c4b" }}>
            {percentage}% Achieved
          </Text>
          <Text style={{ fontSize: 14, color: "#555", marginTop: 4 }}>
            ₹{completed.toLocaleString()} / ₹{total.toLocaleString()}
          </Text>
          <Text style={{ fontSize: 13, color: "#777", marginTop: 2 }}>
            Remaining: ₹{remaining.toLocaleString()}
          </Text>
        </View>
        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#e51c4b" }]} />
            <Text>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#ccc" }]} />
            <Text>Remaining</Text>
          </View>
        </View>
      </View>
    );
  }

  function reportSection() {
    if (!reportData) {
      return (
        <View style={styles.chartCard}>
          <View style={styles.reportHeader}>
            <Text style={styles.sectionHeader}>Reports</Text>
          </View>
          <Text style={styles.noDataText}>Unable to fetch report data</Text>
        </View>
      );
    }

    // ✅ Normalize keys for case-insensitive access
    const normalizedReport = {};
    for (const key in reportData) {
      normalizedReport[key.toLowerCase()] = reportData[key];
    }

    const activeKey = reportTab.toLowerCase();

    const data = {
      labels: reportData.labels || [],
      datasets: [
        {
          data:
            Array.isArray(normalizedReport[activeKey]) 
              ? normalizedReport[activeKey] 
              : [],
        },
      ],
    };

    return (
      <View style={styles.chartCard}>
        <View style={styles.reportHeader}>
          <Text style={styles.sectionHeader}>Reports</Text>
          <View style={styles.tabsRow}>
            {["Week", "Month", "Year"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setReportTab(tab)}
                style={[styles.tabBtn, reportTab === tab && styles.tabBtnActive]}
              >
                <Text
                  style={[styles.tabText, reportTab === tab && styles.tabTextActive]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {data.datasets[0].data.length === 0 ? (
          <Text style={styles.noDataText}>No data available for {reportTab}</Text>
        ) : (
          <BarChart
            data={data}
            width={screenWidth - 60}
            height={220}
            fromZero
            yAxisSuffix=""
            yAxisInterval={1} // keep 1:1 segment spacing
            segments={5}      // ✅ 5 segments (0 → 500000)
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(229, 28, 75, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 0.6,
              decimalPlaces: 0,
              // ✅ Custom Y-axis label formatter
              formatYLabel: (y) => {
                const num = Number(y);
                if (num === 0) return "0";
                return num.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                });
              },
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        )}
      </View>
    );
  }

  function recentActivity() {
    return (
      <View style={{ marginTop: 20, marginBottom: 80 }}>
        <View style={styles.recentHeader}>
          <Text style={styles.sectionHeader}>Recent Activity</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        {!activities ? (
          <Text style={styles.noDataText}>Unable to fetch activity data</Text>
        ) : activities.length === 0 ? (
          <Text style={styles.noDataText}>No recent activities</Text>
        ) : (
          activities.map((a) => (
            <View key={a.id} style={styles.activityCard}>
              <Image source={{ uri: a.image }} style={styles.avatarSmall} />
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{a.title}</Text>
                <Text style={styles.activitySubtitle}>{a.subtitle}</Text>
              </View>
              <Text style={styles.time}>{a.time}</Text>
            </View>
          ))
        )}
      </View>
    );
  }
};

export default HomeScreen;

// -------- Styles --------
const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 4,
    paddingBottom: 10,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  welcomeName: { fontSize: 20, fontWeight: "700", color: "#222" },
  roleText: { fontSize: 14, color: "#666" },

  attendanceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  attendanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  attBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeBtn: { backgroundColor: "#e51c4b" },
  disabledBtn: { backgroundColor: "#ddd" },
  attBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  timeText: {
    textAlign: "center",
    marginTop: 8,
    color: "#555",
    fontSize: 13,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickItem: {
    width: "47%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
  },
  quickLabel: { marginTop: 8, fontWeight: "600", color: "#333" },

  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginTop: 25,
    elevation: 2,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 10 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },

  reportHeader: { flexDirection: "row", justifyContent: "space-between" },
  tabsRow: { flexDirection: "row" },
  tabBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 6,
    backgroundColor: "#eee",
  },
  tabBtnActive: { backgroundColor: "#e51c4b" },
  tabText: { color: "#444", fontWeight: "600" },
  tabTextActive: { color: "#fff" },

  recentHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  activityTitle: { fontWeight: "600", color: "#222" },
  activitySubtitle: { color: "#777", fontSize: 13 },
  time: { fontSize: 12, color: "#aaa" },
  seeAll: { color: "#e51c4b", fontWeight: "600" },

  attendanceBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  attendanceHalf: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  attendanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  checkLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  checkTime: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },  
});
