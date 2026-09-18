const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    database: "likeme",
    port: 5432
});

pool.query("SELECT NOW()")
    .then(() => console.log("Conexión a PostgreSQL exitosa"))
    .catch((error) => console.error("Error de conexión:", error.message));

app.get("/posts", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM posts");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener los posts"
        });
    }
});

app.post("/posts", async (req, res) => {
    try {
        const { titulo, url, descripcion } = req.body;

        const consulta = `
            INSERT INTO posts (titulo, img, descripcion, likes)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const valores = [titulo, url, descripcion, 0];

        const { rows } = await pool.query(consulta, valores);

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al crear el post"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});