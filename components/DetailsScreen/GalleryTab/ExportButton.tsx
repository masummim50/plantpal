import * as FileSystem from 'expo-file-system/legacy';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const ExportButton = ({ plantId }: {plantId:string  }) => {


    async function exportImagesToSdCard() {
        try {
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
        } catch (error) {
            alert("❌ Error exporting images. Possible Reasons: file too large or app doesn't have permission to access your storage. Try selecting a different storage such as internal storage or sd card.");
        }
    }


    return (
        <View>
            <Pressable
                onPress={exportImagesToSdCard}
                style={{ padding: 10, backgroundColor: 'lightgray', borderRadius: 5, margin: 10, display: 'flex', alignItems: 'center' }}>
                <Text>Export images</Text>
            </Pressable>
        </View>
    )
}

export default ExportButton