// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   Animated,
//   TouchableOpacity,
//   Platform
// } from "react-native";
// import React, { useState, createRef, useEffect, useRef } from "react";
// import MyStatusBar from "../../components/myStatusBar";
// import MapView, { Marker, Polyline } from "react-native-maps";
// import {
//   Colors,
//   screenWidth,
//   commonStyles,
//   Sizes,
//   Fonts,
// } from "../../constants/styles";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import MapViewDirections from "react-native-maps-directions";
// import Key from "../../constants/key";
// import { useNavigation } from "expo-router";

// const width = screenWidth;
// const cardWidth = width / 1.15;
// const SPACING_FOR_CARD_INSET = width * 0.1 - 30;

// const chargingSpotsList = [
//   {
//     coordinate: {
//       latitude: 22.6181,
//       longitude: 88.456747,
//     },
//     id: "1",
//     stationImage: require("../../assets/images/chargingStations/charging_station5.png"),
//     stationName: "BYD Charging Point",
//     stationAddress: "Near shell petrol station",
//     rating: 4.7,
//     totalStations: 8,
//     distance: "4.5 km",
//     isOpen: true,
//   },
//   {
//     coordinate: {
//       latitude: 22.6345648,
//       longitude: 88.4377279,
//     },
//     id: "2",
//     stationImage: require("../../assets/images/chargingStations/charging_station4.png"),
//     stationName: "TATA EStation",
//     stationAddress: "Near orange business hub",
//     rating: 3.9,
//     totalStations: 15,
//     distance: "5.7 km",
//     isOpen: false,
//   },
//   {
//     coordinate: {
//       latitude: 22.616357,
//       longitude: 88.442317,
//     },
//     id: "3",
//     stationImage: require("../../assets/images/chargingStations/charging_station5.png"),
//     stationName: "HP Charging Station",
//     stationAddress: "Near ananta business park",
//     rating: 4.9,
//     totalStations: 6,
//     distance: "2.1 km",
//     isOpen: true,
//   },
//   {
//     coordinate: {
//       latitude: 22.6341137,
//       longitude: 88.4497463,
//     },
//     id: "4",
//     stationImage: require("../../assets/images/chargingStations/charging_station4.png"),
//     stationName: "VIDA Station V1",
//     stationAddress: "Near opera street",
//     rating: 4.2,
//     totalStations: 15,
//     distance: "3.5 km",
//     isOpen: false,
//   },
// ];

// const fromDefaultLocation = {
//   latitude: 22.6293867,
//   longitude: 88.4354486,
// };

// const toDefaultLocation = {
//   latitude: 22.6242,
//   longitude: 88.453999,
// };

// const EnrouteChargingStationsScreen = () => {

//   const navigation = useNavigation();

//   const [showMap, setShowMap] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowMap(true);
//     }, 1000);
//     return () => { clearTimeout(timer) }
//   }, [])

//   const [markerList] = useState(chargingSpotsList);
//   const [region] = useState({
//     latitude: markerList[0].coordinate.latitude,
//     longitude: markerList[0].coordinate.longitude,
//     latitudeDelta: 0.03,
//     longitudeDelta: 0.03,
//   });

//   let mapAnimation = new Animated.Value(0);
//   let mapIndex = 0;

//   const _map = createRef();

//   useEffect(() => {
//     mapAnimation.addListener(({ value }) => {
//       let index = Math.floor(value / cardWidth + 0.3);
//       if (index >= markerList.length) {
//         index = markerList.length - 1;
//       }
//       if (index <= 0) {
//         index = 0;
//       }

//       clearTimeout(regionTimeout);

//       const regionTimeout = setTimeout(() => {
//         if (mapIndex !== index) {
//           mapIndex = index;
//           const { coordinate } = markerList[index];
//           _map.current.animateToRegion(
//             {
//               ...coordinate,
//               latitudeDelta: region.latitudeDelta,
//               longitudeDelta: region.longitudeDelta,
//             },
//             350
//           );
//         }
//       }, 10);
//     });
//   });

//   const interpolation = markerList.map((marker, index) => {
//     const inputRange = [
//       (index - 1) * cardWidth,
//       index * cardWidth,
//       (index + 1) * cardWidth,
//     ];

//     const scale = mapAnimation.interpolate({
//       inputRange,
//       outputRange: [1, 1.5, 1],
//       extrapolate: "clamp",
//     });

//     return { scale };
//   });

//   const onMarkerPress = (mapEventData) => {
//     const markerID = mapEventData._targetInst.return.key;

//     let x = markerID * cardWidth + markerID * 20;
//     if (Platform.OS === "ios") {
//       x = x - SPACING_FOR_CARD_INSET;
//     }

//     _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
//   };

//   const _scrollView = useRef(null);

//   return (
//     <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
//       <MyStatusBar />
//       <View style={{ flex: 1 }}>
//         {markersInfo()}
//         {backArrow()}
//         {chargingSpotsInfo()}
//       </View>
//     </View>
//   );

//   function backArrow() {
//     return (
//       <TouchableOpacity
//         activeOpacity={0.8}
//         onPress={() => navigation.pop()}
//         style={styles.backArrowWrapStyle}
//       >
//         <MaterialIcons
//           name={"arrow-back"}
//           size={24}
//           color={Colors.blackColor}
//           onPress={() => navigation.pop()}
//         />
//       </TouchableOpacity>
//     );
//   }

//   function markersInfo() {
//     const middlePoint = {
//       latitude: 22.6193867,
//       longitude: 88.4484486,
//     };
//     return (
//       <View style={{ flex: 1 }}>
//         {showMap && <MapView
//           ref={_map}
//           style={{ flex: 1 }}
//           initialRegion={region}
//           loadingEnabled
//           loadingIndicatorColor={Colors.primaryColor}
//         >
//           {markerList.map((marker, index) => {
//             const scaleStyle = {
//               transform: [
//                 {
//                   scale: interpolation[index].scale,
//                 },
//               ],
//             };
//             return (
//               showMap && <Marker
//                 key={index}
//                 coordinate={marker.coordinate}
//                 onPress={(e) => onMarkerPress(e)}
//               >
//                 <Animated.View style={styles.markerStyle}>
//                   <Animated.Image
//                     source={require("../../assets/images/icons/marker.png")}
//                     resizeMode="contain"
//                     style={[{ width: 30.0, height: 30.0 }, scaleStyle]}
//                   ></Animated.Image>
//                 </Animated.View>
//               </Marker>
//             );
//           })}
//           {Platform.OS == 'ios'
//             ?
//             <Polyline
//               coordinates={[fromDefaultLocation, middlePoint, toDefaultLocation]}
//               strokeColor={Colors.primaryColor}
//               strokeWidth={3}
//             />
//             :
//             <MapViewDirections
//               origin={fromDefaultLocation}
//               destination={toDefaultLocation}
//               apikey={Key.apiKey}
//               lineCap="square"
//               strokeColor={Colors.primaryColor}
//               strokeWidth={3}
//             />
//           }
//           {showMap && <Marker coordinate={fromDefaultLocation}>
//             <Image
//               source={require("../../assets/images/icons/marker1.png")}
//               style={{ width: 38.0, height: 38.0, resizeMode: "contain" }}
//             />
//           </Marker>}
//           {showMap && <Marker coordinate={toDefaultLocation}>
//             <Image
//               source={require("../../assets/images/icons/marker3.png")}
//               style={{ width: 38.0, height: 38.0, resizeMode: "contain" }}
//             />
//           </Marker>}
//         </MapView>}
//       </View>
//     );
//   }

//   function chargingSpotsInfo() {
//     return <View style={styles.chargingInfoWrapStyle}>{chargingSpots()}</View>;
//   }

//   function chargingSpots() {
//     return (
//       <Animated.ScrollView
//         ref={_scrollView}
//         horizontal
//         pagingEnabled
//         scrollEventThrottle={16}
//         showsHorizontalScrollIndicator={false}
//         snapToInterval={cardWidth + 25}
//         decelerationRate="fast"
//         snapToAlignment="center"
//         style={{ paddingVertical: Sizes.fixPadding }}
//         contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding }}
//         onScroll={Animated.event(
//           [
//             {
//               nativeEvent: {
//                 contentOffset: {
//                   x: mapAnimation,
//                 },
//               },
//             },
//           ],
//           { useNativeDriver: false }
//         )}
//       >
//         {markerList.map((item, index) => (
//           <TouchableOpacity
//             activeOpacity={0.8}
//             onPress={() => navigation.push("chargingStationDetail/chargingStationDetailScreen")}
//             key={index}
//             style={styles.enrouteChargingStationWrapStyle}
//           >
//             <Image
//               source={item.stationImage}
//               style={styles.enrouteChargingStationImage}
//             />
//             <View style={styles.enrouteStationOpenCloseWrapper}>
//               <Text style={{ ...Fonts.whiteColor18Regular }}>
//                 {item.isOpen ? "Open" : "Closed"}
//               </Text>
//             </View>
//             <View style={{ flex: 1 }}>
//               <View style={{ margin: Sizes.fixPadding }}>
//                 <Text
//                   numberOfLines={1}
//                   style={{ ...Fonts.blackColor18SemiBold }}
//                 >
//                   {item.stationName}
//                 </Text>
//                 <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
//                   {item.stationAddress}
//                 </Text>
//                 <View
//                   style={{
//                     marginTop: Sizes.fixPadding,
//                     ...commonStyles.rowAlignCenter,
//                   }}
//                 >
//                   <View style={{ ...commonStyles.rowAlignCenter }}>
//                     <Text style={{ ...Fonts.blackColor18Medium }}>
//                       {item.rating}
//                     </Text>
//                     <MaterialIcons
//                       name="star"
//                       color={Colors.yellowColor}
//                       size={20}
//                     />
//                   </View>
//                   <View
//                     style={{
//                       marginLeft: Sizes.fixPadding * 2.0,
//                       ...commonStyles.rowAlignCenter,
//                       flex: 1,
//                     }}
//                   >
//                     <View style={styles.primaryColorDot} />
//                     <Text
//                       numberOfLines={1}
//                       style={{
//                         marginLeft: Sizes.fixPadding,
//                         ...Fonts.grayColor14Medium,
//                         flex: 1,
//                       }}
//                     >
//                       {item.totalStations} Charging Points
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//               <View
//                 style={{
//                   ...commonStyles.rowAlignCenter,
//                   paddingLeft: Sizes.fixPadding,
//                   marginTop: Sizes.fixPadding,
//                 }}
//               >
//                 <Text
//                   numberOfLines={1}
//                   style={{
//                     ...Fonts.blackColor16Medium,
//                     flex: 1,
//                     marginRight: Sizes.fixPadding - 5.0,
//                   }}
//                 >
//                   {item.distance}
//                 </Text>
//                 <TouchableOpacity
//                   activeOpacity={0.8}
//                   onPress={() => {
//                     navigation.push("direction/directionScreen");
//                   }}
//                   style={styles.getDirectionButton}
//                 >
//                   <Text style={{ ...Fonts.whiteColor16Medium }}>
//                     Get Direction
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </Animated.ScrollView>
//     );
//   }
// };

const EnrouteChargingStationsScreen = () => {};
export default EnrouteChargingStationsScreen;

// const styles = StyleSheet.create({
//   enrouteChargingStationWrapStyle: {
//     borderRadius: Sizes.fixPadding,
//     backgroundColor: Colors.bodyBackColor,
//     ...commonStyles.shadow,
//     borderColor: Colors.extraLightGrayColor,
//     borderWidth: 0.1,
//     borderTopWidth: 1.0,
//     flexDirection: "row",
//     marginHorizontal: Sizes.fixPadding,
//     marginBottom: Sizes.fixPadding,
//     width: cardWidth,
//   },
//   enrouteChargingStationImage: {
//     width: screenWidth / 3.2,
//     height: "100%",
//     borderTopLeftRadius: Sizes.fixPadding,
//     borderBottomLeftRadius: Sizes.fixPadding,
//   },
//   enrouteStationOpenCloseWrapper: {
//     position: "absolute",
//     left: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     paddingHorizontal: Sizes.fixPadding * 2.0,
//     borderTopLeftRadius: Sizes.fixPadding,
//     borderBottomRightRadius: Sizes.fixPadding,
//   },
//   primaryColorDot: {
//     width: 10.0,
//     height: 10.0,
//     borderRadius: 5.0,
//     backgroundColor: Colors.primaryColor,
//   },
//   markerStyle: {
//     alignItems: "center",
//     justifyContent: "center",
//     width: 45.0,
//     height: 45.0,
//   },
//   getDirectionButton: {
//     backgroundColor: Colors.primaryColor,
//     paddingHorizontal: Sizes.fixPadding + 5.0,
//     paddingVertical: Sizes.fixPadding - 2.0,
//     borderTopLeftRadius: Sizes.fixPadding,
//     borderBottomRightRadius: Sizes.fixPadding,
//   },
//   chargingInfoWrapStyle: {
//     position: "absolute",
//     bottom: 0.0,
//     left: 0.0,
//     right: 0.0,
//   },
//   backArrowWrapStyle: {
//     width: 40.0,
//     height: 40.0,
//     backgroundColor: Colors.whiteColor,
//     borderRadius: 20.0,
//     ...commonStyles.shadow,
//     position: "absolute",
//     top: 20.0,
//     left: 20.0,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
