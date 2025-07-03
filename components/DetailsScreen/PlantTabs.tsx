import { Colors } from "@/constants/Colors";
import { Event, Note, Plant } from "@/interfaces/plantInterface";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import DetailsTab from "./DetailsTab";
import GalleryTab from "./GalleryTab";

const PlantTabs = ({
  plant,
  handleAddEvent,
  handleAddNote,
  handleDeleteEvent,
  handleDeleteNote,
}: {
  plant: Plant;
  handleAddEvent: (event: Event) => Promise<void>;
  handleAddNote: (note: Note) => Promise<void>;
  handleDeleteEvent: (id: string) => Promise<void>;
  handleDeleteNote: (id: string) => Promise<void>;
}) => {
  const Tab = createMaterialTopTabNavigator();

  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"];
  return (
    <Tab.Navigator
      key={plant.id}
      initialRouteName="Details"
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: color.uiBackground,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
          color: color.text,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.primary,
        },
      })}
    >
      <Tab.Screen name="Details" key={`details-${plant.id}`}>
        {() => (
          <DetailsTab
            plant={plant}
            color={color}
            handleAddEvent={handleAddEvent}
            handleAddNote={handleAddNote}
            handleDeleteEvent={handleDeleteEvent}
            handleDeleteNote={handleDeleteNote}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Gallery" key={`gallery-${plant.id}`}>
        {() => <GalleryTab plant={plant} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default PlantTabs;

const styles = StyleSheet.create({});
