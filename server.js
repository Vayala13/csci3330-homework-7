const express = require("express");
const path = require("path");
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

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/stats", async (req, res) => {
    try {
        const customers = await pool.query("SELECT count(*) FROM customers");
        const revenue = await pool.query("SELECT sum(saleamount) FROM sales");
        const orderCount = await pool.query("SELECT count(quantity) FROM orders");
        const orderQuantity = await pool.query("SELECT sum(quantity) FROM orders");
        const issues = await pool.query("SELECT count(id) FROM alerts WHERE type = 'issues'");
        const notifications = await pool.query("SELECT count(id) FROM alerts WHERE type = 'notifications'");

        res.json({
            customers: Number(customers.rows[0].count),
            revenue: Number(revenue.rows[0].sum),
            orderCount: Number(orderCount.rows[0].count),
            orders: Number(orderQuantity.rows[0].sum),
            issues: Number(issues.rows[0].count),
            notifications: Number(notifications.rows[0].count),
        });
    } catch (error) {
        res.status(500).json({ error: "Could not load dashboard stats" });
    }
});

app.get("/api/sales", async (req, res) => {
    try {
        const sales = await pool.query(`
            SELECT products.name, sales.quantity, sales.saleamount
            FROM sales
            LEFT JOIN products ON
            sales.productid = products.id
            ORDER BY sales.id ASC
        `);

        res.json(sales.rows);
    } catch (error) {
        res.status(500).json({ error: "Could not load sales" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
