import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "./ThemedText";
import { Colors } from "../constants/Colors";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const LeftSidebar = ({ visible, onClose }) => {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const isTransporter = user?.role?.toUpperCase() === "TRANSPORTER";

  const getMenuItems = () => {
    if (isAdmin) {
      return [
        { id: "home", label: "Accueil", icon: "home-outline", route: "/" },
        {
          id: "notifications",
          label: "Notifications",
          icon: "notifications-outline",
          route: "/(dashboard)/notifications",
        },
        {
          id: "create-auction",
          label: "Créer une enchère",
          icon: "add-circle-outline",
          route: "/create-auction",
        },
        {
          id: "my-auctions",
          label: "Mes enchères",
          icon: "list-outline",
          route: "/(dashboard)/my-auctions",
        },
        {
          id: "my-parcels",
          label: "Mes colis",
          icon: "cube-outline",
          route: "/(dashboard)/my-parcels",
        },
        {
          id: "admin-dashboard",
          label: "Dashboard Admin",
          icon: "stats-chart-outline",
          route: "/(admin)",
        },
        {
          id: "profile",
          label: "Profil",
          icon: "person-outline",
          route: "/(dashboard)/profile",
        },
      ];
    } else if (isTransporter) {
      return [
        {
          id: "home",
          label: "Accueil",
          icon: "home-outline",
          route: "/transporter",
        },
        {
          id: "transporter-parcels",
          label: "Mes livraisons",
          icon: "cube-outline",
          route: "/transporter/parcels",
        },
        {
          id: "profile",
          label: "Profil",
          icon: "person-outline",
          route: "/(dashboard)/profile",
        },
      ];
    } else {
      return [
        { id: "home", label: "Accueil", icon: "home-outline", route: "/" },
        {
          id: "notifications",
          label: "Notifications",
          icon: "notifications-outline",
          route: "/(dashboard)/notifications",
        },
        {
          id: "create-auction",
          label: "Créer une enchère",
          icon: "add-circle-outline",
          route: "/create-auction",
        },
        {
          id: "my-auctions",
          label: "Mes enchères",
          icon: "list-outline",
          route: "/(dashboard)/my-auctions",
        },
        {
          id: "my-parcels",
          label: "Mes colis",
          icon: "cube-outline",
          route: "/(dashboard)/my-parcels",
        },
        {
          id: "profile",
          label: "Profil",
          icon: "person-outline",
          route: "/(dashboard)/profile",
        },
      ];
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (route) => {
    onClose();
    router.push(route);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sidebar}>
          <LinearGradient
            colors={[Colors.primary, "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Ionicons name="hammer" size={32} color="#fff" />
              <ThemedText style={styles.headerTitle}>Menu</ThemedText>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.route)}
              >
                <Ionicons name={item.icon} size={24} color={Colors.primary} />
                <ThemedText style={styles.menuItemText}>
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default LeftSidebar;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.75,
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  menuList: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
});