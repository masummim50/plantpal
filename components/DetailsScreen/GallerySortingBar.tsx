import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const GallerySortingBar = ({
  toggleView,
  viewMode,
}: {
  toggleView: () => void;
  viewMode: "list" | "grid";
}) => {
  const theme = useColorScheme();
  const color = theme === "dark" ? Colors.dark : Colors.light;
  return (
    <View style={[styles.topBar, { backgroundColor: color.uiBackground }]}>
      {/* <TouchableOpacity onPress={toggleSort} style={styles.toggleButton}>
              <Ionicons
                name={sortNewestFirst ? "arrow-down" : "arrow-up"}
                size={18}
                color={color.iconColor}
              />
              <Text style={[styles.toggleText, { color: color.text }]}>
                {sortNewestFirst ? "Newest first" : "Oldest first"}
              </Text>
            </TouchableOpacity> */}

      <TouchableOpacity onPress={toggleView} style={styles.toggleButton}>
        <Ionicons
          name={viewMode === "list" ? "grid-outline" : "list-outline"}
          size={18}
          color={color.iconColor}
        />
        <Text style={[styles.toggleText, { color: color.text }]}>
          {viewMode === "list" ? "Grid" : "List"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GallerySortingBar;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleText: {
    marginLeft: 6,
    fontSize: 14,
  },
});
