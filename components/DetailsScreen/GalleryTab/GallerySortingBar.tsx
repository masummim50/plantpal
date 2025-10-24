import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system/legacy';
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";


const GallerySortingBar = ({
  toggleView,
  viewMode,
  plantId
}: {
  toggleView: () => void;
  viewMode: "list" | "grid";
  plantId: string;
}) => {
  const theme = useColorScheme();
  const color = theme === "dark" ? Colors.dark : Colors.light;


  // const downloadImages = async (plantId:string)=> {
  //   console.log("Downloading images for plant:", plantId);
  //   try {
  //     const pickDirectory = await Directory.pickDirectoryAsync();
  //     if (pickDirectory.exists) {
  //       // go to the image folder
  //       const imageFolder = new Directory(Paths.document, `${plantId}_images`);
  //       if(imageFolder.exists){
  //         const files = imageFolder.list();
  //         for(const file of files){
  //           console.log("each file: ", file)
  //           try{
  //             file.copy(pickDirectory);
  //           }catch(error){
  //             console.log("file copy error: ", error)
  //           }
  //         }
  //       } else {
  //         console.log("No images found for this plant.");
  //         return;
  //       }

  //       // copy images one by one to the picked directory
  //       console.log("Picked directory:", pickDirectory);
  //       console.log("User canceled directory picking");
  //       return;
  //     }
  //   } catch (error) {
  //     console.log("Error picking directory:", error);
  //   }
  // }

async function exportImagesToSdCard(plandId: string) {
  const imagesDir = FileSystem.documentDirectory + `${plantId}_images`;
  const files = await FileSystem.readDirectoryAsync(imagesDir);

  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!permissions.granted) return;

  const folderUri = permissions.directoryUri;

  for (const filename of files) {
    const path = `${imagesDir}/${filename}`;
    const fileContent = await FileSystem.readAsStringAsync(path, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const mimeType = filename.endsWith(".jpg") ? "image/jpeg" : "application/octet-stream";
    const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      folderUri,
      filename,
      mimeType
    );

    await FileSystem.writeAsStringAsync(newFileUri, fileContent, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  alert("✅ All images exported successfully!");
}



  return (
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

      <TouchableOpacity onPress={toggleView} style={[styles.toggleButton]}>
        <Ionicons
          name={viewMode === "list" ? "grid-outline" : "list-outline"}
          size={18}
          color={color.iconColor}
        />
        <Text style={[styles.toggleText, { color: color.text }]}>
          {viewMode === "list" ? "Grid" : "List"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=> exportImagesToSdCard(plantId)} style={[{backgroundColor: color.iconColor},styles.exportButton]}>
        
        <Text style={[styles.toggleText, { color: 'white' }]}>
          Export images
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GallerySortingBar;

const styles = StyleSheet.create({
  exportButton: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
});
