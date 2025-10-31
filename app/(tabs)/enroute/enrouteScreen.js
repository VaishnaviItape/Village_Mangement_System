// ReportsScreen.js
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

const propertyLabels = [
  "Sunrise\nApartment",
  "Matoshree\nApartment",
  "Infinity\ngirls pg",
  "B213",
  "A103"
];

const barDataMonth = {
  labels: propertyLabels,
  datasets: [
    {
      data: [75, 90, 60, 80, 85], // default Month % values
      colors: [
        () => "#e63946",
        () => "#e63946",
        () => "#e63946",
        () => "#e63946",
        () => "#e63946"
      ]
    }
  ]
};

const lineChartData = {
  labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"],
  datasets: [
    {
      data: [5000, 12000, 17000, 9000, 11000, 14000, 13000],
      strokeWidth: 2,
      color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`
    }
  ]
};

const expenseData = [
  { name: 'Maintenance', amount: 14000, color: '#8676FF' },
  { name: 'Security', amount: 11000, color: '#FF5E5E' },
  { name: 'Utilities', amount: 500, color: '#03CEA4' },
  { name: 'Cleaning', amount: 2000, color: '#FFD600' },
  { name: 'Others', amount: 700, color: '#F15BB5' },
];

const totalExpenses = expenseData.reduce((sum, d) => sum + d.amount, 0);

const chartConfigLine = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: { r: "4", strokeWidth: "2", stroke: "#1e90ff" },
  decimalPlaces: 0
};

const chartConfigBar = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
  decimalPlaces: 0,
  barPercentage: 0.6,
  propsForBackgroundLines: { stroke: "#f0f0f0" }
};

const chartConfigPie = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
  decimalPlaces: 0
};

const screenWidth = Dimensions.get("window").width - 32;

const ReportsScreen = () => {
  const [activeTab, setActiveTab] = useState("Rent"); // Rent, Occupancy, Expenses
  const [occupancyToggle, setOccupancyToggle] = useState("Month"); // Month or Year

  const occupancyData = {
    labels: propertyLabels,
    datasets: [
      {
        data: occupancyToggle === "Month"
          ? [75, 90, 60, 80, 85]
          : [5000, 12000, 17000, 9000, 11000],
        colors: [
          () => "#e63946",
          () => "#e63946",
          () => "#e63946",
          () => "#e63946",
          () => "#e63946"
        ]
      }
    ]
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Reports</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={activeTab === "Rent" ? styles.activeTab : styles.tab}
          onPress={() => setActiveTab("Rent")}
        >
          <Text style={activeTab === "Rent" ? styles.activeTabText : styles.tabText}>Rent Collection</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={activeTab === "Occupancy" ? styles.activeTab : styles.tab}
          onPress={() => setActiveTab("Occupancy")}
        >
          <Text style={activeTab === "Occupancy" ? styles.activeTabText : styles.tabText}>Occupancy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={activeTab === "Expenses" ? styles.activeTab : styles.tab}
          onPress={() => setActiveTab("Expenses")}
        >
          <Text style={activeTab === "Expenses" ? styles.activeTabText : styles.tabText}>Expenses</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Chart */}
      {activeTab === "Rent" && (
        <>
          <Text style={styles.chartTitle}>Monthly Rent Collection</Text>
          <LineChart
            data={lineChartData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfigLine}
            style={styles.chartStyle}
          />
        </>
      )}

      {activeTab === "Occupancy" && (
        <>
          {/* Occupancy Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={occupancyToggle === "Month" ? styles.toggleActive : styles.toggle}
              onPress={() => setOccupancyToggle("Month")}
            >
              <Text style={occupancyToggle === "Month" ? styles.toggleActiveText : styles.toggleText}>Month</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={occupancyToggle === "Year" ? styles.toggleActive : styles.toggle}
              onPress={() => setOccupancyToggle("Year")}
            >
              <Text style={occupancyToggle === "Year" ? styles.toggleActiveText : styles.toggleText}>Year</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.chartTitle}>Property-wise Rent Collected</Text>
          <BarChart
            data={occupancyData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfigBar}
            withCustomBarColorFromData={true}
            flatColor={true}
            showBarTops={false}
            style={styles.chartStyle}
            fromZero
            formatYLabel={(yValue) => occupancyToggle === "Month" ? `${yValue}%` : `${yValue / 1000}k`}
          />
        </>
      )}

      {activeTab === "Expenses" && (
        <>
          <Text style={styles.chartTitle}>Monthly Expenses Breakdown</Text>
          <PieChart
            data={expenseData.map(d => ({ ...d, population: d.amount }))}
            width={screenWidth}
            height={220}
            chartConfig={chartConfigPie}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft={30}
            absolute
          />

          {/* Legend & Values */}
          <View style={{ marginTop: 18, marginLeft: 6 }}>
            {expenseData.map(item => (
              <View style={styles.legendRow} key={item.name}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.name}</Text>
                <Text style={styles.legendAmt}>₹{item.amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Expenses</Text>
            <Text style={styles.totalAmt}>₹{totalExpenses.toLocaleString()}</Text>
          </View>
        </>
      )}

      {/* Info Cards */}
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Total Rent Collected</Text>
          <Text style={styles.rentAmount}>₹ 1,20,000</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Total Expenses</Text>
          <Text style={styles.expenseAmount}>₹ 20,000</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Net Balance</Text>
          <Text style={styles.netAmount}>₹ 1,00,000</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Occupancy Rate</Text>
          <Text style={styles.occupancyRate}>83%</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff", paddingTop: 50 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  tabs: { flexDirection: "row", marginBottom: 20, justifyContent: "space-between" },
  tab: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: "#f0f0f0" },
  activeTab: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: "#1e90ff" },
  tabText: { color: "#333" },
  activeTabText: { color: "#fff" },
  chartTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  chartStyle: { borderRadius: 10, marginBottom: 20 },
  infoContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  infoBox: { width: "48%", backgroundColor: "#f9f9f9", padding: 15, borderRadius: 10, marginBottom: 15 },
  infoTitle: { fontSize: 14, color: "#666", marginBottom: 5 },
  rentAmount: { color: "#ff8c00", fontWeight: "bold", fontSize: 16 },
  expenseAmount: { color: "#ff4500", fontWeight: "bold", fontSize: 16 },
  netAmount: { color: "#228b22", fontWeight: "bold", fontSize: 16 },
  occupancyRate: { color: "#6a5acd", fontWeight: "bold", fontSize: 16 },
  toggleContainer: {
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    borderRadius: 16,
    width: 170,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  toggle: { flex: 1, paddingVertical: 6, alignItems: "center", borderRadius: 16 },
  toggleActive: { flex: 1, paddingVertical: 6, alignItems: "center", backgroundColor: "#fff", borderRadius: 16 },
  toggleText: { color: "#999", fontWeight: "500" },
  toggleActiveText: { color: "#e63946", fontWeight: "700" },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 8 },
  legendText: { flex: 1, fontSize: 15, color: '#444' },
  legendAmt: { fontWeight: "500", color: "#111", fontSize: 15 },
  totalRow: { flexDirection: 'row', marginTop: 16, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 12, justifyContent: "space-between" },
  totalLabel: { fontWeight: "600", fontSize: 16 },
  totalAmt: { fontWeight: "bold", color: "#222", fontSize: 17 }
});

export default ReportsScreen;
