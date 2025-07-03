import { Colors } from '@/constants/Colors';
import React from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

export type FilterType = 'oldest' | 'newest';

interface FilterSelectorProps {
  order: FilterType;
  setOrder: React.Dispatch<React.SetStateAction<FilterType>>;
  filter: boolean;
  setFilter: React.Dispatch<React.SetStateAction<boolean>>;

}
export default function LogFilters({order, setOrder, filter, setFilter}: FilterSelectorProps) {
    const filters: { label: string; value: FilterType }[] = [
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Newest First', value: 'newest' },
  ];
  const theme = useColorScheme();
  const color = Colors[theme || 'light'];
  return (
    <View style={[styles.container]}>
      {filters.map((filter) => (
        <Pressable
          key={filter.value}
          onPress={() => setOrder(filter.value)}
          style={[
            styles.button,
            {
              backgroundColor: order === filter.value ? Colors.primary : 'transparent', borderColor: Colors.primary}
            // selectedFilter === filter.value && styles.selectedButton,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {color: order === filter.value ? 'white' : color.text}
            //   selectedFilter === filter.value && styles.selectedText,
            ]}
          >
            {filter.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedButton: {
    // Add your highlight style here, like backgroundColor or borderColor
  },
  buttonText: {
    fontSize: 14,
  },
  selectedText: {
    // Add your selected text style here
  },
});