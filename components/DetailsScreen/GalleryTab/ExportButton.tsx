import { PhotoMeta } from '@/components/Gallery/GalleryFunctions';
import { File } from 'expo-file-system';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const ExportButton = ({ photos }: { photos: PhotoMeta[] }) => {

    const runExportFunction = async () => {
        photos.map(async (image, index) => {
            const photoFile = new File(image.uri);
            if(photoFile.exists){
                console.log(`Photo ${index + 1} exists at URI: ${image.uri}`);
                const base = await photoFile.base64();
                console.log(base.length); // Log first 30 chars    
            }

        });
    }


    return (
        <View>
            <Pressable
                onPress={runExportFunction}
                style={{ padding: 10, backgroundColor: 'lightgray', borderRadius: 5, margin: 10, display: 'flex', alignItems: 'center' }}>
                <Text>Export images</Text>
            </Pressable>
        </View>
    )
}

export default ExportButton