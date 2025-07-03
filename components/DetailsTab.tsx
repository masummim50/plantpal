import { Event, Note, Plant } from "@/interfaces/plantInterface";
import { ScrollView, StyleSheet, Text } from "react-native";
import AddNotes from "./AddNotes";
import EventSection from "./EventSection";
import NotesSection from "./NotesSection";
import PlantEvents from "./PlantEvents";


export default function DetailsTab({
  plant,
  color,
  handleAddEvent,
  handleAddNote,
  handleDeleteEvent,
  handleDeleteNote,
}: {
  plant: Plant;
  color: any;
  handleAddEvent: (event: Event) => void;
  handleAddNote: (note: Note) => void;
  handleDeleteEvent: (id: string) => void;
  handleDeleteNote: (id: string) => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollTabContent}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: color.background }}
    >
      <PlantEvents onAddEvent={handleAddEvent} />
      <AddNotes onAddNote={handleAddNote} />

      {plant.events?.length ? (
        <EventSection
        plantedDate = {plant.plantedAt}
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
        <Text style={[styles.itemText, { color: color.text }]}>No notes</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  
  scrollTabContent: {
    padding: 16,
  },
  itemText: {
    fontSize: 16,
    // marginBottom: 10,
  },
});