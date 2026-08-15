import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";

import { listAirlinesApi, createAirlinesApi, deleteAirlinesApi } from "../api/airlines.api";
import type { Airline } from "../types/airlines";
import { toArray } from "../types/drf";

function normalizeText(input: string): string {
  return input.trim();
}

export default function AirlinesScreen() {
  const [items, setItems] = useState<Airline[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [country, setCountry] = useState("");
  const [isActive, setActive] = useState(true);
  const [createdAt, setCreatedAt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const data = await listAirlinesApi();
      setItems(toArray(data));
    } catch {
      setErrorMessage("No se pudo cargar las erolineas. ¿Login? ¿Token?");
    }
  };

  useEffect(() => { load(); }, []);

  const createItem = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const cleanName = normalizeText(name);
      if (!cleanName) return setErrorMessage("Name es requerido");

      const created = await createAirlinesApi({
        name: cleanName,
        code: normalizeText(code),
        country: normalizeText(country),
        is_active: isActive,
        created_at: normalizeText(createdAt),
      });

      setItems((prev) => [created, ...prev]);
      setName("");
      setCode("");
      setCountry("");
      setActive(true);
      setCreatedAt("");
    } catch {
      setErrorMessage("No se pudo crear la aerolinea.");
      
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteAirlinesApi(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar la aerolinea.");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Aerolinea</Text>
            {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nombre de la aerolinea"
              placeholderTextColor="#8b949e"
              style={styles.input}
            />

            <Text style={styles.label}>Codigo de aerolinea</Text>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="AV"
              placeholderTextColor="#8b949e"
              style={styles.input}
            />

            <Text style={styles.label}>Pais</Text>
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="Ecuador"
              placeholderTextColor="#8b949e"
              style={styles.input}
            />
            <Pressable onPress={createItem} style={styles.btn}>
              <Text style={styles.btnText}>Crear</Text>
            </Pressable>

            <Pressable onPress={load} style={[styles.btn, { marginBottom: 12 }]}>
              <Text style={styles.btnText}>Refrescar</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowText} numberOfLines={1}>{item.name}</Text>
              {!!item.code && <Text style={styles.rowSub} numberOfLines={1}>{item.code}</Text>}
              {!!item.country && <Text style={styles.rowSub} numberOfLines={1}>{item.country}</Text>}
              {!!item.created_at && <Text style={styles.rowSub} numberOfLines={1}>{item.created_at}</Text>}
            </View>

            <Pressable onPress={() => removeItem(item.id)}>
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
  del: { color: "#ff7b72", fontWeight: "700" },
});