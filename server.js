// const express = require("express");
// const mysql = require("mysql2");
// const bodyParser = require("body-parser");
// const path = require("path");

// const app = express();
// app.use(express.static(path.join(__dirname, "public")));
// app.use(bodyParser.json());

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Vrushabh@9322",
//   database: "diwali2",
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("✅ Connected to MySQL");
// });

// // Create table if not exists
// db.query(`
//   CREATE TABLE IF NOT EXISTS wishes (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255),
//     message TEXT
//   )
// `);

// // API to get wishes
// app.get("/api/wishes", (req, res) => {
//   db.query("SELECT * FROM wishes ORDER BY id DESC", (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

// // API to post a wish
// app.post("/api/wish", (req, res) => {
//   const { name, message } = req.body;
//   db.query("INSERT INTO wishes (name, message) VALUES (?, ?)", [name, message], (err, result) => {
//     if (err) throw err;
//     res.json({ id: result.insertId, name, message });
//   });
// });

// const PORT = 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// ✅ MySQL connection (Render / PlanetScale compatible)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "diwali2",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : false
});

// ✅ Connect to DB
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// ✅ Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS wishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    message TEXT
  )
`);

// ✅ Fetch all wishes
app.get("/api/wishes", (req, res) => {
  db.query("SELECT * FROM wishes ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Add a new wish
app.post("/api/wish", (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Name and message required" });
  }
  db.query(
    "INSERT INTO wishes (name, message) VALUES (?, ?)",
    [name, message],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ id: result.insertId, name, message });
    }
  );
});

// ✅ Handle SPA routes (optional)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Render-compatible dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
