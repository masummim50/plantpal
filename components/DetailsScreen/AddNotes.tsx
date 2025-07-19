// components/PlantEvents.tsx
import { Colors } from "@/constants/Colors";
import { Note } from "@/interfaces/plantInterface";
import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import uuid from "react-native-uuid";

export default function AddNotes({
  onAddNote,
}: {
  onAddNote: (note: Note) => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const color = Colors[scheme];
  const [note, setNote] = useState("");

  const handleAdd = () => {
    if (!note.trim()) return;
    const newNote = {
      id: uuid.v4(),
      note,
    };

    onAddNote(newNote);
    setNote("");
    Keyboard.dismiss();
  };

  return (
    
      <View style={[styles.container]}>
        {/* <Text style={[styles.label, { color: color.title }]}>Add Event</Text> */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            gap: 5,
          }}
        >
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add Note"
            placeholderTextColor="#aaa"
            style={[
              styles.input,
              {
                backgroundColor: color.uiBackground,
                color: color.text,
                flex: 1,
              },
            ]}
          />

          <TouchableOpacity
            onPress={handleAdd}
            style={[styles.addButton, { backgroundColor: Colors.primary }]}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Note</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    marginBottom: 12,
  },
  quickButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButton: {
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  modalButton: {
    flex: 1,
    margin: 6,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeModal: {
    marginTop: 12,
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
  },
});
