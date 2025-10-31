import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/styles';

const MyStatusBar = () => {
  return (
    <SafeAreaView style={{backgroundColor: Colors.primaryColor}}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.primaryColor}
        barStyle={'light-content'}
      />
    </SafeAreaView>
  );
};

export default MyStatusBar;