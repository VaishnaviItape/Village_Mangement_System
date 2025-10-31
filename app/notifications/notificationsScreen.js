import React, { useState, useRef } from "react";
import {
  FlatList,
  Animated,
  View,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenHeight,
  screenWidth,
} from "../../constants/styles";
import { SwipeListView } from "react-native-swipe-list-view";
import { Snackbar } from "react-native-paper";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";

const dummyText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since";

const newNotificatiosList = [
  {
    key: "1",
    title: "Booking success..!",
    description: dummyText,
    notificationTypeIcon: require("../../assets/images/icons/calendar.png"),
  },
  {
    key: "2",
    title: "Payment successful..",
    description: dummyText,
    notificationTypeIcon: require("../../assets/images/icons/payment.png"),
  },
];

const oldNotificationsList = [
  {
    key: "1",
    title: "Charging Complete..",
    description: dummyText,
    notificationTypeIcon: require("../../assets/images/icons/charger.png"),
  },
  {
    key: "2",
    title: "Payment successful..",
    description: dummyText,
    notificationTypeIcon: require("../../assets/images/icons/payment.png"),
  },
  {
    key: "3",
    title: "Booking success..!",
    description: dummyText,
    notificationTypeIcon: require("../../assets/images/icons/calendar.png"),
  },
];

const rowTranslateAnimatedValues = {};

const NotificationScreen = () => {

  const navigation = useNavigation();

  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");
  const [listData, setListData] = useState(newNotificatiosList);
  const [oldListData, setOldListData] = useState(oldNotificationsList);

  const animationIsRunning = useRef(false);

  Array(listData.length + 1)
    .fill("")
    .forEach((_, i) => {
      rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
    });

  Array(oldListData.length + 1)
    .fill("")
    .forEach((_, i) => {
      rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
    });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        {
          listData.length == 0 && oldListData.length == 0
            ?
            noNotoficationInfo()
            :
            notifications()
        }
      </View>
      {snackBar()}
    </View>
  );

  function notifications() {
    return (
      <FlatList
        ListHeaderComponent={
          <View style={{ flex: 1 }}>
            {newNotifications()}
            {oldNotifications()}
          </View>
        }
        contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  function snackBar() {
    return (
      <Snackbar
        style={styles.snackBarStyle}
        elevation={0}
        visible={showSnackBar}
        onDismiss={() => setShowSnackBar(false)}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>{snackBarMsg}</Text>
      </Snackbar>
    );
  }

  function oldNotifications() {
    const oldOnSwipeValueChange = (swipeData) => {
      const { key, value } = swipeData;
      if (
        value > screenWidth ||
        (value < -screenWidth && !animationIsRunning.current)
      ) {
        animationIsRunning.current = true;
        Animated.timing(rowTranslateAnimatedValues[key], {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          const newData = [...oldListData];
          const prevIndex = oldListData.findIndex((item) => item.key === key);
          newData.splice(prevIndex, 1);
          const removedItem = oldListData.find((item) => item.key === key);
          setSnackBarMsg(`${removedItem.title} dismissed`);
          setOldListData(newData);
          setShowSnackBar(true);
          animationIsRunning.current = false;
        });
      }
    };

    const oldRenderItem = (data) => (
      <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
        <View style={{ ...styles.notificationWrapStyle }}>
          <View
            style={{
              ...styles.notificationIconWrapStyle,
              marginRight: Sizes.fixPadding + 5.0,
            }}
          >
            <Image
              source={data.item.notificationTypeIcon}
              style={styles.notificationIconStyle}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
              {data.item.title}
            </Text>
            <Text
              numberOfLines={4}
              style={{
                ...Fonts.grayColor14Regular,
                marginTop: Sizes.fixPadding - 5.0,
              }}
            >
              {data.item.description}
            </Text>
          </View>
        </View>
      </View>
    );

    const oldRenderHiddenItem = () => <View style={styles.rowBack} />;

    return oldListData.length == 0 ? null : (
      <View>
        <Text
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding,
            ...Fonts.primaryColor18SemiBold,
          }}
        >
          Earlier..
        </Text>
        <SwipeListView
          listKey={`olds`}
          data={oldListData}
          renderItem={oldRenderItem}
          renderHiddenItem={oldRenderHiddenItem}
          rightOpenValue={-screenWidth}
          leftOpenValue={screenWidth}
          onSwipeValueChange={oldOnSwipeValueChange}
          useNativeDriver={false}
          contentContainerStyle={{ paddingVertical: Sizes.fixPadding - 8.0 }}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function newNotifications() {
    const onSwipeValueChange = (swipeData) => {
      const { key, value } = swipeData;
      if (
        value > screenWidth ||
        (value < -screenWidth && !animationIsRunning.current)
      ) {
        animationIsRunning.current = true;
        Animated.timing(rowTranslateAnimatedValues[key], {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          const newData = [...listData];
          const prevIndex = listData.findIndex((item) => item.key === key);
          newData.splice(prevIndex, 1);
          const removedItem = listData.find((item) => item.key === key);
          setSnackBarMsg(`${removedItem.title} dismissed`);
          setListData(newData);
          setShowSnackBar(true);
          animationIsRunning.current = false;
        });
      }
    };

    const renderItem = (data) => (
      <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
        <View style={{ ...styles.notificationWrapStyle }}>
          <View
            style={{
              ...styles.notificationIconWrapStyle,
              marginRight: Sizes.fixPadding + 5.0,
            }}
          >
            <Image
              source={data.item.notificationTypeIcon}
              style={styles.notificationIconStyle}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
              {data.item.title}
            </Text>
            <Text
              numberOfLines={4}
              style={{
                ...Fonts.grayColor14Regular,
                marginTop: Sizes.fixPadding - 5.0,
              }}
            >
              {data.item.description}
            </Text>
          </View>
        </View>
      </View>
    );

    const renderHiddenItem = () => <View style={styles.rowBack} />;

    return listData.length == 0 ? null : (
      <View>
        <Text
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding,
            ...Fonts.primaryColor18SemiBold,
          }}
        >
          Today so far..
        </Text>
        <SwipeListView
          listKey={`todays`}
          data={listData}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-screenWidth}
          leftOpenValue={screenWidth}
          onSwipeValueChange={onSwipeValueChange}
          useNativeDriver={false}
          contentContainerStyle={{ paddingVertical: Sizes.fixPadding - 8.0 }}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function noNotoficationInfo() {
    return (
      <View
        style={{
          flex: 0.9,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../../assets/images/icons/empty_notification.png")}
          style={{ width: 100.0, height: 100.0, resizeMode: "contain" }}
        />
        <Text
          style={{
            ...Fonts.grayColor18Medium,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          There are no new notifications..!
        </Text>
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
          Notifications
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  notificationWrapStyle: {
    ...commonStyles.rowAlignCenter,
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: Colors.primaryColor,
    flex: 1,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  notificationIconWrapStyle: {
    width: 70.0,
    height: 70.0,
    borderRadius: 35.0,
    backgroundColor: "rgba(6, 124, 96, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationIconStyle: {
    width: 35.0,
    height: 35.0,
    resizeMode: "contain",
    tintColor: Colors.primaryColor,
  },
  snackBarStyle: {
    backgroundColor: Colors.lightBlackColor,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 5,
  },
});

export default NotificationScreen;
