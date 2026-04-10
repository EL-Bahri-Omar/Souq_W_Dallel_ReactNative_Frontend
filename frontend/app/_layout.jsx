import { useTheme, ThemeProvider } from "../constants/ThemeContext";
import { Tabs, Stack, useRouter, Redirect } from "expo-router";
import { Colors } from "../constants/Colors";
import { StatusBar } from "expo-status-bar";
import { Provider, useSelector } from "react-redux";
import { persistor, store } from "../store";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadToken } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { StyleSheet, View, Text } from "react-native";
import { fetchNotifications } from "../store/slices/notificationSlice";
import { PersistGate } from "redux-persist/integration/react";
import { StripeProvider } from "../lib/stripe";
import {
  startExpirationChecker,
  stopExpirationChecker,
} from "../store/services/expirationService";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <InitializeAuth />
          <StatusBar style="auto" />
          <AppContent />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

function InitializeAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userStr = await AsyncStorage.getItem("user");

        if (token && userStr) {
          const user = JSON.parse(userStr);
          console.log("Loaded user from storage:", user);
          dispatch(loadToken({ token, user }));
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
      }
    };

    loadAuth();
  }, []);

  return null;
}

function AppContent() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { token, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector(
    (state) => state.notifications || { unreadCount: 0 },
  );
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTransporter, setIsTransporter] = useState(false);

  useEffect(() => {
    const adminCheck = user?.role?.toUpperCase() === "ADMIN";
    const transporterCheck = user?.role?.toUpperCase() === "TRANSPORTER";
    setIsAdmin(adminCheck);
    setIsTransporter(transporterCheck);
  }, [user]);

  useEffect(() => {
    if (!token || !user) return;

    if (user.role?.toUpperCase() === "TRANSPORTER") {
      router.replace("/(transporter)/home");
    }

    if (user.role?.toUpperCase() === "ADMIN") {
      router.replace("/(admin)/dashboard");
    }
  }, [token, user]);

  useEffect(() => {
    if (!token || !user?.id) return;
    const fetchData = () => {
      dispatch(fetchNotifications(user.id));
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [token, user?.id]);

  useEffect(() => {
    if (token && user) {
      startExpirationChecker();
      return () => stopExpirationChecker();
    }
  }, [token, user]);

  if (!token) {
    return (
      <>
        <Redirect href="/(auth)/login" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="verify-account" />
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="reset-password-verify" />
          <Stack.Screen name="index" options={{ href: null }} />
        </Stack>
      </>
    );
  }

  // Determine tab items based on user role
  const getTabScreens = () => {
    if (isAdmin) {
      return [
        { name: "(dashboard)/profile", title: "Profil", icon: "person" },
        { name: "(admin)", title: "Dashboard", icon: "stats-chart" },
      ];
    } else if (isTransporter) {
      return [
        {
          name: "(transporter)/home",
          title: "Accueil",
          icon: "home",
        },
        { name: "(dashboard)/profile", title: "Profil", icon: "person" },
        {
          name: "(transporter)/parcels",
          title: "Livraisons",
          icon: "cube",
        },
      ];
    } else {
      return [
        { name: "index", title: "Accueil", icon: "home" },
        {
          name: "(dashboard)/notifications",
          title: "Notifications",
          icon: "notifications",
        },
        { name: "(dashboard)/profile", title: "Profil", icon: "person" },
      ];
    }
  };

  const tabScreens = getTabScreens();

  return (
    <StripeProvider publishableKey="pk_test_51QyUfWH7Cs6mHwoSdAN9wXiSRsKdfvXifEu4gjQwyQNhl2gUNnE6ZANcuJeIRXxMXsB7lAsRZHnbioJpkzzHhxaq00qvXRYf6G">
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
        {tabScreens.map((screen) => (
          <Tabs.Screen
            key={screen.name}
            name={screen.name}
            options={{
              title: screen.title,
              tabBarIcon: ({ focused, color }) => (
                <View style={{ position: "relative" }}>
                  <Ionicons
                    name={focused ? screen.icon : `${screen.icon}-outline`}
                    size={24}
                    color={color}
                  />
                  {screen.name === "(dashboard)/notifications" &&
                    unreadCount > 0 && (
                      <View
                        style={[
                          styles.notificationBadge,
                          { backgroundColor: Colors.warning },
                        ]}
                      >
                        <Text style={styles.notificationBadgeText}>
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </Text>
                      </View>
                    )}
                </View>
              ),
            }}
          />
        ))}

        {/* Hidden screens from Admin */}
        {isAdmin && (
          <Tabs.Screen name="(transporter)/parcels" options={{ href: null }} />
        )}
        {isAdmin && (
          <Tabs.Screen name="(transporter)/home" options={{ href: null }} />
        )}
        {isAdmin && (
          <Tabs.Screen name="index" options={{ href: null }} />
        )}
        {isAdmin && (
          <Tabs.Screen name="(dashboard)/notifications" options={{ href: null }} />
        )}

        {/* Hidden screens from Transporter */}
        {isTransporter && (
          <Tabs.Screen
            name="(dashboard)/notifications"
            options={{ href: null }}
          />
        )}
        {isTransporter && (
          <Tabs.Screen name="(admin)" options={{ href: null }} />
        )}
        {isTransporter && <Tabs.Screen name="index" options={{ href: null }} />}

        {/* Hidden screens from User */}
        {!isTransporter && !isAdmin && (
          <Tabs.Screen name="(admin)" options={{ href: null }} />
        )}
        {!isTransporter && !isAdmin && (
          <Tabs.Screen name="(transporter)/parcels" options={{ href: null }} />
        )}
        {!isTransporter && !isAdmin && (
          <Tabs.Screen name="(transporter)/home" options={{ href: null }} />
        )}

        {/* Hidden screens */}
        <Tabs.Screen name="create-auction" options={{ href: null }} />
        <Tabs.Screen name="(dashboard)/my-auctions" options={{ href: null }} />
        <Tabs.Screen name="(dashboard)/my-parcels" options={{ href: null }} />
        <Tabs.Screen name="(dashboard)/edit-profile" options={{ href: null }} />

        <Tabs.Screen name="edit-auction/[id]" options={{ href: null }} />
        <Tabs.Screen name="auction-details/[id]" options={{ href: null }} />
        <Tabs.Screen name="parcel-details/[id]" options={{ href: null }} />
        <Tabs.Screen name="(auth)" options={{ href: null }} />
        <Tabs.Screen name="(admin)/_layout" options={{ href: null }} />
        <Tabs.Screen name="(transporter)" options={{ href: null }} />
        <Tabs.Screen name="verify-account" options={{ href: null }} />
        <Tabs.Screen name="reset-password" options={{ href: null }} />
        <Tabs.Screen name="reset-password-verify" options={{ href: null }} />
      </Tabs>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -10,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
