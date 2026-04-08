const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/:clientId", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const apiKey = process.env.SERP_API_KEY;

    /* ===== GET CLIENT ===== */
    const client = await db.collection("clients").findOne({
      id: req.params.clientId
    });

    if (!client) {
      return res.json({ totalPages: 0, pages: [] });
    }

    const domain = client.domain
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "");

    /* ===== GET GSC DATA ===== */
    const gscResponse = await axios.get(
      `http://localhost:5000/api/search-console/${req.params.clientId}`
    );

    const gscData = gscResponse.data;

    /* ===== TAKE ALL KEYWORDS ===== */
    let keywords = (gscData.queries || [])
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 20)
      .map(q => q.keyword);

    /* ===== FALLBACK ===== */
    if (keywords.length === 0) {
      keywords = [
        client.name,
        client.domain,
        "best " + client.name
      ];
    }

    console.log("🔥 Keywords:", keywords);

    let pages = [];

    /* ===== LOOP KEYWORDS ===== */
    for (let keyword of keywords) {

      const response = await axios.get("https://serpapi.com/search.json", {
        params: {
          q: `${keyword} site:${domain}`, // 🔥 FORCE RESULTS
          api_key: apiKey,
          engine: "google"
        }
      });

      const results = response.data.organic_results || [];

      results.slice(0, 10).forEach(r => {
        if (r.link) {
          pages.push({
            url: r.link,
            title: r.title,
            keyword,
            position: r.position
          });
        }
      });
    }

    /* ===== REMOVE DUPLICATES ===== */
    const uniquePages = [
      ...new Map(pages.map(p => [p.url, p])).values()
    ];

    res.json({
      totalPages: uniquePages.length,
      pages: uniquePages
    });

  } catch (err) {
    console.log("AI ENGINE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;