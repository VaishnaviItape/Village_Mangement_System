// src/utils/timeFormatter.js
export const formatServerTime = (timeString) => {
  if (!timeString) return null;

  try {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // ✅ ensures AM/PM format
    });
  } catch (err) {
    console.error("Error formatting time:", err);
    return timeString;
  }
};

