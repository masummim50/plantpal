import { Colors } from "@/constants/Colors";
import { formatPrettyDate, getDaysDifference, isFutureDate } from "@/functions/Date";
import { Event } from "@/interfaces/plantInterface";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

export default function EventSection({
  events,
  handleDeleteEvent
}: {
  events: Event[];
  handleDeleteEvent: (id: string) => void
}) {
  const theme = useColorScheme();
  const color = theme === "dark" ? Colors.dark : Colors.light;
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: color.title }]}>Events</Text>
      {events.map((event, index) => (
        <EventCard key={index} event={event} handleDeleteEvent={handleDeleteEvent} />
      ))}
    </View>
  );
}

const EventCard = ({ event , handleDeleteEvent}: { event: Event, handleDeleteEvent: (id: string) => void }) => {
  const theme = useColorScheme();
  const color = theme === "dark" ? Colors.dark : Colors.light;
  const date = getDaysDifference(new Date(event.date));
  const prettyDate = formatPrettyDate(event.date);
  const futureDate = isFutureDate(event.date);

  return (
    <View style={[styles.card, { backgroundColor: color.uiBackground , borderRadius: 6, paddingVertical: 12}]}>
      {/* Left Side */}
      <View style={styles.info}>
        <Text style={{color: color.text, fontSize: 16}}>{event.name}</Text>
        <Text style={{color: color.text, opacity: 0.7, fontSize: 14}}>
          {futureDate ? `perform event on ${prettyDate}, in ${date.time} days` : date.time === 0 ? "today" : `in ${date.time} days ago on ${prettyDate}` }
        </Text>

        {!isFutureDate(event.date) && !event?.completed && (
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Mark Completed</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Right Side: Delete */}
      <TouchableOpacity onPress={() => { handleDeleteEvent(event.id)}}>
        <Ionicons name="trash-outline" size={24} color="#cc475a" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 4,
    marginVertical: 2,
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#6849a7",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
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
