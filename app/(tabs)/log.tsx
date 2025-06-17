import LogFilters, { FilterType } from "@/components/LogFilters";
import { Colors } from "@/constants/Colors";
import { createLogBook, getAllPlants } from "@/functions/DataFunctions";
import {
  formatPrettyDate,
  getDaysDifference,
  isFutureDate,
} from "@/functions/Date";
import { LogEntry } from "@/interfaces/plantInterface";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";

export default function log() {
  const theme = useColorScheme();
  const color = Colors[theme || "light"];
  const [loading, setLoading] = useState(true);
  const [logbook, setLogBook] = useState<LogEntry[]>([]);
  const [order, setOrder] = useState<FilterType>("oldest");
  const [filter, setFilter] = useState(false);
  const fetchLogs = async () => {
    const plants = await getAllPlants();
    const logs = createLogBook(plants);
    setLogBook(logs);
    setLoading(false);
  };
useFocusEffect(
  useCallback(() => {
    fetchLogs();
  }, [])
);


  useEffect(() => {
    const newLogbook = [...logbook].sort((a:any, b:any) => {
      if (order === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (order === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    })
    setLogBook(newLogbook)
  }, [order])
  const renderItem = ({ item }: { item: LogEntry }) => <LogCard item={item}  filter={filter}/>;

  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          <LogFilters
            order={order}
            setOrder={setOrder}
            filter={filter}
            setFilter={setFilter}
          />
          <FlatList
            data={logbook}
            keyExtractor={(item, index) => `${item.date}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={[styles.container, {paddingBottom:100}]}
          />
        </View>
      )}
    </View>
  );
}

const LogCard = ({ item, filter }: { item: LogEntry, filter: boolean }) => {
  const theme = useColorScheme();
  const color = Colors[theme || "light"];
  const isFuture = isFutureDate(item.date);
  const time = getDaysDifference(new Date(item.date));
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isFuture ? color.uiBackground : "transparent",
          borderColor: color.uiBackground,
          display: filter ? isFuture ? 'flex' : 'none' : 'flex'
        },
      ]}
    >
      <Text style={[styles.title, { color: color.text }]}>{item.title}</Text>
      {isFuture ? (
        <Text style={[styles.date, { color: Colors.warning }]}>
          perform event on {formatPrettyDate(item.date)}, in {time.time} days
        </Text>
      ) : time.time === 0 ? (
        <Text style={[styles.date, { color: color.text, opacity: 0.6 }]}>
          today
        </Text>
      ) : (
        <Text style={[styles.date, { color: color.text, opacity: 0.6 }]}>
          {time.time} days ago
        </Text>
      )}

      {/* <Text style={[styles.date, { color: color.text, opacity: 0.6 }]}>
        {isFuture
          ? `perform event on ${formatPrettyDate(item.date)}, in ${
              time.time
            } days`
          : time.time === 0
          ? "today"
          : ` ${time.time} days ago on ${formatPrettyDate(item.date)}`}
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
  },
});
