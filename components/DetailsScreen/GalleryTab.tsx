import { Colors } from "@/constants/Colors";
import { Plant } from "@/interfaces/plantInterface";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { GalleryFunctions, PhotoMeta } from "../Gallery/GalleryFunctions";

const GalleryTab = ({ plant, photos, setPhotos }: { plant: Plant, photos: PhotoMeta[], setPhotos: React.Dispatch<React.SetStateAction<PhotoMeta[]>> }) => {
  const theme = useColorScheme();
  const color = theme === "dark" ? Colors.dark : Colors.light;

 
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
      {/* to sort images */}

      
        <Text>photos loaded: {photos.length}</Text>
      

      <TouchableOpacity
        onPress={handleTakePhoto}
        style={[styles.cameraButton, { backgroundColor: Colors.primary }]}
      >
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>
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
