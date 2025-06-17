import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import PhotoItem from "./PhotoItem";
import { useGallery } from "./useGallery";

type Props = {
  plantId: string;
  plantedAt: string;
};

export default function GalleryView({ plantId, plantedAt }: Props) {
  const {
    photos,
    takePhoto,
    deletePhoto,
    viewMode,
    setViewMode,
    sortNewestFirst,
    setSortNewestFirst,
  } = useGallery(plantId, plantedAt);
  const theme = useColorScheme();
  const color = theme === "dark" ? Colors.dark : Colors.light;
  

  const toggleSort = () => setSortNewestFirst(!sortNewestFirst);
  const toggleView = () => setViewMode(viewMode === "list" ? "grid" : "list");

  const numColumns = viewMode === "grid" ? 2 : 1;

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <View style={[styles.topBar, { backgroundColor: color.uiBackground }]}>
        <TouchableOpacity onPress={toggleSort} style={styles.toggleButton}>
          <Ionicons
            name={sortNewestFirst ? "arrow-down" : "arrow-up"}
            size={18}
            color={color.iconColor}
          />
          <Text style={[styles.toggleText, { color: color.text }]}>
            {sortNewestFirst ? "Newest first" : "Oldest first"}
          </Text>
        </TouchableOpacity>

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

      <FlatList
        data={photos}
        key={numColumns} // force layout re-render when switching view
        keyExtractor={(item) => item.uri}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <PhotoItem photo={item} viewMode={viewMode} onDelete={deletePhoto} />
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: color.text }]}>
            No photos yet.
          </Text>
        }
      />

      <TouchableOpacity onPress={takePhoto} style={[styles.cameraButton, { backgroundColor: Colors.primary }]}>
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  cameraButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 16,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
  },
});
