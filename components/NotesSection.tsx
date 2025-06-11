import { Colors } from "@/constants/Colors";
import { Note } from "@/interfaces/plantInterface";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function NotesSection({
  notes,
  onDeleteNote,
}: {
  notes: Note[],
  onDeleteNote: (id: string) => void
}) {
  const theme = useColorScheme();
  const color = theme === "dark" ? Colors.dark : Colors.light;
  return (
    <View
      style={[
        styles.section,
        
      ]}
    >
      <Text style={[styles.sectionTitle, { color: color.title }]}>Notes</Text>
      {notes.map((note: Note) => (
        <View key={note.id} style={[styles.noteCard, { borderBottomWidth: 2, borderBottomColor: color.uiBackground }]}>
          <Text style={[styles.itemText, { color: color.text, flex: 1 }]}>
            • {note.note}
          </Text>
          <TouchableOpacity onPress={() => onDeleteNote(note.id)}>
            <Ionicons name="trash-outline" size={20} color='red' />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
  },
  inner: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
  },
});
