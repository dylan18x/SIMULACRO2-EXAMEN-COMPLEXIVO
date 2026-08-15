import { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { type Flight, listFlightsPublicApi } from "../api/flights.api";

export default function PublicFlightPage() {
  const [items, setItems] = useState<Flight[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listFlightsPublicApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar la lista pública. ¿Backend encendido?");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2
          }}>
          <Typography variant="h5">Lista de Vuelos (Público)</Typography>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Puerta de Embarque</TableCell>
              <TableCell>Codigo de Embarque</TableCell>
              <TableCell>Numero de Vuelo</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Hora de Despegue</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}