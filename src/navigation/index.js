import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home';
import IdCaptureScreen from '../screens/IdCapture';
import SelfieCaptureScreen from '../screens/SelfieCapture';

const Stack = createNativeStackNavigator();

const StackNavigator = () => (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="IdCapture" component={IdCaptureScreen}/>
        <Stack.Screen name="SelfieCapture" component={SelfieCaptureScreen}/>
       </Stack.Navigator>
);

export default StackNavigator;