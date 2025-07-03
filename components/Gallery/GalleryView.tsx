import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import { GalleryFunctions } from "./GalleryFunctions";
import PhotoItem from "./PhotoItem";

type Props = {
  plantId: string;
  plantedAt: string;
};
export type PhotoMeta = {
  uri: string;
  date: string;
  daysAfterPlanting: number;
  daysAgo: number;
};
export default function GalleryView({ plantId, plantedAt }: Props) {
  
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [currentPlantId, setCurrentPlantId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadPhotos = async () => {
        setPhotosLoading(true);
        const loadedPhotos = await GalleryFunctions.loadPhotos(
          plantId,
          plantedAt
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
    }, [plantId, plantedAt])
  );



  const theme = useColorScheme();
  const color = theme === "dark" ? Colors.dark : Colors.light;
  const [isViewerVisible, setViewerVisible] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // const toggleSort = () => setSortNewestFirst(!sortNewestFirst);
  const toggleView = () => setViewMode(viewMode === "list" ? "grid" : "list");

  const numColumns = viewMode === "grid" ? 2 : 1;

  const images = photos.map((p) => ({ uri: p.uri }));

  const onPhotoPress = (index: number) => {
    setCurrentIndex(index);
    setViewerVisible(true);
  };

  const handleDeleteFromViewer = async () => {
    const photoToDelete = photos[currentIndex];
    if (photoToDelete) {
      console.log(photoToDelete.uri);
      await GalleryFunctions.deletePhoto(photoToDelete.uri);
      setViewerVisible(false);
      const loadedPhotos = await GalleryFunctions.loadPhotos(
        plantId,
        plantedAt
      );
      setPhotos(loadedPhotos);
    }
  };
  const handleTakePhoto = async () => {
    await GalleryFunctions.takePhoto(plantId, plantedAt);
    const loadedPhotos = await GalleryFunctions.loadPhotos(plantId, plantedAt);
    setPhotos(loadedPhotos);
  };

  const [indexForText, setIndexForText] = React.useState(0);

  // const daysAfterPlanted = (photoDate: string) =>
  //   differenceInDays(new Date(photoDate), parseISO(plantedAt));

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
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

      {photosLoading ? (
        <Text style={[styles.emptyText, { color: color.text }]}>
          Loading photos...
        </Text>
      ) : (
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
      )}

      <TouchableOpacity
        onPress={handleTakePhoto}
        style={[styles.cameraButton, { backgroundColor: Colors.primary }]}
      >
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>

      {/* the image view component is below */}
      <ImageViewing
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
                {photos[indexForText].daysAgo === 0
                  ? "Today"
                  : photos[indexForText].daysAgo === 1
                  ? "Yesterday"
                  : `${photos[indexForText].daysAgo} days ago`}
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
