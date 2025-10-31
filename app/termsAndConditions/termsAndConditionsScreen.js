import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors, Fonts, Sizes, commonStyles } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";

const dummyText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown.";

const termsAndConditionsList = [
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
];

const TermsAndConditionsScreen = () => {

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {termsAndConditionInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function termsAndConditionInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        {termsAndConditionsList.map((item, index) => (
          <Text
            key={`${index}`}
            style={{
              ...Fonts.blackColor16Regular,
              marginBottom: Sizes.fixPadding,
            }}
          >
            {item}
          </Text>
        ))}
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
          onPress={() => { navigation.pop() }}
        />
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            flex: 1,
            marginLeft: Sizes.fixPadding * 2.0,
          }}
        >
          Terms & Condition
        </Text>
      </View>
    );
  }
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({});
