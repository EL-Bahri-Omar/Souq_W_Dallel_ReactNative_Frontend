import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import ThemedText from './ThemedText';
import { Colors } from '../constants/Colors';

const AuctionFilters = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.filterButton,
            selectedCategory === category.id && styles.filterButtonActive
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <ThemedText style={[
            styles.filterText,
            selectedCategory === category.id && styles.filterTextActive
          ]}>
            {category.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AuctionFilters;