import { ActivityIndicator, View, Dimensions } from "react-native";

export const {height} = Dimensions.get('window')

const Loader = ({size}) => {

  return (
    <View>
       <ActivityIndicator
            animating={true}
            color="#067C60"
            size={size}
          />
    </View>
  );
};


export default Loader;
