// app/_layout.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  const theme = useColorScheme();
  const color = theme === 'dark' ? Colors.dark : Colors.light;

  return (
    // <Tabs
    //   screenOptions={({ route }) => ({
    //     tabBarActiveTintColor: Colors.primary,
    //     tabBarInactiveTintColor: color.iconColor,
    //     tabBarStyle: { backgroundColor: color.navBackground },
    //     headerStyle: { backgroundColor: color.navBackground },
    //     headerTitleStyle: { color: color.title },
    //     headerTintColor: color.title,
    //     tabBarIcon: ({ color, size }) => {
    //       let iconName = 'home';

    //       if (route.name === 'index') iconName = 'home';
    //       else if (route.name === 'add') iconName = 'add-circle';
    //       else if (route.name === 'log') iconName = 'list';

    //       return <Ionicons name={iconName as any} size={size} color={color} />;
    //     },
    //   })}
    // />

    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: color.iconColor,
        tabBarStyle: { backgroundColor: color.navBackground },
        headerStyle: { backgroundColor: color.navBackground },
        headerTitleStyle: { color: color.title },
        headerTintColor: color.title,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          if (route.name === 'index') iconName = 'home';
          else if (route.name === 'add') iconName = 'add-circle';
          else if (route.name === 'log') iconName = 'list';

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="add" options={{ title: 'add' }} />
      <Tabs.Screen name="log" options={{ title: 'log' }} />
      <Tabs.Screen name="[id]" options={{ title: 'details',href:null }} />
    </Tabs>
  );
}
