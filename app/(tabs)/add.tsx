import { Colors } from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Directory, File, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import uuid from "react-native-uuid";
// const PLANTS_DIR = FileSystem.documentDirectory + "plants/";
const PLANTS_DIR = new Directory(Paths.document,  "plants/");

export default function AddPlantScreen() {
  const [plantedAt, setPlantedAt] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const theme = useColorScheme(); // 'light' or 'dark'
  const themeColors = Colors[theme || "light"];
  const router = useRouter();
  const [name, setName] = useState("");

  const isToday = (date: Date): boolean => {
  const today = new Date();
  
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}



// original handleAdd function
  // const handleAdd = async () => {
  //   if (!name.trim()) {
  //     Alert.alert("Missing Info", "Please enter a plant name.");
  //     return;
  //   }

  //   const id = uuid.v4();
  //   const newPlant = {
  //     id,
  //     name: name.trim(),
  //     plantedAt,
  //     events: [],
  //     notes: [],
  //   };

  //   try {
  //     // const dirInfo = await FileSystem.getInfoAsync(PLANTS_DIR);
  //     const dirInfo = await new Directory(PLANTS_DIR)
  //     if (!dirInfo.exists) {
  //       // await FileSystem.makeDirectoryAsync(PLANTS_DIR, {
  //       //   intermediates: true,
  //       // });
  //       // create directory with new code
  //       await dirInfo.create();
  //     }

  //     const filePath = `${PLANTS_DIR}plant_${id}.json`;

  //     // await FileSystem.writeAsStringAsync(filePath, JSON.stringify(newPlant));
  //     // write file with new data
  //     await 

  //     setName("");
  //     setPlantedAt(new Date());
  //     router.replace("/");
  //   } catch (error) {
  //     Alert.alert("Error", "Could not save the plant.");
  //     console.error(error);
  //   }
  // };

// new class based api handle add function
const handleAdd = async () => {
  if (!name.trim()) {
    Alert.alert("Missing Info", "Please enter a plant name.");
    return;
  }

  const id = uuid.v4();
  const newPlant = {
    id,
    name: name.trim(),
    plantedAt,
    events: [],
    notes: [],
  };

  try {
    // ensure the "plants" directory exists
    const dirInfo = PLANTS_DIR;
    const exists = await dirInfo.exists;
    if (!exists) {
      await dirInfo.create();
    }

    // create a file inside it
    const file = new File(dirInfo, `plant_${id}.json`);
    await file.write(JSON.stringify(newPlant));

    setName("");
    setPlantedAt(new Date());
    router.replace("/");
  } catch (error) {
    Alert.alert("Error", "Could not save the plant.");
  }
};


  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100); // small delay to ensure screen is ready

    return () => clearTimeout(timer);
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.container,
            { backgroundColor: themeColors.background },
          ]}
        >
          <Text style={[styles.title, { color: themeColors.title }]}>
            Add a New Plant
          </Text>

          <TextInput
            ref={nameInputRef}
            style={[
              styles.input,
              {
                backgroundColor: themeColors.uiBackground,
                color: themeColors.text,
                borderColor: themeColors.iconColor,
              },
            ]}
            placeholder="Plant name"
            placeholderTextColor={themeColors.iconColor}
            value={name}
            onChangeText={setName}
            maxLength={50}
          />

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: themeColors.text, marginBottom: 8 }}>
              Planted on:
            </Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button title="Today"  onPress={() => setPlantedAt(new Date())} />
              
              <Button title="Pick Date" onPress={() => setShowPicker(true)} />
            </View>

            <Text style={{ color: themeColors.text, marginTop: 8 }}>
              Selected: {plantedAt.toDateString() === new Date().toDateString() ? "Today" : plantedAt.toDateString()}
            </Text>
          </View>

          <Button
            title="Save Plant"
            onPress={handleAdd}
            color={Colors.primary}
            
          />
          {showPicker && (
            <DateTimePicker
              maximumDate={new Date()}
              value={plantedAt}
              mode="date"
              display="spinner" // or "default"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setPlantedAt(selectedDate);
              }}
            />
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "flex-start" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});
