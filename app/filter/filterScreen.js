import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import MyStatusBar from "../../components/myStatusBar";
import { Colors, Fonts, Sizes, commonStyles } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";

const connectionTypesList = [
  {
    id: "1",
    connectionTypeImage: require("../../assets/images/connectionTypes/connection_type1.png"),
    connectionType: "CCS",
    selected: true,
  },
  {
    id: "2",
    connectionTypeImage: require("../../assets/images/connectionTypes/connection_type2.png"),
    connectionType: "CCS2",
    selected: false,
  },
  {
    id: "3",
    connectionTypeImage: require("../../assets/images/connectionTypes/connection_type3.png"),
    connectionType: "Mennekes",
    selected: false,
  },
];

const distanceList = ["<5 km", "<10 km", "<20 km", "<30 km", ">30 km"];

const chargingSpeedsList = [
  {
    id: "1",
    speed: "Standard (<3.7 kW)",
    selected: true,
  },
  {
    id: "2",
    speed: "Semi fast (3.7 - 20 kW)",
    selected: false,
  },
  {
    id: "3",
    speed: "Fast (20 - 43 kW)",
    selected: false,
  },
  {
    id: "4",
    speed: "Ultra fast (>43 kW)",
    selected: false,
  },
];

const FilterScreen = () => {

  const navigation = useNavigation();

  const [connectionTypes, setconnectionTypes] = useState(connectionTypesList);
  const [selectedDistanceIndex, setselectedDistanceIndex] = useState(0);
  const [chargingSpeeds, setchargingSpeeds] = useState(chargingSpeedsList);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
        >
          {connectionTypesInfo()}
          {distanceInfo()}
          {speedInfo()}
        </ScrollView>
      </View>
      {cancelAndApplyButton()}
    </View>
  );

  function cancelAndApplyButton() {
    return (
      <View
        style={{
          ...commonStyles.rowAlignCenter,
          marginVertical: Sizes.fixPadding,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <Text
          onPress={() => navigation.pop()}
          style={{ ...Fonts.blackColor18Medium }}
        >
          Cancel
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => { navigation.pop() }}
          style={{
            ...commonStyles.button,
            marginLeft: Sizes.fixPadding * 2.0,
            flex: 1,
          }}
        >
          <Text style={{ ...Fonts.whiteColor20SemiBold }}>Apply</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function changeSpeedSelection({ id }) {
    const copyData = chargingSpeeds;
    const newData = copyData.map((item) => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      } else {
        return item;
      }
    });
    setchargingSpeeds(newData);
  }

  function speedInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          changeSpeedSelection({ id: item.id });
        }}
        style={{
          ...commonStyles.rowAlignCenter,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View
          style={{
            ...styles.checkBoxStyle,
            backgroundColor: item.selected
              ? Colors.primaryColor
              : Colors.bodyBackColor,
          }}
        >
          {item.selected ? (
            <MaterialIcons name="done" color={Colors.whiteColor} size={16} />
          ) : null}
        </View>
        <Text
          numberOfLines={1}
          style={{
            ...Fonts.blackColor18Medium,
            flex: 1,
            marginLeft: Sizes.fixPadding * 1.5,
          }}
        >
          {item.speed}
        </Text>
      </TouchableOpacity>
    );
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor20SemiBold, marginBottom: Sizes.fixPadding * 2.0 }}>Charging speed</Text>
        <FlatList
          data={chargingSpeeds}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function distanceInfo() {
    return (
      <View>
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          By distance
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            padding: Sizes.fixPadding,
          }}
        >
          {distanceList.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setselectedDistanceIndex(index)}
              key={`${index}`}
              style={{
                ...styles.distanceWrapStyle,
                borderColor:
                  index === selectedDistanceIndex
                    ? Colors.primaryColor
                    : Colors.extraLightGrayColor,
              }}
            >
              <Text style={{ ...Fonts.blackColor18Medium }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function changeConnectionTypeSelection({ id }) {
    const copyData = connectionTypes;
    const newData = copyData.map((item) => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      } else {
        return item;
      }
    });
    setconnectionTypes(newData);
  }

  function connectionTypesInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          changeConnectionTypeSelection({ id: item.id });
        }}
        style={{
          ...styles.connectionTypesWrapper,
          borderColor: item.selected
            ? Colors.primaryColor
            : Colors.extraLightGrayColor,
        }}
      >
        <Image
          source={item.connectionTypeImage}
          style={{ width: 40.0, height: 40.0, resizeMode: "contain" }}
        />
        <Text
          style={{ ...Fonts.blackColor18Medium, marginTop: Sizes.fixPadding }}
        >
          {item.connectionType}
        </Text>
      </TouchableOpacity>
    );
    return (
      <View>
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          Connection type
        </Text>
        <FlatList
          data={connectionTypes}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: Sizes.fixPadding }}
        />
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
          Filter
        </Text>
      </View>
    );
  }
};

export default FilterScreen;

const styles = StyleSheet.create({
  connectionTypesWrapper: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    margin: Sizes.fixPadding,
    padding: Sizes.fixPadding * 2.0,
    borderWidth: 1.5,
    alignItems: "center",
  },
  distanceWrapStyle: {
    paddingHorizontal: Sizes.fixPadding * 1.8,
    paddingVertical: Sizes.fixPadding - 3.0,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    margin: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
    borderWidth: 1.5,
  },
  checkBoxStyle: {
    width: 20.0,
    height: 20.0,
    borderRadius: Sizes.fixPadding - 5.0,
    borderColor: Colors.primaryColor,
    borderWidth: 2.0,
    alignItems: "center",
    justifyContent: "center",
  },
});
