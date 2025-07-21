import { Plant } from '@/interfaces/plantInterface';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GalleryFunctions, PhotoMeta } from '../Gallery/GalleryFunctions';

const GalleryTabNew = ({ plant }: { plant: Plant }) => {
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  useEffect(() => {
    const loadPhotos = async () => {
      setPhotosLoading(true);
      const loadedPhotos = await GalleryFunctions.loadPhotos(
        plant.id,
        plant.plantedAt
      );
      setPhotos(loadedPhotos);
      setPhotosLoading(false);
    }
    loadPhotos();
  }, [plant.id]);
  return (
    <View>
      <Text>GalleryTabNew {photos.length ? photos.length : "0"}</Text>
    </View>
  )
}

export default GalleryTabNew

const styles = StyleSheet.create({})