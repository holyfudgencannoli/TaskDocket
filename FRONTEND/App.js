import 'react-native-reanimated';
import Navigation from './Navigation.js';
import { useColorScheme } from './hooks/use-color-scheme';
import { AuthProvider } from './scripts/AuthContext';
import * as React from 'react'
import { Provider as PaperProvider } from 'react-native-paper';
import { useEffect } from 'react';
import { useRef } from 'react';
// import notifee, {AuthorizationStatus} from '@notifee/react-native';
// import { createChannel } from './scripts/NotificationScheduling.ts';

async function requestPermission() {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        createChannel()
        console.log('Notification permission granted.');
    } else {
        console.log('Notification permission denied.');
    }
}

export default function App() {
    const colorScheme = useColorScheme();
    const notificationListener = useRef();
    const responseListener = useRef();
    

    useEffect(() => {
        requestPermission()
    }, [])
 
  return (
        <AuthProvider>
            <PaperProvider>
                <Navigation />
            </PaperProvider>
        </AuthProvider>
  );
}

