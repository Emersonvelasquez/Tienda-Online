import express from "express";
import  RouterApi  from "./routes/index.js";


const app = express();
const port = 3000;

app.use(express.json());
RouterApi(app)

app.listen(port, () => {
console.log(`Servidor corriendo en http://localhost:${port}`);
});
