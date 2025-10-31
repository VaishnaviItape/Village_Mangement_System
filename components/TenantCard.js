import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TenantCard = ({
  item,
  navigation,
  images = {},
  showEdit = true,
  showInvoices = true,
  showMessage = true,
}) => {
  const status =
    item.paymentStatus || (Math.random() > 0.5 ? "Paid" : "Not Paid");

  const statusColor =
    status === "Paid"
      ? "#4CAF50"
      : status === "Overdue"
      ? "#FF4C4C"
      : "#FF9800";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.push("tenentDetailsScreen/tenentDetails", {
          tenantId: item.id,
        })
      }
      style={styles.card}
    >
      <View style={styles.row}>
        <Image
          source={
            images[item.id]
              ? { uri: images[item.id] }
              : require("../assets/images/users/default-user.png")
          }
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          {/* Header Row */}
          <View style={styles.rowBetween}>
            <Text style={styles.name}>{item.fullName}</Text>

            {/* Amount + Status container */}
            <View style={styles.rightTopBox}>
              <Text style={styles.amount}>₹{item.rentAmount || 0}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
              </View>
            </View>
          </View>

          {/* Info Section */}
          <Text style={styles.subText}>
            {item.tenantType} | {item.occupation}
          </Text>
          <Text style={styles.subText}>
            🏠 {item.unitNumber || "N/A"} | {item.propertyName || "Property"}
          </Text>
          <Text style={styles.subText}>
            📅 Move-in:{" "}
            {item.moveInDate
              ? new Date(item.moveInDate).toLocaleDateString()
              : "N/A"}
          </Text>

          {/* Action Buttons */}
          {(showEdit || showInvoices || showMessage) && (
            <View style={styles.actionRow}>
              {showEdit && (
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.8}
                  onPress={(e) => {
                    e.stopPropagation();
                    navigation.push("tenantForm/tenantForm", {
                      tenantId: item.id,
                    });
                  }}
                >
                  <Ionicons name="create-outline" size={14} color="#fff" />
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
              )}

              {showInvoices && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#546FFF" }]}
                  activeOpacity={0.8}
                  onPress={(e) => {
                    e.stopPropagation();
                    navigation.push("rentInvoicesScreen", {
                      tenantId: item.id,
                    });
                  }}
                >
                  <MaterialIcons name="receipt-long" size={14} color="#fff" />
                  <Text style={styles.actionText}>Invoices</Text>
                </TouchableOpacity>
              )}

              {showMessage && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#FF9800" }]}
                  activeOpacity={0.8}
                  onPress={(e) => {
                    e.stopPropagation();
                    // Add chat or message logic here
                  }}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={14}
                    color="#fff"
                  />
                  <Text style={styles.actionText}>Message</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TenantCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: { fontSize: 16, fontWeight: "bold", color: "#333", flexShrink: 1 },
  amount: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#FF9800",
    marginRight: 6,
  },
  rightTopBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  subText: { fontSize: 13, color: "#666", marginTop: 2 },
  actionRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E51C4B",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "600",
  },
});
