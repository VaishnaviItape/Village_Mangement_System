import { Dimensions } from "react-native";

export const Colors = {
  primaryColor: "#067C60",
  blackColor: "#000000",
  whiteColor: "#FFFFFF",
  grayColor: "#828282",
  lightBlackColor: "#333333",
  bodyBackColor: "#F2F2F2",
  yellowColor: "#F2C94C",
  extraLightGrayColor: "#e0e0e0",
  redColor:'#FF0606'
};

export const FontFamily = {
  Regular: "Poppins-Regular",
  Medium: "Poppins-Medium",
  SemiBold: "Poppins-SemiBold",
  Bold: "Poppins-Bold",
};

export const Fonts = {
  whiteColor16Regular: {
    color: Colors.whiteColor,
    fontSize: 16.0,
    fontFamily: FontFamily.Regular,
    includeFontPadding: false,
  },

  whiteColor18Regular: {
    color: Colors.whiteColor,
    fontSize: 18.0,
    fontFamily: FontFamily.Regular,
    includeFontPadding: false,
  },

  whiteColor14Medium: {
    color: Colors.whiteColor,
    fontSize: 14.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  whiteColor16Medium: {
    color: Colors.whiteColor,
    fontSize: 16.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  whiteColor18Medium: {
    color: Colors.whiteColor,
    fontSize: 18.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  whiteColor18SemiBold: {
    color: Colors.whiteColor,
    fontSize: 18.0,
    fontFamily: FontFamily.SemiBold,
    includeFontPadding: false,
  },

  whiteColor20SemiBold: {
    color: Colors.whiteColor,
    fontSize: 20.0,
    fontFamily: FontFamily.SemiBold,
    includeFontPadding: false,
  },

  whiteColor22SemiBold: {
    color: Colors.whiteColor,
    fontSize: 22.0,
    fontFamily: FontFamily.SemiBold,
    includeFontPadding: false,
  },

  whiteColor38SemiBold: {
    color: Colors.whiteColor,
    fontSize: 38.0,
    fontFamily: FontFamily.SemiBold,
    includeFontPadding: false,
  },

  blackColor16Regular:{
    color: Colors.blackColor,
    fontSize: 16.0,
    fontFamily: FontFamily.Regular,
    includeFontPadding: false,
  },

  blackColor14Medium: {
    color: Colors.blackColor,
    fontSize: 14.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  blackColor16Medium: {
    color: Colors.blackColor,
    fontSize: 16.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  blackColor18Medium: {
    color: Colors.blackColor,
    fontSize: 18.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  blackColor16SemiBold: {
    color: Colors.blackColor,
    fontSize: 16.0,
    fontFamily: FontFamily.SemiBold,
    includeFontPadding: false,
  },

  blackColor18SemiBold: {
    color: Colors.blackColor,
    fontSize: 18.0,
    fontFamily: FontFamily.SemiBold,
    includeFontPadding: false,
  },

  blackColor20SemiBold: {
    color: Colors.blackColor,
    fontSize: 20.0,
    fontFamily: FontFamily.SemiBold,
    includeFontPadding: false,
  },

  blackColor26SemiBold: {
    color: Colors.blackColor,
    fontSize: 26.0,
    fontFamily: FontFamily.SemiBold,
    includeFontPadding: false,
  },

  grayColor14Regular: {
    color: Colors.grayColor,
    fontSize: 14.0,
    fontFamily: FontFamily.Regular,
    includeFontPadding: false,
  },

  grayColor16Regular: {
    color: Colors.grayColor,
    fontSize: 16.0,
    fontFamily: FontFamily.Regular,
    includeFontPadding: false,
  },

  grayColor18Regular: {
    color: Colors.grayColor,
    fontSize: 18.0,
    fontFamily: FontFamily.Regular,
    includeFontPadding: false,
  },

  grayColor12Medium: {
    color: Colors.grayColor,
    fontSize: 12.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  grayColor14Medium: {
    color: Colors.grayColor,
    fontSize: 14.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  grayColor15Medium: {
    color: Colors.grayColor,
    fontSize: 15.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  grayColor16Medium: {
    color: Colors.grayColor,
    fontSize: 16.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  grayColor18Medium: {
    color: Colors.grayColor,
    fontSize: 18.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  grayColor18SemiBold: {
    color: Colors.grayColor,
    fontSize: 18.0,
    fontFamily: FontFamily.SemiBold,
    includeFontPadding: false,
  },

  primaryColor16Medium: {
    color: Colors.primaryColor,
    fontSize: 16.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  primaryColor18Medium: {
    color: Colors.primaryColor,
    fontSize: 18.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  },

  primaryColor16SemiBold: {
    color: Colors.primaryColor,
    fontSize: 16.0,
    fontFamily: FontFamily.SemiBold,
    includeFontPadding: false,
  },

  primaryColor18SemiBold: {
    color: Colors.primaryColor,
    fontSize: 18.0,
    fontFamily: FontFamily.SemiBold,
    includeFontPadding: false,
  },

  primaryColor22SemiBold: {
    color: Colors.primaryColor,
    fontSize: 22.0,
    fontFamily: FontFamily.SemiBold,
    includeFontPadding: false,
  },

  redColor18Medium:{
    color:Colors.redColor,
    fontSize: 18.0,
    fontFamily: FontFamily.Medium,
    includeFontPadding: false,
  }
};

export const Sizes = {
  fixPadding: 12.0,
};

export const commonStyles = {
  shadow: {
    elevation: 3.0,
    shadowColor: Colors.blackColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
  },
  rowSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowAlignCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding * 1.5,
  },
};

export const screenWidth = Dimensions.get("window").width;

export const screenHeight = Dimensions.get("window").height;
