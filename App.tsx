import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';

import TabBar from './src/components/TabBar';
import HomeScreen from './src/screens/HomeScreen';
import WorkScreen from './src/screens/WorkScreen';
import AssistantScreen from './src/screens/AssistantScreen';
import StackScreen from './src/screens/StackScreen';
import ConnectScreen from './src/screens/ConnectScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen';
import { colors } from './src/theme';
import type { RootStackParamList, TabParamList } from './src/navigation/types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    primary: colors.violet,
    border: 'rgba(255,255,255,0.1)',
    notification: colors.pink,
  },
};

function Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Work" component={WorkScreen} options={{ title: 'Work' }} />
      <Tab.Screen name="Assistant" component={AssistantScreen} options={{ title: 'Ask AI' }} />
      <Tab.Screen name="StackScreen" component={StackScreen} options={{ title: 'Stack' }} />
      <Tab.Screen name="Connect" component={ConnectScreen} options={{ title: 'Connect' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  // Preload icon fonts — required for icons to render on web.
  const [fontsLoaded] = useFonts({ ...Ionicons.font });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
