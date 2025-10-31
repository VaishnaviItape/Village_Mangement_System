import { View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../constants/styles";

const Rating = ({ rating }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <MaterialIcons
        name="star"
        size={18.0}
        color={rating >= 1 ? Colors.yellowColor : Colors.grayColor}
      />
      <MaterialIcons
        name="star"
        size={18.0}
        color={rating >= 2 ? Colors.yellowColor : Colors.grayColor}
      />
      <MaterialIcons
        name="star"
        size={18.0}
        color={rating >= 3 ? Colors.yellowColor : Colors.grayColor}
      />
      <MaterialIcons
        name="star"
        size={18.0}
        color={rating >= 4 ? Colors.yellowColor : Colors.grayColor}
      />
      <MaterialIcons
        name="star"
        size={18.0}
        color={rating >= 5 ? Colors.yellowColor : Colors.grayColor}
      />
    </View>
  );
};

export default Rating;