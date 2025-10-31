import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { Colors, Fonts, Sizes, commonStyles } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";

const recentSearchesList = [
  "Tesla charging spot",
  "Fast charging station",
  "Rapid charge",
];

const SearchScreen = () => {

  const navigation = useNavigation();

  const [search, setsearch] = useState("");
  const [recentSearches, setrecentSearches] = useState(recentSearchesList);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        {searchField()}
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
        >
          {recentSearches.length === 0 ? null : recentSearchesInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function recentSearchesInfo() {
    const renderItem = ({ item }) => (
      <Text
        style={{
          ...Fonts.grayColor16Medium,
          marginVertical: Sizes.fixPadding - 5.0,
        }}
      >
        {item}
      </Text>
    );
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <View style={{ ...commonStyles.rowSpaceBetween }}>
          <Text
            numberOfLines={1}
            style={{ ...Fonts.blackColor20SemiBold, flex: 1 }}
          >
            Recent searches
          </Text>
          <Text
            onPress={() => { setrecentSearches([]) }}
            style={{ ...Fonts.primaryColor16Medium }}
          >
            Clear all
          </Text>
        </View>
        <FlatList
          data={recentSearches}
          keyExtractor={(index) => `${index}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function searchField() {
    return (
      <View style={{ ...styles.searchBox, marginBottom: Sizes.fixPadding * 2.0 }}>
        <MaterialIcons
          name="search"
          color={search ? Colors.primaryColor : Colors.grayColor}
          size={24}
        />
        <TextInput
          placeholder="Search for charging station"
          placeholderTextColor={Colors.grayColor}
          style={styles.searchFeildStyle}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          value={search}
          onChangeText={(text) => setsearch(text)}
          numberOfLines={1}
        />
      </View>
    );
  }

  function header() {
    return (
      <View style={{ ...commonStyles.rowSpaceBetween, margin: 20.0 }}>
        <View
          style={{
            ...commonStyles.rowAlignCenter,
            flex: 1,
            marginRight: Sizes.fixPadding - 5.0,
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
            numberOfLines={1}
            style={{
              ...Fonts.blackColor20SemiBold,
              flex: 1,
              marginLeft: Sizes.fixPadding * 2.0,
            }}
          >
            Search
          </Text>
        </View>
        <MaterialIcons
          name="filter-list"
          color={Colors.blackColor}
          size={26}
          onPress={() => {
            navigation.push("filter/filterScreen");
          }}
        />
      </View>
    );
  }
};

export default SearchScreen;

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
  },
  searchFeildStyle: {
    padding: 0,
    ...Fonts.blackColor18Medium,
    flex: 1,
    marginLeft: Sizes.fixPadding,
  }
});
