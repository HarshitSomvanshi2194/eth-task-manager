const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// In-memory storage for demo
let users = [];
let tasks = [];
let userIdCounter = 1;
let taskIdCounter = 1;

const auth = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, "SECRET");
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ msg: "Unauthorized" });
  }
};

app.post("/signup", async (req, res) => {
  const existing = users.find(u => u.email === req.body.email);
  if (existing) return res.status(400).json({ msg: "User already exists" });

  const hash = await bcrypt.hash(req.body.password, 10);
  const user = { id: userIdCounter++, name: req.body.name, email: req.body.email, password: hash };
  users.push(user);
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post("/login", async (req, res) => {
  const user = users.find(u => u.email === req.body.email);
  if (!user) return res.status(400).json({ msg: "User not found" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user.id }, "SECRET");
  res.json({ token });
});

app.post("/tasks", auth, async (req, res) => {
  const task = { id: taskIdCounter++, title: req.body.title, time: req.body.time, userId: req.userId };
  tasks.push(task);
  res.json(task);
});

app.get("/tasks", auth, async (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.userId);
  res.json(userTasks);
});

app.listen(process.env.PORT || 5000, () => console.log("Server running on " + (process.env.PORT || 5000)));
