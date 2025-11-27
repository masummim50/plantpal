import uuid from "react-native-uuid";
// components/PlantEvents.tsx
import { Colors } from "@/constants/Colors";
import { plantEvents } from "@/constants/PlantEvents";
import React, { useState } from "react";

import { Event, Note } from "@/interfaces/plantInterface";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

const quickEvents = plantEvents.slice(0, 4);
const moreEvents = plantEvents.slice(4);

export default function PlantEvents({
  onAddEvent,
  onAddNote
}: {
  onAddEvent: (event: Event) => void,
  onAddNote: (note: Note) => void
}) {
  const scheme = useColorScheme() ?? "light";
  const color = Colors[scheme];
  const [showPicker, setShowPicker] = useState(false);
  const [eventDate, setEventDate] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSelectEvent = (name: string) => {
    setEventName(name);
    setShowModal(false);
  };

  // const handleAddClick = ()=> {
  //   if(Keyboard.isVisible()){
  //     Keyboard.dismiss();
  //     setTimeout(()=> {
  //       handleAdd()
  //     }, 50)
  //   }else{
  //     handleAdd()
  //   }
  // }

  const handleAdd = (type: 'note' | 'event') => {
    if (!eventName.trim()) return;

    const now = new Date();
    const isFuture = eventDate.getTime() > now.getTime();
    if (type === 'note') {
      onAddNote({
        id: uuid.v4(),
        note: eventName.trim(),
      });
    } else {
      onAddEvent({
        id: uuid.v4(),
        name: eventName.trim(),
        date: eventDate.toISOString(),
        past: isFuture ? false : true,
        completed: isFuture ? false : true,
      });
    }

    setEventName("");
    setEventDate(new Date());
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container]}>
        {/* <Text style={[styles.label, { color: color.title }]}>Add Event</Text> */}

        <View style={styles.quickRow}>
          {quickEvents.map((e) => (
            <TouchableOpacity
              key={e}
              onPress={() => handleSelectEvent(e)}
              style={[
                styles.quickButton,
                { backgroundColor: color.uiBackground },
              ]}
            >
              <Text style={{ color: color.title }}>{e}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={[
              styles.quickButton,
              { backgroundColor: Colors.primary, opacity: 0.8},
            ]}
          >
            <Text style={{ color: 'white' }}>More…</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            gap: 5,
          }}
        >
          <TextInput
            value={eventName}
            onChangeText={setEventName}
            placeholder="Write Event/Note"
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
          <Pressable
            style={{
              height: 45,
              borderRadius: 10,
              paddingHorizontal: 12,
              justifyContent: "center",
              backgroundColor: "lightblue",
            }}
            onPress={() => setShowPicker(true)}
          >
            <Text>Pick a date</Text>
          </Pressable>
        </View>

        {showPicker && (
          <DateTimePicker
            value={eventDate}
            mode="date"
            maximumDate={new Date()}
            display="spinner" // or "default"
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setEventDate(selectedDate);
            }}
          />
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

          <TouchableOpacity
            onPress={() => handleAdd('event')}
            style={[styles.addButton, { backgroundColor: Colors.primary }]}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Event</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAdd('note')}
            style={[styles.addButton, { backgroundColor: Colors.primary }]}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Note</Text>
          </TouchableOpacity>

        </View>
        {/* Modal for 'More...' */}
        <Modal visible={showModal} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: color.background },
              ]}
            >
              <Text style={[styles.label, { color: color.title }]}>
                Choose Event
              </Text>
              <FlatList
                data={moreEvents}
                numColumns={3}
                keyExtractor={(item) => item}
                contentContainerStyle={{ paddingVertical: 12 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectEvent(item)}
                    style={[
                      styles.modalButton,
                      { backgroundColor: color.uiBackground },
                    ]}
                  >
                    <Text style={{ color: color.title }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={[styles.closeModal, { borderColor: Colors.primary }]}
              >
                <Text style={{ color: Colors.primary }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 5 },
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
    marginTop: 8,
    width: "48%",
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
