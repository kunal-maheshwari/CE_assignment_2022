const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//---------- ROUTES ----------//

// GET DATA
app.get("/showProjects", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * from projects ORDER BY created_at DESC;");
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

// ADD DATA
app.post("/addProject", async (req, res) => {
  try {
    const { name, description, skills, members, is_active } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO projects (name, description, skills, members, is_active) values ($1, $2, $3, $4, $5) RETURNING *;",
      [name, description, skills, members, is_active]
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

// EDIT DATA
app.post("/editProject/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const keys = Object.keys(req.body);
    let fields = [];
    for (let i = 0; i < keys.length; i++) {
      fields.push(`${keys[i]} = $${i + 1}`);
    }
    const { rows } = await pool.query(
      `UPDATE projects SET ${fields.join()} WHERE projects_id = ${id} RETURNING *;`,
      Object.values(req.body)
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

// DELETE DATA
app.delete("/deleteProject/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `DELETE from projects WHERE projects_id = ${id} RETURNING *;`,
      Object.values(req.body)
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000, () => {
  console.log("server started at 5000");
});
