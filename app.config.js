import "dotenv/config";

export default {
  expo: {
    name: "sales-booster-app",
    slug: "sales-booster-app",
    version: "1.0.0",
    scheme: "salesboosterapp",
    android: {
      package: "com.tmkcomputers.salesboosterapp",
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE"
      ],
    },
    extra: {
      apiUrl: process.env.API_URL || "https://rent-api.tmkcomputers.in",
      env: process.env.ENV || "production",
      nodeEnv: process.env.NODE_ENV || "production",
    },
  },
};
