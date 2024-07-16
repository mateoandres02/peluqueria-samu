import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import db from "./app/database/setup.js";
import routes from "./app/routes/routes.js";

const app = express();

app.use(express.json());
app.use(cors());

db.start(true);

routes(app);

app.listen(PORT, () => {
    console.log(`
        Servidor iniciado en http://localhost:${PORT}
    `);
});

export default app;