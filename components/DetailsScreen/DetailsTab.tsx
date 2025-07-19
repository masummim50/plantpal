import { Event, Note, Plant } from "@/interfaces/plantInterface";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback
} from "react-native";
import AddNotes from "./AddNotes";
import EventSection from "./EventSection";
import NotesSection from "./NotesSection";
import PlantEvents from "./PlantEvents";

const DetailsTab = ({
  plant,
  color,
  handleAddEvent,
  handleDeleteEvent,
  handleAddNote,
  handleDeleteNote,
}: {
  plant: Plant;
  color: any;
  handleAddEvent: (event: Event) => Promise<void>;
  handleDeleteEvent: (id: string) => Promise<void>;
  handleAddNote: (note: Note) => Promise<void>;
  handleDeleteNote: (id: string) => Promise<void>;
}) => {
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // you can tweak this value
      >
        <ScrollView
          contentContainerStyle={styles.scrollTabContent}
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: color.background, }}
        >
          <PlantEvents onAddEvent={handleAddEvent} />
          <AddNotes onAddNote={handleAddNote} />

          {plant.events?.length ? (
            <EventSection
              plantedDate={plant.plantedAt}
              events={plant.events}
              handleDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <Text style={[styles.itemText, { color: color.text }]}>
              No events recorded.
            </Text>
          )}

          {plant.notes?.length ? (
            <NotesSection notes={plant.notes} onDeleteNote={handleDeleteNote} />
          ) : (
            <Text style={[styles.itemText, { color: color.text,  }]}>
              No notes
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    
    </ScrollView>
  );
};

export default DetailsTab;

const styles = StyleSheet.create({
  scrollTabContent: {
    padding: 10,
  },
  itemText: {
    fontSize: 16,
    // marginBottom: 10,
  },
});
