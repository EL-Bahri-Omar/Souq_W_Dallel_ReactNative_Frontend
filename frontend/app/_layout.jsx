import { useColorScheme } from 'react-native';
import { Tabs, Stack } from "expo-router";
import { Colors } from "../constants/Colors";
import { StatusBar } from "expo-status-bar";
import { Provider, useSelector } from "react-redux";
import { store } from "../store";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadToken, clearError } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <InitializeAuth />
      <StatusBar style="auto" />
      <AppContent />
    </Provider>
  );
}

function InitializeAuth() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const loadAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user?.token) {
            dispatch(loadToken({ token, user }));
          }
        } catch {
          await AsyncStorage.multiRemove(['token', 'user']);
        }
      }
    };
    
    loadAuth();
  }, []);
  
  return null;
}

function AppContent() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { token } = useSelector((state) => state.auth);
  
  if (!token) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="verify-account" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="reset-password-verify" />
        <Stack.Screen name="index" />
      </Stack>
    );
  }
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.navBackground,
          paddingTop: 10,
          height: 90,
        },
        tabBarActiveTintColor: theme.iconColorFocused,
        tabBarInactiveTintColor: theme.iconColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="(dashboard)/profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Stack.Screen name="(dashboard)/edit-profile" options={{ href: null }}/>
      <Stack.Screen name="(auth)" options={{ href: null }}/>
      <Stack.Screen name="verify-account" options={{ href: null }}/>
      <Stack.Screen name="reset-password" options={{ href: null }}/>
      <Stack.Screen name="reset-password-verify" options={{ href: null }}/>
      
    </Tabs>
  );
}