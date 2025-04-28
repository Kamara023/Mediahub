import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from '../tabnavigator/Tabs';
import DrawerNavigator from '../Drawer/DrawerNavigator';
import PresentationScreen from '../screens/PresentationScreen';
import Splashscreen from '../screens/Splashscreen';
import Onboarding from '../screens/Onboarding';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <Stack.Navigator initialRouteName="Splashscreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splashscreen" component={Splashscreen} />
            <Stack.Screen name="PresentationScreen" component={PresentationScreen} />
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
        </Stack.Navigator>
    );
}
