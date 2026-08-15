import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Gate, listGatesAdminApi, createGateApi, updateGateApi, deleteGateApi } from "../api/gates.api";

export default function AdminGatesPage() {
  const [items, setItems] = useState<Gate[]>([]);
  const [code, setCode] = useState("");
  const [terminal, setTerminal] = useState("");
  const [is_available, setAvailable] = useState(true);
  const [created_at, setCreatedAt] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");


  const load = async () => {
    try {
      setError("");
      const data = await listGatesAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar gates. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!code.trim()) return setError("Nombre requerido");

      if (editId) await updateGateApi(editId, {code: code.trim(), terminal: terminal.trim(), is_available, created_at});
      else await createGateApi({code: code.trim(), terminal: terminal.trim(), is_available, created_at});

      setCode("");
      setTerminal("");
      setAvailable(true);
      setCreatedAt("")
      await load();
    } catch {
      setError("No se pudo guardar gate. ¿Token admin?");
    }
  };

  const startEdit = (g: Gate) => {
    setEditId(g.id);
    setCode(g.code);
    setTerminal(g.terminal);
    setAvailable(g.is_available);
    setCreatedAt(g.created_at);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteGateApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar la puerta de embarque. ¿Vuelos asociados? ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Gates (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Puerta de Embarque" value={code} onChange={(e) => setCode(e.target.value)} fullWidth />
          <TextField label="Terminal" value={terminal} onChange={(e) => setTerminal(e.target.value)} fullWidth />
          <TextField label="Disponible" value={is_available} onChange={(e) => setAvailable(true)} fullWidth />  
          <TextField label="Creada a las" value={created_at} onChange={(e) => setCreatedAt(e.target.value)} fullWidth />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setCode(""); setTerminal(""); setAvailable(true); setCreatedAt(""); setEditId(null); }}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Codigo de Embarque</TableCell>
              <TableCell>Terminal</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell>Creada a las</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((g) => (
              <TableRow key={g.id}>
                <TableCell>{g.id}</TableCell>
                <TableCell>{g.code}</TableCell>
                <TableCell>{g.terminal}</TableCell>
                <TableCell>{g.is_available}</TableCell>
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