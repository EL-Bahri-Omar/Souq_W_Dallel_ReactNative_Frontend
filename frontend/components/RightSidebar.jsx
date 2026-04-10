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
import { useTheme } from "../constants/ThemeContext";

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

const statusFilters = [
  { id: "all", label: "Toutes", icon: "list-outline" },
  { id: "active", label: "Actives", icon: "flame-outline" },
  { id: "ended", label: "Terminées", icon: "checkmark-done-outline" },
];

const RightSidebar = ({
  visible,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedStatus = "all",
  onSelectStatus,
}) => {
  const { colorScheme } = useTheme();
  const theme = Colors[colorScheme] ?? Colors.light;

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
        <View style={[styles.sidebar, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
            <ThemedText title style={styles.headerTitle}>Filtres</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterList}>
            {/* Status Filter */}
            {onSelectStatus && (
              <>
                <ThemedText style={[styles.sectionTitle, { color: theme.mutedText }]}>
                  Statut
                </ThemedText>
                {statusFilters.map((status) => (
                  <TouchableOpacity
                    key={status.id}
                    style={[
                      styles.filterItem,
                      { backgroundColor: theme.uiBackground },
                      selectedStatus === status.id && styles.filterItemActive,
                    ]}
                    onPress={() => {
                      onSelectStatus(status.id);
                    }}
                  >
                    <Ionicons
                      name={status.icon}
                      size={20}
                      color={
                        selectedStatus === status.id ? Colors.primary : theme.text
                      }
                    />
                    <ThemedText
                      style={[
                        styles.filterItemText,
                        { color: theme.text },
                        selectedStatus === status.id &&
                          styles.filterItemTextActive,
                      ]}
                    >
                      {status.label}
                    </ThemedText>
                    {selectedStatus === status.id && (
                      <Ionicons name="checkmark" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
                
                <View style={[styles.sectionDivider, { borderBottomColor: theme.borderColor }]} />
              </>
            )}

            {/* Category Filter */}
            <ThemedText style={[styles.sectionTitle, { color: theme.mutedText }]}>
              Catégories
            </ThemedText>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterItem,
                  { backgroundColor: theme.uiBackground },
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
                    selectedCategory === category.id ? Colors.primary : theme.text
                  }
                />
                <ThemedText
                  style={[
                    styles.filterItemText,
                    { color: theme.text },
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
  },
  sectionDivider: {
    borderBottomWidth: 1,
    marginVertical: 15,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
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
  },
  filterItemTextActive: {
    color: Colors.primary,
    fontWeight: "500",
  },
});