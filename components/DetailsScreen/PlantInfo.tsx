import { Colors } from "@/constants/Colors";
import { formatPrettyDate, getDaysDifference } from "@/functions/Date";
import { Plant } from "@/interfaces/plantInterface";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const PlantInfo = ({
  plant,
  handleDeleteClick,
}: {
  plant: Plant;
  handleDeleteClick: () => void;
}) => {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"];
  const daysAgo = getDaysDifference(new Date(plant.plantedAt)).time;
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContent}>
        <Text style={[styles.title, { color: color.title }]}>{plant.name}</Text>
        <Text style={[styles.subtitle, { color: color.text }]}>
          Planted on {formatPrettyDate(plant.plantedAt)}
        </Text>
        <Text style={[styles.subtitle, { color: color.text }]}>
          {daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleDeleteClick}
        style={{
          backgroundColor: "#cc475a",
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Delete Plant</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlantInfo;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },leftContent: {
    flex: 1,             // allow to grow
    flexShrink: 1,       // allow to shrink if needed
    paddingRight: 10,    // give space from delete button
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 6,
  },
});
