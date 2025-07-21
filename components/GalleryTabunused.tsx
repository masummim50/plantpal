import { Plant } from "@/interfaces/plantInterface";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import GalleryView from "./Gallery/GalleryView";
import { useGallery } from "./Gallery/useGallery";


export default function GalleryTab({plant}: {plant: Plant}) {
  const {setPhotos} = useGallery(plant.id, plant.plantedAt, );
  useEffect(() => {
    return ()=> {
      setPhotos([]);
    }
  },[])

  return (
    // <ScrollView contentContainerStyle={styles.scrollTabContent}>
        <GalleryView plantId={plant.id} plantedAt={plant.plantedAt} />
    // </ScrollView>
  );
}

const styles = StyleSheet.create({

  scrollTabContent: {
    padding: 16,
    paddingBottom: 32,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 10,
  },

});