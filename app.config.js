import "dotenv/config";

export default {
  expo: {
    name: "Village Management System",
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

      eas: {
        projectId: "10a91376-7fd0-4593-86d3-358c14abca6f"
      }
    },
  },
};
