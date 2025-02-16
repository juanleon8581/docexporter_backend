import express from "express";
import envs from "./config/envs";

const app = express();
const port = envs.PORT ?? 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Backend en funcionamiento!");
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
