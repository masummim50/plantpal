import { Colors } from "@/constants/Colors";
import { Plant } from "@/interfaces/plantInterface";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { GalleryFunctions, PhotoMeta } from "../Gallery/GalleryFunctions";
import GallerySortingBar from "./GallerySortingBar";
import PhotoFlatList from "./PhotoFlatList";

const GalleryTab = ({ plant }: { plant: Plant }) => {
  const theme = useColorScheme();
  const color = theme === "dark" ? Colors.dark : Colors.light;
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const [currentIndex, setCurrentIndex] = React.useState(0);


  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadPhotos = async () => {
        setPhotosLoading(true);
        const loadedPhotos = await GalleryFunctions.loadPhotos(
          plant.id,
          plant.plantedAt
        );
        if (isActive) {
          setPhotos(loadedPhotos);
          setPhotosLoading(false);
        }
      };

      loadPhotos();

      return () => {
        isActive = false;
      };
    }, [plant.id, plant.plantedAt])
  );

  const toggleSort = () => setSortNewestFirst(!sortNewestFirst);

  const toggleView = () => setViewMode(viewMode === "list" ? "grid" : "list");

  const numColumns = viewMode === "grid" ? 2 : 1;

  const onPhotoPress = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDeleteFromViewer = async () => {
    const photoToDelete = photos[currentIndex];
    if (photoToDelete) {
      console.log(photoToDelete.uri);
      await GalleryFunctions.deletePhoto(photoToDelete.uri);
      const loadedPhotos = await GalleryFunctions.loadPhotos(
        plant.id,
        plant.plantedAt
      );
      setPhotos(loadedPhotos);
    }
  };
  const handleTakePhoto = async () => {
    await GalleryFunctions.takePhoto(plant.id, plant.plantedAt);
    const loadedPhotos = await GalleryFunctions.loadPhotos(
      plant.id,
      plant.plantedAt
    );
    setPhotos(loadedPhotos);
  };





  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      {/* to sort images */}
      <GallerySortingBar viewMode={viewMode} toggleView={toggleView} />

      {photosLoading ? (
        <Text style={[styles.emptyText, { color: color.text }]}>
          Loading photos...
        </Text>
      ) : (
        <PhotoFlatList
          photos={photos}
          onPhotoPress={onPhotoPress}
          numColumns={numColumns}
          viewMode={viewMode}
          plantId={plant.id}
          plantedAt={plant.plantedAt}
          setPhotos={setPhotos}
        />
      )}

      <TouchableOpacity
        onPress={handleTakePhoto}
        style={[styles.cameraButton, { backgroundColor: Colors.primary }]}
      >
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>

      {/* the image view component is below */}

      
    </View>
  );
};

export default GalleryTab;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
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
  overlayTopLeft: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 10,
  },
  overlayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  overlayTopRight: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },

  overlayBottomRight: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
});
