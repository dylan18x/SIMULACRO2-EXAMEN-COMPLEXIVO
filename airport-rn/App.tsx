import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AirlinesScreen from "./src/screens/Airlines";
import FlightEventsScreen from "./src/screens/FlightEvents";

import type { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Menú" }} />
        <Stack.Screen name="Airlines" component={AirlinesScreen} options={{ title: "Aerolineas" }} />
        <Stack.Screen name="FlightEvents" component={FlightEventsScreen} options={{ title: "Eventos de Vuelos" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}