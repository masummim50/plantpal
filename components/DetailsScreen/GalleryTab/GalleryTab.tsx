import { Colors } from "@/constants/Colors";
import { Plant } from "@/interfaces/plantInterface";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import ImageView from "react-native-image-viewing";
import { ImageSource } from "react-native-image-viewing/dist/@types";
import { GalleryFunctions, PhotoMeta } from "../../Gallery/GalleryFunctions";
import ExportButton from "./ExportButton";
import GallerySortingBar from "./GallerySortingBar";
import PhotoFlatList from "./PhotoFlatList";

const GalleryTab = ({ plant }: { plant: Plant }) => {
  const theme = useColorScheme();
  const color = theme === "dark" ? Colors.dark : Colors.light;
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [currentplant, setCurrentplant] = useState<string | null>(null);

  const [isViewerVisible, setViewerVisible] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const [indexForText, setIndexForText] = React.useState(0);
  const [images, setImages] = React.useState<ImageSource[]>([]);

  useEffect(() => {
    setPhotosLoading(true);
    GalleryFunctions.loadPhotos(plant.id, plant.plantedAt, "useeffect fetching photos").then((photos) => {
      setPhotos(photos);
      setPhotosLoading(false);
    });
  }, [plant.id, plant.plantedAt]);

  useEffect(() => {
    setImages(photos.map((photo) => ({ uri: photo.uri })));
  }, [photos]);

  const toggleSort = () => setSortNewestFirst(!sortNewestFirst);

  const toggleView = () => setViewMode(viewMode === "list" ? "grid" : "list");

  const numColumns = viewMode === "grid" ? 2 : 1;
 

  const onPhotoPress = (index: number) => {
    setCurrentIndex(index);
    setViewerVisible(true);
  };

  const handleDeleteFromViewer = async () => {
    const photoToDelete = photos[currentIndex];
    if (photoToDelete) {
      await GalleryFunctions.deletePhoto(photoToDelete.uri);
      const loadedPhotos = await GalleryFunctions.loadPhotos(
        plant.id,
        plant.plantedAt,
        "handle delete photo"
      );
      setPhotos(loadedPhotos);
    }
  };

  const handleTakePhoto = async () => {
    await GalleryFunctions.takePhoto(plant.id, plant.plantedAt);
    const loadedPhotos = await GalleryFunctions.loadPhotos(
      plant.id,
      plant.plantedAt,
      "handleTakephoto"
    );
    setPhotos(loadedPhotos);
  };

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      {/* export image button */}
      <ExportButton plantId={plant.id} />
      {/* to sort images */}
      <GallerySortingBar viewMode={viewMode} toggleView={toggleView} plantId={plant.id} toggleSort={toggleSort} sortNewestFirst={sortNewestFirst} />

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
          sortNewestFirst={sortNewestFirst}
        />
      )}

      <TouchableOpacity
        onPress={handleTakePhoto}
        style={[styles.cameraButton, { backgroundColor: Colors.primary }]}
      >
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>

      {/* the image view component is below */}
      <ImageView
        images={images}
        imageIndex={currentIndex}
        visible={isViewerVisible}
        onImageIndexChange={(index) => setIndexForText(index)}
        onRequestClose={() => setViewerVisible(false)}
        swipeToCloseEnabled
        HeaderComponent={() => (
          <>
            <View style={styles.overlayTopLeft}>
              <Text style={styles.overlayText}>
                {photos[indexForText]
                  ? photos[indexForText].daysAgo === 0
                    ? "Today"
                    : photos[indexForText].daysAgo === 1
                    ? "Yesterday"
                    : `${photos[indexForText].daysAgo} days ago`
                  : null}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setViewerVisible(false)}
              style={styles.overlayTopRight}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </>
        )}
        FooterComponent={() => (
          <TouchableOpacity
            onPress={handleDeleteFromViewer}
            style={styles.overlayBottomRight}
          >
            <Ionicons name="trash" size={28} color="#fff" />
          </TouchableOpacity>
        )}
      />
      {/* end of it */}
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
