import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { listFlightsApi } from "../api/fligths.api";
import { listAirlinesApi } from "../api/airlines.api";
import { listFlightEventsApi, createFlightEventsApi, deleteFlightEventsApi } from "../api/flightEvents.api";

import type { Flight } from "../types/flight";
import type { Airline } from "../types/airlines";
import type { FlightEvent } from "../types/flightEvents";
import { toArray } from "../types/drf";


function airlineLabel(st: Airline): string {
  return st.name;
}


export default function FlightEventsScreen() {
  const [events, setEvents] = useState<FlightEvent[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);

  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);
  const [selectedAirlineId, setSelectedAirlineId] = useState<string>("");

  const [eventType, setEventType] = useState("");
  const [source, setSource] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const [servicesData, flightsData, airlinesData] = await Promise.all([
        listFlightEventsApi(),
        listFlightsApi(),
        listAirlinesApi(),
      ]);

      const servicesList = toArray(servicesData);
      const flightsList = toArray(flightsData);
      const airlinesList = toArray(airlinesData);

      setEvents(servicesList);
      setFlights(flightsList);
      setAirlines(airlinesList);

      if (selectedFlightId === null && flightsList.length) setSelectedFlightId(flightsList[0].id);
      if (!selectedAirlineId && airlinesList.length) setSelectedAirlineId(airlinesList[0].id);
    } catch {
      setErrorMessage("No se pudo cargar info. ¿Token? ¿baseURL? ¿backend encendido?");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const createService = async (): Promise<void> => {
    try {
      setErrorMessage("");

      if (selectedFlightId === null) return setErrorMessage("Seleccione un vuelo");
      if (!selectedAirlineId) return setErrorMessage("Seleccione un evento de vuelo");

      const trimmedNotes = source.trim() || eventType.trim() || createdAt.trim();
      // NO enviar fecha, backend la toma actual
      const created = await createFlightEventsApi({
        flight_id: selectedFlightId,
        airline_id: selectedAirlineId,
        event_type: trimmedNotes,
        source: trimmedNotes,
        created_at: trimmedNotes,
      });

      setEvents((prev) => [created, ...prev]);
      setEventType("");
      setSource("");
      setCreatedAt("");
    } catch {
      setErrorMessage("No se pudo crear vehicle service");
    }
  };

  const removeService = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteFlightEventsApi(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar vehicle service");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Evento de Vuelo</Text>
            {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            <Text style={styles.label}>Vuelo</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={selectedFlightId ?? ""}
                onValueChange={(value) => setSelectedFlightId(Number(value))}
                dropdownIconColor="#58a6ff"
                style={styles.picker}
              >
                {flights.map((f) => (
                  <Picker.Item key={f.id} label={f.flight_number} value={f.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Aerolinea</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={selectedAirlineId}
                onValueChange={(value) => setSelectedAirlineId(String(value))}
                dropdownIconColor="#58a6ff"
                style={styles.picker}
              >
                {airlines.map((st) => (
                  <Picker.Item key={st.id} label={airlineLabel(st)} value={st.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Tipo de Evento</Text>
            <TextInput
              placeholder="created"
              placeholderTextColor="#8b949e"
              value={eventType}
              onChangeText={setEventType}
              style={styles.input}
            />

            <Text style={styles.label}>Fuente</Text>
            <TextInput
              placeholder="web"
              placeholderTextColor="#8b949e"
              value={source}
              onChangeText={setSource}
              keyboardType="numeric"
              style={styles.input}
            />


            <Pressable onPress={createService} style={[styles.btn, { marginBottom: 12 }]}>
              <Text style={styles.btnText}>Crear (sin enviar fecha)</Text>
            </Pressable>

            <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
              <Text style={styles.btnText}>Refrescar</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowText} numberOfLines={1}>Vehículo ID: {item.flight_id}</Text>
              <Text style={styles.rowSub} numberOfLines={1}>Service Type ID: {item.airline_id}</Text>
              {item.source !== undefined && <Text style={styles.rowSub} numberOfLines={1}>Fuente: {item.source}</Text>}
              {!!item.event_type && <Text style={styles.rowSub} numberOfLines={1}>Tipo de Evento: {item.event_type}</Text>}
              {!!item.created_at && <Text style={styles.rowSub} numberOfLines={1}>Fecha: {item.created_at}</Text>}
            </View>

            <Pressable onPress={() => removeService(item.id)}>
              <Text style={styles.del}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },

  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },

  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },

  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  list: { flex: 1 },

  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "800" },
});