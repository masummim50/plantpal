import { Colors } from "@/constants/Colors";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { PhotoMeta } from "../Gallery/GalleryFunctions";
import PhotoItem from "../Gallery/PhotoItem";

const PhotoFlatList = ({
  photos,
  numColumns,
  viewMode,
  onPhotoPress,
  plantId,
  plantedAt,
  setPhotos
}: {
  photos: PhotoMeta[];
  numColumns: number;
  viewMode: "list" | "grid";
  onPhotoPress: (index: number) => void;
  plantId: string;
  plantedAt: string;
  setPhotos: React.Dispatch<React.SetStateAction<PhotoMeta[]>>
}) => {
    
      const theme = useColorScheme();
      const color = theme === "dark" ? Colors.dark : Colors.light;
  return (
    <FlatList
      data={photos}
      key={numColumns} // force layout re-render when switching view
      keyExtractor={(item) => item.uri}
      numColumns={numColumns}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item, index }) => (
        <View style={{ flex: 1, margin: viewMode === "grid" ? 0 : 0 }}>
          <TouchableOpacity
            onPress={() => onPhotoPress(index)}
            activeOpacity={0.8}
          >
            <PhotoItem
              setPhotos={setPhotos}
              plantId={plantId}
              plantedAt={plantedAt}
              photo={item}
              viewMode={viewMode}
              // onDelete={deletePhoto}
            />
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: color.text }]}>
          No photos yet.
        </Text>
      }
    />
  );
};

export default PhotoFlatList;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
  },});
