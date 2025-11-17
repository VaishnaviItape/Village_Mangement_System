import "dotenv/config";

export default {
  expo: {
    name: "village-management-system",
    slug: "village-management-system",
    version: "1.0.0",
    scheme: "villagemanagementsystem",

    android: {
      package: "com.villagemanagementsystem",
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE"
      ],
    },

    extra: {
      apiUrl: process.env.API_URL || "https://village-management-api.in",
      env: process.env.ENV || "production",
      nodeEnv: process.env.NODE_ENV || "production",
    },
  },
};
