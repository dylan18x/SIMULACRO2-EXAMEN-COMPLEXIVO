import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Gate, listGatesAdminApi } from "../api/gates.api";
import { type Flight, listFlightsAdminApi, createFlightApi, updateFlightApi, deleteFlightApi } from "../api/flights.api";

export default function AdminFlightsPage() {
  const [items, setItems] = useState<Flight[]>([]);
  const [gates, setGates] = useState<Gate[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [gate, setGate] = useState<number>(0);
  const [gateCode, setGateCode] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listFlightsAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
    }
  };

  const loadGates = async () => {
    try {
      const data = await listGatesAdminApi();
      setGates(data.results); // DRF paginado
      if (!gate && data.results.length > 0) setGate(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadGates(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!gate) return setError("Seleccione una gate");
      if (!gateCode.trim() || 
          !flightNumber.trim() || 
          !destination.trim() || 
          !status.trim() || 
          !departureTime.trim()
        ) return setError("Faltan campos requeridos");

      const payload = {
        gate: Number(gate),
        gateCode: gateCode.trim(),
        flightNumber: flightNumber.trim(),
        destination: destination.trim(),
        status: status.trim(),
        departureTime: departureTime.trim(),
        createdAt: createdAt.trim()
      };

      if (editId) await updateFlightApi(editId, payload);
      else await createFlightApi(payload as any);

      setEditId(null);
      setGate(0);
      setGateCode("");
      setFlightNumber("");
      setDestination("");
      setStatus("");
      setDepartureTime("");
      setCreatedAt("");
      await load();
    } catch {
      setError("No se pudo guardar el vuelo. ¿Token admin?");
    }
  };

  const startEdit = (f: Flight) => {
    setEditId(f.id);
    setGate(f.gate);
    setGateCode(f.gate_code);
    setFlightNumber(f.flight_number);
    setDestination(f.destination);
    setStatus(f.destination);
    setDepartureTime(f.departure_time);
    setCreatedAt(f.created_at);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteFlightApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar el vuelo. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Vuelos (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="gate-label">Gate</InputLabel>
              <Select
                labelId="gate-label"
                label="Gate"
                value={gate}
                onChange={(e) => setGate(Number(e.target.value))}
              >
                {gates.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.code} (#{m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Codigo de Embarque" value={gateCode} onChange={(e) => setGateCode(e.target.value)} fullWidth />
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Numero de Vuelo" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} sx={{ width: 220 }} />
            <TextField label="Destino" value={destination} onChange={(e) => setDestination(e.target.value)} sx={{ width: 220 }} />
            <TextField label="Estado" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: 220 }} />
            <TextField label= "Despegue" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} sx={{ width: 220 }} />    
            <TextField label="Creada a las" value={createdAt} onChange={(e) => setCreatedAt(e.target.value)} sx={{ width: 220 }} />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setGateCode(""); setDestination(""); setStatus(""); 
                                                        setDepartureTime(""); setCreatedAt(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadGates(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Puerta de Embarque</TableCell>
              <TableCell>Codigo de Embarque</TableCell>
              <TableCell>Numero de Vuelo</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Despegue</TableCell>
              <TableCell>Fecha de Creacion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((g) => (
              <TableRow key={g.id}>
                <TableCell>{g.id}</TableCell>
                <TableCell>{g.gate}</TableCell>
                <TableCell>{g.gate_code}</TableCell>
                <TableCell>{g.flight_number}</TableCell>
                <TableCell>{g.destination}</TableCell>
                <TableCell>{g.status}</TableCell>
                <TableCell>{g.departure_time}</TableCell>
                <TableCell>{g.created_at}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(g)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(g.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}