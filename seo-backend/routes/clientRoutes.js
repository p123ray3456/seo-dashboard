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
// 🔥 UPDATE CLIENT KEYWORDS
router.put("/:clientId/keywords", async (req, res) => {
  try {
    const { clientId } = req.params;
    const { keywords } = req.body;

    if (!Array.isArray(keywords)) {
      return res.status(400).json({ error: "Keywords must be array" });
    }

    const updatedClient = await Client.findOneAndUpdate(
      { id: clientId },
      { keywords },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({
      message: "Keywords updated successfully",
      data: updatedClient,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
