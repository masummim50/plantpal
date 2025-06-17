import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { PhotoMeta } from "./useGallery";

type Props = {
  photo: PhotoMeta;
  viewMode: "list" | "grid";
  onDelete: (uri: string) => void;
};

export default function PhotoItem({ photo, viewMode, onDelete }: Props) {
    const theme = useColorScheme();
    const color = theme === "dark" ? Colors.dark : Colors.light;
  

  return (
    <View style={[styles.container, viewMode === "grid" && styles.gridContainer]}>
      <Image source={{ uri: photo.uri }} style={viewMode === "grid" ? styles.gridImage : styles.listImage} />
      <View style={styles.info}>
        <Text style={[styles.text, { color: color.text }]}>
          Taken {photo.daysAgo} day{photo.daysAgo !== 1 ? "s" : ""} ago
        </Text>
        <Text style={[styles.text, { color: color.text }]}>
          {photo.daysAfterPlanting} day{photo.daysAfterPlanting !== 1 ? "s" : ""} after planting
        </Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(photo.uri)} style={styles.delete}>
        <Ionicons name="trash" size={20} color={Colors.warning} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 14,
  },
  delete: {
    padding: 10,
  },
  gridContainer: {
    flexDirection: "column",
    width: "47%",
    margin: "1.5%",
    backgroundColor: "transparent",
  },
  gridImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
});
