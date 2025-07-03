import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { GalleryFunctions } from "./GalleryFunctions";
import { PhotoMeta } from "./useGallery";

type Props = {
  photo: PhotoMeta;
  viewMode: "list" | "grid";
  onDelete?: (uri: string) => void;
  setPhotos: React.Dispatch<React.SetStateAction<PhotoMeta[]>>;
  plantId: string;
  plantedAt: string;
};

export default function PhotoItem({ photo, viewMode, onDelete, setPhotos, plantId, plantedAt }: Props) {
  const theme = useColorScheme();
  const color = theme === "dark" ? Colors.dark : Colors.light;

  const handleDeletePhoto = async() => {
    await GalleryFunctions.deletePhoto(photo.uri);
// after deleting needs to fetch or remove that specific photo
const loadedPhotos = await GalleryFunctions.loadPhotos(plantId, plantedAt);
setPhotos(loadedPhotos);

  };
  return (
    <View
      style={[
        styles.container,
        viewMode === "grid" && styles.gridContainer,
        { width: "100%" },
      ]}
    >
      <Image
        source={{ uri: photo.uri }}
        style={viewMode === "grid" ? styles.gridImage : styles.listImage}
      />
      <View style={styles.info}>
        <Text style={[styles.text, { color: color.text }]}>
          Taken {photo.daysAgo === 0 ? "today" : photo.daysAgo === 1 ? "yesterday" : `${photo.daysAgo} days ago`}
        </Text>
        <Text style={[styles.text, { color: color.text }]}>
          {photo.daysAfterPlanting} day
          {photo.daysAfterPlanting !== 1 ? "s" : ""} after planting
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleDeletePhoto}
        style={styles.delete}
      >
        <Ionicons name="trash" size={20} color={Colors.warning} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 12,
    paddingHorizontal: 2,
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
