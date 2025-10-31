import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  Platform,
  TouchableOpacity,
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

const HelpScreen = () => {

  const navigation = useNavigation();

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [mobileNumber, setmobileNumber] = useState("");
  const [message, setmessage] = useState("");
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          {helpImage()}
          {talkingInfo()}
          {nameInfo()}
          {emailInfo()}
          {mobileNumberInfo()}
          {messageInfo()}
          {submitButton()}
        </ScrollView>
      </View>
    </View>
  );

  function submitButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { navigation.pop() }}
        style={{ ...styles.submitButtonStyle }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Submit</Text>
      </TouchableOpacity>
    );
  }

  function messageInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor16SemiBold }}>Message</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Write your message here.."
            value={message}
            onChangeText={(text) => setmessage(text)}
            style={{
              ...Fonts.blackColor16Medium,
              paddingTop: Sizes.fixPadding - 5.0,
              minHeight: 120.0,
            }}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
      </View>
    );
  }

  function mobileNumberInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor16SemiBold }}>Mobile number</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your mobile number here"
            value={mobileNumber}
            onChangeText={(text) => setmobileNumber(text)}
            style={{ padding: 0, ...Fonts.blackColor16Medium }}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            keyboardType="phone-pad"
            numberOfLines={1}
          />
        </View>
      </View>
    );
  }

  function emailInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor16SemiBold }}>Email address</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your email here"
            value={email}
            onChangeText={(text) => setemail(text)}
            style={{ padding: 0, ...Fonts.blackColor16Medium }}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            keyboardType="email-address"
            numberOfLines={1}
          />
        </View>
      </View>
    );
  }

  function nameInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor16SemiBold }}>Name</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter your name here"
            value={name}
            onChangeText={(text) => setname(text)}
            style={{ padding: 0, ...Fonts.blackColor16Medium }}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            numberOfLines={1}
          />
        </View>
      </View>
    );
  }

  function talkingInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding,
        }}
      >
        <Text style={{ ...Fonts.blackColor18SemiBold }}>
          Talk to our support team
        </Text>
        <Text
          style={{
            ...Fonts.grayColor16Regular,
          }}
        >
          Fill below form and our support team will be in touch with you
          shortly.
        </Text>
      </View>
    );
  }

  function helpImage() {
    return (
      <Image
        source={require("../../assets/images/help.png")}
        style={styles.helpImageStyle}
      />
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
          onPress={() => { navigation.pop() }}
        />
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            flex: 1,
            marginLeft: Sizes.fixPadding * 2.0,
          }}
        >
          Help
        </Text>
      </View>
    );
  }
};

export default HelpScreen;

const styles = StyleSheet.create({
  helpImageStyle: {
    width: "100%",
    height: screenWidth / 2,
    resizeMode: "contain",
    marginVertical: Sizes.fixPadding,
  },
  textFieldWrapper: {
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    paddingVertical: Sizes.fixPadding,
    marginTop: Sizes.fixPadding,
  },
  submitButtonStyle: {
    padding: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding * 5.0,
    marginHorizontal: Sizes.fixPadding * 4.0,
    marginVertical: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
  },
});
