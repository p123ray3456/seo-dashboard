const express = require("express");
const router = express.Router();

router.get("/:clientId", async (req, res) => {
  try {
    const db = req.app.locals.db;

    const data = await db.collection("search_console_history").findOne({
      clientId: req.params.clientId
    });

    if (!data || !data.queries) {
      return res.json({ queries: [] });
    }

    res.json({ queries: data.queries });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;