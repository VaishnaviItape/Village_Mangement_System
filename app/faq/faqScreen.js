import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Colors, Fonts, Sizes, commonStyles } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";

const dummyText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown";

const faqsList = [
  {
    id: "1",
    question: "How can i book charging point?",
    answer: dummyText,
    expanded: true,
  },
  {
    id: "2",
    question: "This direction is accurate?",
    answer: dummyText,
    expanded: false,
  },
  {
    id: "3",
    question: "Refund available in this platform?",
    answer: dummyText,
    expanded: false,
  },
  {
    id: "4",
    question: "How i apply for refund?",
    answer: dummyText,
    expanded: false,
  },
  {
    id: "5",
    question: "How i cancel my booking?",
    answer: dummyText,
    expanded: false,
  },
  {
    id: "6",
    question: "Is fast charging available?",
    answer: dummyText,
    expanded: false,
  },
];

const FaqScreen = () => {

  const navigation = useNavigation();

  const [faqsData, setfaqsData] = useState(faqsList);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        {faqsInfo()}
      </View>
    </View>
  );

  function changeFaqs({ id }) {
    const copyData = faqsData;
    const newData = copyData.map((item) => {
      if (item.id === id) {
        return { ...item, expanded: !item.expanded };
      } else {
        return item;
      }
    });
    setfaqsData(newData);
  }

  function faqsInfo() {
    const renderItem = ({ item }) => (
      <View style={styles.faqWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => changeFaqs({ id: item.id })}
          style={{ ...commonStyles.rowSpaceBetween }}
        >
          <Text
            numberOfLines={1}
            style={{ ...Fonts.blackColor18SemiBold, flex: 1 }}
          >
            Q. {item.question}
          </Text>
          <MaterialIcons
            name={item.expanded ? 'keyboard-arrow-up' : "keyboard-arrow-down"}
            color={Colors.blackColor}
            size={25}
          />
        </TouchableOpacity>
        {item.expanded ? (
          <Text
            style={{
              ...Fonts.grayColor16Regular,
              marginTop: Sizes.fixPadding - 5.0,
            }}
          >
            {item.answer}
          </Text>
        ) : null}
      </View>
    );
    return (
      <FlatList
        data={faqsData}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding - 8.0 }}
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
          onPress={() => { navigation.pop()}}
        />
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            flex: 1,
            marginLeft: Sizes.fixPadding * 2.0,
          }}
        >
          FAQ
        </Text>
      </View>
    );
  }
};

export default FaqScreen;

const styles = StyleSheet.create({
  faqWrapStyle: {
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    padding: Sizes.fixPadding * 2.0,
  },
});
