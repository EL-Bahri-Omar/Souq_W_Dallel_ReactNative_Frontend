import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "./ThemedText";
import { Colors } from "../constants/Colors";

const { width: screenWidth } = Dimensions.get("window");

const categories = [
  { id: "all", label: "Toutes", icon: "apps-outline" },
  { id: "electronics", label: "Électronique", icon: "tv-outline" },
  { id: "furniture", label: "Meubles", icon: "bed-outline" },
  { id: "vehicles", label: "Véhicules", icon: "car-outline" },
  { id: "real-estate", label: "Immobilier", icon: "home-outline" },
  { id: "collectibles", label: "Collection", icon: "albums-outline" },
  { id: "art", label: "Art", icon: "color-palette-outline" },
  { id: "jewelry", label: "Bijoux", icon: "diamond-outline" },
  { id: "clothing", label: "Vêtements", icon: "shirt-outline" },
  { id: "sports", label: "Sports", icon: "basketball-outline" },
  { id: "general", label: "Général", icon: "apps-outline" },
];

const RightSidebar = ({
  visible,
  onClose,
  selectedCategory,
  onSelectCategory,
}) => {
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
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Filtres</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterList}>
            <ThemedText style={styles.sectionTitle}>Catégories</ThemedText>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterItem,
                  selectedCategory === category.id && styles.filterItemActive,
                ]}
                onPress={() => {
                  onSelectCategory(category.id);
                  onClose();
                }}
              >
                <Ionicons
                  name={category.icon}
                  size={20}
                  color={
                    selectedCategory === category.id ? Colors.primary : "#666"
                  }
                />
                <ThemedText
                  style={[
                    styles.filterItemText,
                    selectedCategory === category.id &&
                      styles.filterItemTextActive,
                  ]}
                >
                  {category.label}
                </ThemedText>
                {selectedCategory === category.id && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default RightSidebar;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sidebar: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.75,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  filterList: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: "#666",
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    gap: 12,
  },
  filterItemActive: {
    backgroundColor: Colors.primary + "10",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  filterItemText: {
    fontSize: 15,
    flex: 1,
    color: "#333",
  },
  filterItemTextActive: {
    color: Colors.primary,
    fontWeight: "500",
  },
});