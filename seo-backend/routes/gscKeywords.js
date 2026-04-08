const express = require("express");
const router = express.Router();

/* ================= GET GSC KEYWORDS ================= */

router.get("/:clientId", async (req, res) => {
  try {
    const db = req.app.locals.db;

    // 🔥 You already store GSC data somewhere
    const gscData = await db.collection("gsc_data").findOne({
      clientId: req.params.clientId,
    });

    if (!gscData) {
      return res.json({ keywords: [] });
    }

    // 🔥 Extract top queries
    const keywords = gscData.queries
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 20) // top 20
      .map(q => q.query);

    res.json({ keywords });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;