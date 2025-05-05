import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from '../tabnavigator/Tabs';
import DrawerNavigator from '../Drawer/DrawerNavigator';
import PresentationScreen from '../screens/PresentationScreen';
import Splashscreen from '../screens/Splashscreen';
import Onboarding from '../screens/Onboarding';
import LoginScreen from '../auth/LoginScreen';
import SignUpScreen from '../auth/SignUpScreen';
import ForgotPasswordScreen from '../auth/ForgotPasswordScreen';
import DetailScreen from '../screens/DetailScreen';
import Paramètre from '../screens/Paramètre';
import ModifierProfile from '../screens/ModifierProfile';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <Stack.Navigator initialRouteName="Splashscreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splashscreen" component={Splashscreen} />
            <Stack.Screen name="PresentationScreen" component={PresentationScreen} />
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SinUpScreen" component={SignUpScreen}/>
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen}/>
            <Stack.Screen name="DetailScreen" component={DetailScreen}/>
            <Stack.Screen name="Paramètre" component={Paramètre}/>
            <Stack.Screen name="ModifierProfile" component={ModifierProfile}/>



        </Stack.Navigator>
    );
}
