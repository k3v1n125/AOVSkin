const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.static("."));
app.use(express.json());

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]");
}

const readData = () =>
  JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

const writeData = (data) =>
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// POST: Add new skin
app.post("/submit", (req, res) => {
  const { hero, skin, owned } = req.body;
  const data = readData();
  data.push({ hero, skin, owned: !!owned });
  writeData(data);
  res.sendStatus(200);
});

// GET: Retrieve all data
app.get("/data", (req, res) => {
  const data = readData();
  res.json(data);
});

// PUT: Edit an existing entry by ID
app.put("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { owned } = req.body;
  const data = readData();

  if (id < 0 || id >= data.length) {
    return res.status(400).send("Invalid ID");
  }

  data[id] = {
    ...data[id],
    owned: !!owned
  };

  writeData(data);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
