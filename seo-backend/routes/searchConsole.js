const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

router.get("/:siteUrl", async (req, res) => {
  try {

    const auth = new google.auth.GoogleAuth({
      keyFile: "service-account.json",
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });

    const authClient = await auth.getClient();

    const searchconsole = google.searchconsole({
      version: "v1",
      auth: authClient,
    });

    const response = await searchconsole.searchanalytics.query({
      siteUrl: req.params.siteUrl,
      requestBody: {
        startDate: "2026-02-01",
        endDate: "2026-03-01",
        dimensions: ["query"],
        rowLimit: 10,
      },
    });

    res.json(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

module.exports = router;