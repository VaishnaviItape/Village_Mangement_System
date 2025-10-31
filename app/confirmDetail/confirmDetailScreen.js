import { useNavigation } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import img1 from "../../assets/images/users/user4.png";
import {
  Colors,
  commonStyles,
  Fonts,
  screenWidth,
  Sizes,
} from "../../constants/styles";
import { handleLogout } from "../../utils/logoutHelper"; // adjust the relative path if needed
const ProfileScreen = () => {

  const navigation = useNavigation();

  const [showLogoutSheet, setshowLogoutSheet] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
        >
          {profileInfoWithOptions()}
        </ScrollView>
      </View>
      {logoutSheet()}
    </View>
  );

  function logoutSheet() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLogoutSheet}
        onRequestClose={() => { setshowLogoutSheet(false) }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { setshowLogoutSheet(false) }}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ justifyContent: "flex-end", flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => { }}
            >
              <View
                style={{
                  backgroundColor: Colors.bodyBackColor,
                  borderTopLeftRadius: Sizes.fixPadding,
                  borderTopRightRadius: Sizes.fixPadding,
                }}
              >
                <Text style={styles.logoutTextStyle}>Logout</Text>
                <Text
                  style={{
                    ...Fonts.blackColor18Medium,
                    marginVertical: Sizes.fixPadding,
                    marginHorizontal: Sizes.fixPadding * 2.0,
                  }}
                >
                  Are you sure want to logout?
                </Text>
                <View
                  style={{
                    ...commonStyles.rowAlignCenter,
                    marginTop: Sizes.fixPadding,
                    borderTopWidth: 1,
                    borderTopColor: Colors.extraLightGrayColor,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setshowLogoutSheet(false);
                    }}
                    style={{
                      ...styles.cancelButtonStyle,
                      ...styles.sheetButtonStyle,
                    }}
                  >
                    <Text style={{ ...Fonts.blackColor16Medium }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={async () => {
                      setshowLogoutSheet(false);
                      await handleLogout();
                    }}
                    style={{
                      ...styles.logoutButtonStyle,
                      ...styles.sheetButtonStyle,
                    }}
                  >
                    <Text style={{ ...Fonts.whiteColor16Medium }}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  function profileInfoWithOptions() {
    return (
      <View style={styles.profileInfoWithOptionsWrapStyle}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={img1}
            style={styles.userImageStyle}
          />
        </View>
        <View
          style={{
            alignItems: "center",
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
          }}
        >
          <Text style={{ ...Fonts.blackColor18SemiBold }}>Amit</Text>
          <Text style={{ ...Fonts.grayColor16Medium }}>Admin</Text>
        </View>
        <View>
          {profileOption({
            option: "Edit Profile",
            icon: require("../../assets/images/icons/user.png"),
            onPress: () => {
              navigation.push("editProfile/editProfileScreen");
            },
          })}
          {profileOption({
            option: "Account Settings",
            icon: require("../../assets/images/icons/calendar.png"),
            onPress: () => {
              navigation.navigate("AllTenants/allTenantsScreen");
            },
          })}
          {profileOption({
            option: "Notifications",
            icon: require("../../assets/images/icons/notification.png"),
            onPress: () => {
              navigation.push("notifications/notificationsScreen");
            },
          })}
         
          {profileOption({
            option: "Security",
            icon: require("../../assets/images/icons/faq.png"),
            onPress: () => {
              navigation.push("faq/faqScreen");
            },
          })}
          {profileOption({
            option: "Language",
            icon: require("../../assets/images/icons/privacy_policy.png"),
            onPress: () => {
              navigation.push("privacyPolicy/privacyPolicyScreen");
            },
          })}
           {profileOption({
            option: "Dark Mode",
            icon: require("../../assets/images/icons/list.png"),
            onPress: () => {
              navigation.push("termsAndConditions/termsAndConditionsScreen");
            },
          })}
           {profileOption({
            option: "Terms & Condition",
            icon: require("../../assets/images/icons/list.png"),
            onPress: () => {
              navigation.push("termsAndConditions/termsAndConditionsScreen");
            },
          })}
          {profileOption({
            option: "Help and Support",
            icon: require("../../assets/images/icons/help.png"),
            onPress: () => {
              navigation.push("help/helpScreen");
            },
          })}
          {logoutInfo()}
        </View>
      </View>
    );
  }

  function logoutInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setshowLogoutSheet(true);
        }}
        style={{
          ...commonStyles.rowSpaceBetween,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ ...commonStyles.rowAlignCenter, flex: 1 }}>
          <View style={styles.optionIconWrapper}>
            <Image
              source={require("../../assets/images/icons/logout.png")}
              style={{ width: 24.0, height: 24.0, resizeMode: "contain" }}
            />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.redColor18Medium,
              marginLeft: Sizes.fixPadding * 1.5,
              flex: 1,
            }}
          >
            Logout
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={15.0}
          color={Colors.redColor}
        />
      </TouchableOpacity>
    );
  }

  function profileOption({ option, icon, onPress }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{
          ...commonStyles.rowSpaceBetween,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ ...commonStyles.rowAlignCenter, flex: 1 }}>
          <View style={styles.optionIconWrapper}>
            <Image
              source={icon}
              style={{ width: 24.0, height: 24.0, resizeMode: "contain" }}
            />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.blackColor18Medium,
              marginLeft: Sizes.fixPadding * 1.5,
              flex: 1,
            }}
          >
            {option}
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={15.0}
          // color={Colors.primaryColor}
        />
      </TouchableOpacity>
    );
  }

  function header() {
    return (
      <Text
        style={{
          ...Fonts.blackColor20SemiBold,
          marginTop: 50,
          padding: 25,
        }}
      >
        Profile
      </Text>
    );
  }
};

export default ProfileScreen;

const styles = StyleSheet.create({
  userImageStyle: {
    width: screenWidth / 4.0,
    height: screenWidth / 4.0,
    borderRadius: screenWidth / 4.0 / 2.0,
    marginTop: -Sizes.fixPadding * 5.0,
    borderColor: Colors.whiteColor,
    borderWidth: 2.0,
  },
  profileInfoWithOptionsWrapStyle: {
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
  },
  optionIconWrapper: {
    width: 46.0,
    height: 46.0,
    borderRadius: 23.0,
    backgroundColor: "rgba(6, 124, 96, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetButtonStyle: {
    flex: 1,
    ...commonStyles.shadow,
    borderTopWidth: Platform.OS == "ios" ? 0 : 1.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical:
      Platform.OS == 'ios' ? Sizes.fixPadding + 3.0 : Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopColor: Colors.extraLightGrayColor,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
  },
  logoutButtonStyle: {
    backgroundColor: "#E51C4B", // ✅ Bright red visible button
    borderBottomRightRadius: Sizes.fixPadding - 5.0,
    borderTopColor: Colors.primaryColor,
  },
  logoutTextStyle: {
    marginTop: Sizes.fixPadding * 1.5,
    ...Fonts.blackColor20SemiBold,
    textAlign: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
});
