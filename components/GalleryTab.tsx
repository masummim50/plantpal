import { Plant } from "@/interfaces/plantInterface";
import { StyleSheet } from "react-native";
import GalleryView from "./Gallery/GalleryView";


export default function GalleryTab({plant}: {plant: Plant}) {
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