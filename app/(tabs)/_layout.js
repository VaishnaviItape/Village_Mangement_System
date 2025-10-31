import { useFocusEffect } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { useCallback, useState } from "react";
import { Animated, BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Colors, Fonts, Sizes, commonStyles } from "../../constants/styles";

export default function TabLayout() {
  const [backClickCount, setBackClickCount] = useState(0);

  const backAction = useCallback(() => {
    if (backClickCount === 1) {
      BackHandler.exitApp();
    } else {
      triggerBackPressInfo();
    }
    return true;
  }, [backClickCount]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => backHandler.remove();
    }, [backAction])
  );

  function triggerBackPressInfo() {
    setBackClickCount(1);
    setTimeout(() => setBackClickCount(0), 1000);
  }

  function exitInfo() {
    if (backClickCount === 1) {
      return (
        <View style={styles.exitInfoWrapStyle}>
          <Text style={{ ...Fonts.whiteColor14Medium }}>Press Back Once Again To Exit!</Text>
        </View>
      );
    }
    return null;
  }

  const ACTIVE_COLOR = "#E51C4B";
  const INACTIVE_COLOR = "#8A8A8A";

  const TabIcon = ({ name, label, focused }) => {
    const scale = new Animated.Value(focused ? 1.1 : 1);
    const color = focused ? ACTIVE_COLOR : INACTIVE_COLOR;

    Animated.spring(scale, {
      toValue: focused ? 1.1 : 1,
      useNativeDriver: true,
      friction: 6,
    }).start();

    return (
      <Animated.View style={[styles.tabItem, { transform: [{ scale }] }]}>
        <MaterialIcons name={name} size={25} color={color} />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: ACTIVE_COLOR,
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarButton: (props) => (
            <Pressable {...props} android_ripple={{ color: Colors.extraLightGrayColor }} />
          ),
        }}
      >
        <Tabs.Screen
          name="home/homeScreen"
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="home" label="Home" focused={focused} />,
          }}
        />

        <Tabs.Screen
          name="sales/SalesListScreen"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="shopping-cart" label="Sales" focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="expenses/ExpensesScreen"
          options={{
            title: "Expenses",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="attach-money" label="Expenses" focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="attendance/AttendanceScreen"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="date-range" label="Attendance" focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="enroute/enrouteScreen"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="bar-chart" label="Reports" focused={focused} />
            ),
          }}
        />
      </Tabs>

      {exitInfo()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    paddingVertical: 4,
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 11,
    letterSpacing: -0.2,
    marginTop: 3,
    textAlign: "center",
  },
  tabBarStyle: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderTopColor: Colors.extraLightGrayColor,
    borderTopWidth: 1,
    height: 80,
    paddingTop: Sizes.fixPadding,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  exitInfoWrapStyle: {
    backgroundColor: Colors.lightBlackColor,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2,
    paddingHorizontal: Sizes.fixPadding + 5,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
});
