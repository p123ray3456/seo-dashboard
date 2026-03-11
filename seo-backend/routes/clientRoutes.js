const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// Add new client
router.post("/add", async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all clients
router.get("/all", async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
});

module.exports = router;
