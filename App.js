import 'react-native-gesture-handler';
import Navigation from './src/navigation/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <>
    <NavigationContainer>
      <Navigation/>
    </NavigationContainer>
    <Toast/>
    </>
  )
}

