import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";

const EditProfileScreen = () => {

  const navigation = useNavigation();

  const [name, setname] = useState("Peter Jones");
  const [email, setemail] = useState("peterjones@abc.com");
  const [mobileNumber, setmobileNumber] = useState("1234567890");
  const [showChangeProfilePicSheet, setshowChangeProfilePicSheet] =
    useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
        >
          {profilePicInfo()}
          {nameInfo()}
          {emailInfo()}
          {mobileNumberInfo()}
        </ScrollView>
      </View>
      {updateProfileButton()}
      {changeProfilePicOptionSheet()}
    </View>
  );

  function changeProfilePicOptionSheet() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showChangeProfilePicSheet}
        onRequestClose={() => { setshowChangeProfilePicSheet(false) }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { setshowChangeProfilePicSheet(false) }}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ justifyContent: "flex-end", flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => { }}
            >
              <View style={styles.sheetWrapStyle}>
                <Text style={{ textAlign: "center", ...Fonts.blackColor18SemiBold }}>
                  Choose action
                </Text>
                <View style={{ marginTop: Sizes.fixPadding + 5.0 }}>
                  {sheetOptionSort({
                    icon: require("../../assets/images/icons/camera.png"),
                    option: "Camera",
                  })}
                  {sheetOptionSort({
                    icon: require("../../assets/images/icons/gallery.png"),
                    option: "Choose from gallery",
                  })}
                  {sheetOptionSort({
                    icon: require("../../assets/images/icons/remove_image.png"),
                    option: "Remove profile picture",
                  })}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  function sheetOptionSort({ icon, option }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setshowChangeProfilePicSheet(false);
        }}
        style={{
          ...commonStyles.rowSpaceBetween,
          marginBottom: Sizes.fixPadding * 1.5,
        }}
      >
        <View style={{ flex: 1, ...commonStyles.rowAlignCenter }}>
          <View style={{ ...styles.sheetOptionWrapStyle }}>
            <Image
              source={icon}
              style={{ width: 22.0, height: 22.0, resizeMode: "contain" }}
            />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.blackColor18Medium,
              flex: 1,
              marginLeft: Sizes.fixPadding * 1.5,
            }}
          >
            {option}
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          color={Colors.primaryColor}
          size={15}
        />
      </TouchableOpacity>
    );
  }

  function updateProfileButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { navigation.pop() }}
        style={{ ...commonStyles.button, borderRadius: 0 }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Update profile</Text>
      </TouchableOpacity>
    );
  }

  function mobileNumberInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor18SemiBold }}>Mobile number</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your mobile number here"
            placeholderTextColor={Colors.grayColor}
            value={mobileNumber}
            onChangeText={(text) => setmobileNumber(text)}
            style={{ padding: 0, ...Fonts.blackColor16Medium }}
            keyboardType="phone-pad"
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            numberOfLines={1}
          />
        </View>
      </View>
    );
  }

  function emailInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor18SemiBold }}>Email address</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your email address here"
            placeholderTextColor={Colors.grayColor}
            value={email}
            onChangeText={(text) => setemail(text)}
            style={{ padding: 0, ...Fonts.blackColor16Medium }}
            keyboardType="email-address"
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            numberOfLines={1}
          />
        </View>
      </View>
    );
  }

  function nameInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.grayColor18SemiBold }}>Name</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your name here"
            placeholderTextColor={Colors.grayColor}
            value={name}
            onChangeText={(text) => setname(text)}
            style={{ padding: 0, ...Fonts.blackColor16Medium }}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            numberOfLines={1}
          />
        </View>
      </View>
    );
  }

  function profilePicInfo() {
    return (
      <View
        style={{
          alignSelf: "center",
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding + 5.0,
        }}
      >
        <Image
          source={require("../../assets/images/users/user4.png")}
          style={styles.profilePicStyle}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setshowChangeProfilePicSheet(true);
          }}
          style={styles.editIconWrapper}
        >
          <MaterialIcons name="edit" color={Colors.whiteColor} size={16} />
        </TouchableOpacity>
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          ...commonStyles.rowAlignCenter,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={26}
          onPress={() => {
            navigation.pop();
          }}
        />
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            flex: 1,
            marginLeft: Sizes.fixPadding * 2.0,
          }}
        >
          Edit Profile
        </Text>
      </View>
    );
  }
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  editIconWrapper: {
    width: 32.0,
    height: 32.0,
    borderRadius: 16.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    bottom: 0,
    borderColor: Colors.whiteColor,
    borderWidth: 1.0,
  },
  profilePicStyle: {
    width: screenWidth / 4.0,
    height: screenWidth / 4.0,
    borderRadius: screenWidth / 4.0 / 2.0,
    borderColor: Colors.whiteColor,
    borderWidth: 2.0,
  },
  textFieldWrapper: {
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    paddingVertical: Sizes.fixPadding,
    marginTop: Sizes.fixPadding,
  },
  sheetWrapStyle: {
    backgroundColor: Colors.bodyBackColor,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding + 10.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
  },
  sheetOptionWrapStyle: {
    width: 46.0,
    height: 46.0,
    borderRadius: 23.0,
    backgroundColor: "rgba(6, 124, 96, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
