const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

const pool = new Pool({
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || "homework7",
});

app.locals.pool = pool;

app.get("/", (req, res) => {
    res.send("Express app is running.");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
