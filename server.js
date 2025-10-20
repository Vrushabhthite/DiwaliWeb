const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vrushabh@9322",
  database: "diwali2",
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to MySQL");
});

// Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS wishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    message TEXT
  )
`);

// API to get wishes
app.get("/api/wishes", (req, res) => {
  db.query("SELECT * FROM wishes ORDER BY id DESC", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// API to post a wish
app.post("/api/wish", (req, res) => {
  const { name, message } = req.body;
  db.query("INSERT INTO wishes (name, message) VALUES (?, ?)", [name, message], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, name, message });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
