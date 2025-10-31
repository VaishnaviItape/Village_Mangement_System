import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { createRef, useCallback, useState } from "react";
import {
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Colors,
  Fonts,
  Sizes,
  screenWidth
} from "../../constants/styles";

const onboardingScreenList = [
  {
    id: "1",
    onboardingImage: require("../../assets/images/onboarding/onboarding1.png"),
    onboardingTitle: "Manage Properties Easily",
    onboardingDescription:
      " Streamline your property management with smart tools for occupancy, rent, and tenant records.",
  },
  {
    id: "2",
    onboardingImage: require("../../assets/images/onboarding/onboarding2.png"),
    onboardingTitle: "Track Rent & Payments",
    onboardingDescription:
      "Easily update, view, and approve tenant payment proofs with a single click.",
  },
  {
    id: "3",
    onboardingImage: require("../../assets/images/onboarding/onboarding3.png"),
    onboardingTitle: "Maintenance Made Simple",
    onboardingDescription:
      "Tenants can raise issues with photos and bills; managers/admins can approve and track repairs.",
  },
];

const OnboardingScreen = () => {

  const navigation = useNavigation();

  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => {
        backHandler.remove();
      };
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  const [backClickCount, setBackClickCount] = useState(0);
  const listRef = createRef();
  const [currentScreen, setCurrentScreen] = useState(0);

  const scrollToIndex = ({ index }) => {
    listRef.current.scrollToIndex({ animated: true, index: index });
    setCurrentScreen(index);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>

      <View style={{ flex: 1 }}>
        {onboardingScreenContent()}
        {/* {indicators()} */}
        {skipButton()}
        {bottomButtons()}
      </View>
      {exitInfo()}
    </View>
  );

  function indicators() {
    return (
      <View style={styles.indicatorWrapStyle}>
        {onboardingScreenList.map((item, index) => {
          return (
            <View
              key={item.id}
              style={[
                styles.indicatorBase,
                currentScreen === index ? styles.activeIndicator : styles.inactiveIndicator
              ]}
            />
          );
        })}
      </View>
    );
  }

  function skipButton() {
    if (currentScreen === 0 || currentScreen === 1) {
      return (
        <TouchableOpacity
          onPress={() => navigation.push("auth/signinScreen")}
          style={{
            position: 'absolute',
            top: 73,
            left: 310,
            width: 65,
            height: 58,
            borderRadius: 12, // "Corner Radius/Radius-Button-12"
            padding: 16,
            gap: 12, // For spacing between icon and text if any; not needed here
            backgroundColor: '#E51C4B',
            opacity: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text style={{
            fontFamily: 'Urbanist-Bold',
            fontSize: 16,
            color: '#fff'
          }}>
            Skip
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  }

  // function nextArrowButton() {
  //   if (currentScreen === 1) {
  //     // Middle screen: back arrow takes user to the first screen
  //     return (
  //       <TouchableOpacity
  //         onPress={() => scrollToIndex({ index: 0 })}
  //         style={styles.backButtonStyle}>
  //         <Text style={{ fontSize: 32, color: "#E51C4B" }}>←</Text>
  //       </TouchableOpacity>
  //     );
  //   }
  //   if (currentScreen === 2) {
  //     // Last screen: back arrow takes user to the middle screen
  //     return (
  //       <TouchableOpacity
  //         onPress={() => scrollToIndex({ index: 1 })}
  //         style={styles.backButtonStyle}>
  //         <Text style={{ fontSize: 32, color: "#E51C4B" }}>←</Text>
  //       </TouchableOpacity>
  //     );
  //   }
  //   return null;
  // }

  // function getStartedButton() {
  //   if (currentScreen === 2) {
  //     return (
  //       <TouchableOpacity
  //         onPress={() => navigation.push("auth/signinScreen")}
  //         style={{
  //           marginBottom: 40,
  //           alignSelf: "center",
  //           backgroundColor: "#E51C4B",
  //           paddingVertical: 16,
  //           paddingHorizontal: 48,
  //           borderRadius: 12
  //         }}>
  //         <Text style={{
  //           fontFamily: "Urbanist-Bold",
  //           fontSize: 16,
  //           color: "#fff"
  //         }}>
  //           Get Started
  //         </Text>
  //       </TouchableOpacity>
  //     );
  //   }
  //   return null;
  // }

  function onboardingScreenContent() {
    const renderItem = ({ item }) => {
      return (
        <View style={styles.pageContent}>
          <Image
            source={item.onboardingImage}
            style={{
              width: 395,
              height: 790,
              position: "absolute",
              top: -139,
              opacity: 1,
              transform: [{ rotate: '0deg' }],
              resizeMode: 'contain'
            }}
          />

          <Text style={{
            fontFamily: 'Urbanist-Bold',
            fontWeight: '700',
            fontSize: 30,
            marginTop: 360,
            lineHeight: 32 * 1.6, // 51.2
            textAlign: 'center',
            color: '#E51C4B',
            width: 394,
            height: 59,
            opacity: 1,
          }}>
            {item.onboardingTitle}
          </Text>

          <Text style={{
            fontFamily: 'Urbanist-Regular',
            fontWeight: '500',
            fontSize: 16,
            marginTop: 10,
            lineHeight: 16 * 1.6,
            textAlign: 'center',
            color: '#59606E',
            marginHorizontal: Sizes.fixPadding * 2,
          }}>
            {item.onboardingDescription}
          </Text>
          {indicators()}
        </View>
      );
    };

    return (
      <FlatList
        ref={listRef}
        data={onboardingScreenList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        scrollEventThrottle={32}
        pagingEnabled
        onMomentumScrollEnd={onScrollEnd}
        showsHorizontalScrollIndicator={false}
      />
    );
  }
  function bottomButtons() {
    return (
      <View style={styles.bottomButtonsContainer}>
        {/* Back Arrow Button */}
        {(currentScreen === 1 || currentScreen === 2) && (
          <TouchableOpacity
            onPress={() => scrollToIndex({ index: currentScreen === 1 ? 0 : 1 })}
            style={styles.backButtonStyle}>
            <Ionicons name="arrow-back" size={32} color="#ffff" />
          </TouchableOpacity>
        )}

        {/* Get Started Button */}
        {currentScreen === 2 && (
          <TouchableOpacity
            onPress={() => navigation.push("auth/signinScreen")}
            style={styles.getStartedButton}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
  function onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;
    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentScreen(pageNum);
  }

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitWrapper}>
        <Text
          style={{
            paddingTop: Sizes.fixPadding - 8.0,
            lineHeight: 15.0,
            ...Fonts.whiteColor14Medium,
          }}
        >
          Press Back Once Again To Exit!
        </Text>
      </View>
    ) : null;
  }
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  exitWrapper: {
    backgroundColor: Colors.lightBlackColor,
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorWrapStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: Sizes.fixPadding * 3.0,
  },

  indicatorBase: {
    marginHorizontal: 5,
    backgroundColor: '#D9D9D9',
  },

  activeIndicator: {
    width: 30,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E51C4B',
  },

  inactiveIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D9D9D9',
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  backButtonStyle: {
    backgroundColor: "#E51C4B",
    padding: 8,
    borderRadius: 20,
    marginRight: 15,
  },

  getStartedButton: {
    backgroundColor: "#E51C4B",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },

  getStartedText: {
    fontFamily: "Urbanist-Bold",
    fontSize: 16,
    color: "#fff",
    textAlign: 'center',
  },
  pageContent: {
    flex: 1,
    width: screenWidth,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
