import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import db from "./app/database/setup.js";
import routes from "./app/routes/routes.js";
import session from "./app/controllers/session.controller.js";
// import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());
app.use(cors());

db.start(true);

routes(app);

app.post('/login', session.login);
app.post('/register', session.register);
app.post('/logout', session.logout);
// app.get('/protected', session.routeProtected);

app.listen(PORT, () => {
    console.log(`
        Servidor iniciado en http://localhost:${PORT}
    `);
});

export default app;