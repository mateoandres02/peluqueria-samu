import express from "express";
import cors from "cors";
import { config } from "./app/config/config.js";
import db from "./app/database/setup.js";
import routes from "./app/routes/routes.js";
import sessionRoutes from "./app/routes/sessions.js";

// Importamos cookie parser para guardar el token de jwt en una cookie.
import cookieParser from "cookie-parser";

// Iniciamos la aplicación con express.
const app = express();

// Middlewares.
// El middleware express.json() parsea la información que venga en las request a json para luego poder trabajarlas en esa forma.
app.use(express.json());
// Cors es un middleware que controla las solicitudes a nuestra aplicación proveniente de otras aplicaciones o servidores.
app.use(cors());
// Cookie parser.
app.use(cookieParser());

// Iniciamos la base de datos.
db.start();

// Endpoints.
// Le pasamos como parámetro la aplicación de express porque necesitamos usarlo como middleware con el app.use().
routes(app);
sessionRoutes(app);

// Levantamos el puerto.
app.listen(config.port, () => {
    console.log(`
        Servidor iniciado en http://localhost:${config.port}
    `);
});

export default app;