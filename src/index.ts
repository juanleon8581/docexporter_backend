import express from "express";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend Auth System is running!");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
