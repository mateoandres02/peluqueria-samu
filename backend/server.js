import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import db from "./app/database/setup.js";
import routes from "./app/routes/routes.js";
import sessionRoutes from "./app/routes/sessions.js";

// Iniciamos la aplicación con express.
const app = express();

// Middlewares.
// El middleware express.json() parsea la información que venga en las request a json para luego poder trabajarlas en esa forma.
app.use(express.json());
// Cors es un middleware que controla las solicitudes a nuestra aplicación proveniente de otras aplicaciones o servidores.
app.use(cors());

// Iniciamos la base de datos.
db.start(true);

// Endpoints.
// Le pasamos como parámetro la aplicación de express porque necesitamos usarlo como middleware con el app.use().
routes(app);
sessionRoutes(app);

// Levantamos el puerto.
app.listen(PORT, () => {
    console.log(`
        Servidor iniciado en http://localhost:${PORT}
    `);
});

export default app;