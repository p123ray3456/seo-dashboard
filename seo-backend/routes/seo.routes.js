const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

/* =====================================================
   GOOGLE SEARCH CONSOLE AUTH
===================================================== */

const getSearchConsoleClient = async () => {

  const auth = new google.auth.GoogleAuth({
    keyFile: "../service-account.json",
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const authClient = await auth.getClient();

  return google.searchconsole({
    version: "v1",
    auth: authClient,
  });

};

/* =====================================================
   SEARCH CONSOLE (KEYWORDS)
===================================================== */

router.get("/search-console", async (req, res) => {

  try {

    const { clientId, range } = req.query;

    if (!clientId)
      return res.status(400).json({ error: "Client ID required" });

    const db = req.app.locals.db;

    const client = await db.collection("clients").findOne({
      id: String(clientId),
    });

    if (!client || !client.gscSiteUrl)
      return res.status(404).json({ error: "Client or GSC URL missing" });

    const days = Number(range) || 30;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const searchconsole = await getSearchConsoleClient();

    const response = await searchconsole.searchanalytics.query({

      siteUrl: client.gscSiteUrl,

      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ["query"],
        rowLimit: 50,
      },

    });

    res.json(response.data || { rows: [] });

  } catch (error) {

    console.error("Search Console Error:", error.message);
    res.status(500).json({ error: error.message });

  }

});


/* =====================================================
   OVERVIEW DATA
===================================================== */

router.get("/overview", async (req, res) => {

  try {

    const { clientId, range } = req.query;

    if (!clientId)
      return res.status(400).json({ error: "Client ID required" });

    const db = req.app.locals.db;

    const client = await db.collection("clients").findOne({
      id: String(clientId),
    });

    if (!client || !client.gscSiteUrl)
      return res.status(404).json({ error: "Client or GSC URL missing" });

    const days = Number(range) || 30;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const searchconsole = await getSearchConsoleClient();

    const dateData = await searchconsole.searchanalytics.query({

      siteUrl: client.gscSiteUrl,

      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ["date"],
      },

    });

    const queryData = await searchconsole.searchanalytics.query({

      siteUrl: client.gscSiteUrl,

      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ["query"],
        rowLimit: 5,
      },

    });

    const pageData = await searchconsole.searchanalytics.query({

      siteUrl: client.gscSiteUrl,

      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ["page"],
        rowLimit: 5,
      },

    });

    res.json({
      dateRows: dateData.data?.rows || [],
      queryRows: queryData.data?.rows || [],
      pageRows: pageData.data?.rows || [],
    });

  } catch (error) {

    console.error("Overview Error:", error.message);
    res.status(500).json({ error: error.message });

  }

});


/* =====================================================
   TRAFFIC GROWTH (FIXED WITH DAILY TREND)
===================================================== */

router.get("/traffic-growth", async (req, res) => {

  try {

    const { clientId, range } = req.query;

    if (!clientId)
      return res.status(400).json({ error: "Client ID required" });

    const db = req.app.locals.db;

    const client = await db.collection("clients").findOne({
      id: String(clientId),
    });

    if (!client || !client.gscSiteUrl)
      return res.status(404).json({ error: "Client or GSC URL missing" });

    const days = Number(range) || 90;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const prevEnd = new Date(startDate);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevEnd.getDate() - days);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const searchconsole = await getSearchConsoleClient();

    /* DAILY DATA FOR CHART */

    const dailyData = await searchconsole.searchanalytics.query({

      siteUrl: client.gscSiteUrl,

      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ["date"],
        rowLimit: 200,
      },

    });

    /* CURRENT PERIOD */

    const current = await searchconsole.searchanalytics.query({

      siteUrl: client.gscSiteUrl,

      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      },

    });

    /* PREVIOUS PERIOD */

    const previous = await searchconsole.searchanalytics.query({

      siteUrl: client.gscSiteUrl,

      requestBody: {
        startDate: formatDate(prevStart),
        endDate: formatDate(prevEnd),
      },

    });

    const currentClicks =
      current.data?.rows?.reduce((sum, r) => sum + r.clicks, 0) || 0;

    const previousClicks =
      previous.data?.rows?.reduce((sum, r) => sum + r.clicks, 0) || 0;

    const growth =
      previousClicks === 0
        ? 0
        : ((currentClicks - previousClicks) / previousClicks) * 100;

    /* FORMAT DAILY CHART */

    const chart = (dailyData.data?.rows || []).map(r => ({
      date: r.keys[0],
      clicks: r.clicks,
    }));

    res.json({

      currentClicks,
      previousClicks,
      growth: growth.toFixed(2),
      chart,

    });

  } catch (error) {

    console.error("Traffic Growth Error:", error.message);
    res.status(500).json({ error: error.message });

  }

});


/* =====================================================
   WORK LOG (GET)
===================================================== */

router.get("/work-log", async (req, res) => {

  try {

    const { clientId, month } = req.query;

    if (!clientId || !month)
      return res.status(400).json({
        error: "Client ID and month required",
      });

    const db = req.app.locals.db;

    const log = await db.collection("workLogs").findOne({
      clientId: String(clientId),
      month,
    });

    res.json(log || { logs: [], status: "", health: 0 });

  } catch (error) {

    console.error("Work Log GET Error:", error.message);
    res.status(500).json({ error: error.message });

  }

});


/* =====================================================
   WORK LOG (SAVE)
===================================================== */

router.post("/work-log", async (req, res) => {

  try {

    const { clientId, month, status, health, logs } = req.body;

    if (!clientId || !month)
      return res.status(400).json({
        error: "Client ID and month required",
      });

    const db = req.app.locals.db;

    await db.collection("workLogs").updateOne(

      { clientId: String(clientId), month },

      {
        $set: {
          clientId: String(clientId),
          month,
          status,
          health,
          logs,
        },
      },

      { upsert: true }

    );

    res.json({ message: "Work log saved successfully" });

  } catch (error) {

    console.error("Work Log SAVE Error:", error.message);
    res.status(500).json({ error: error.message });

  }

});

/* =====================================================
   LEADS (GET)
===================================================== */

router.get("/leads", async (req, res) => {

  try {

    const { clientId, month } = req.query;

    if (!clientId || !month) {
      return res.status(400).json({
        error: "Client ID and month required"
      });
    }

    const db = req.app.locals.db;

    const data = await db.collection("leads").findOne({
      clientId: String(clientId),
      month: String(month)
    });

    res.json(data || null);

  } catch (error) {

    console.error("Leads GET Error:", error.message);

    res.status(500).json({
      error: error.message
    });

  }

});


/* =====================================================
   LEADS (SAVE)
===================================================== */

router.post("/leads", async (req, res) => {

  try {

    const { clientId, month, totalLeads, converted, sourceBreakdown } = req.body;

    if (!clientId || !month) {
      return res.status(400).json({
        error: "Client ID and month required"
      });
    }

    const db = req.app.locals.db;

    await db.collection("leads").updateOne(

      { clientId: String(clientId), month: String(month) },

      {
        $set: {
          clientId: String(clientId),
          month: String(month),
          totalLeads,
          converted,
          sourceBreakdown
        }
      },

      { upsert: true }

    );

    res.json({ message: "Leads saved successfully" });

  } catch (error) {

    console.error("Leads SAVE Error:", error.message);

    res.status(500).json({
      error: error.message
    });

  }

});
module.exports = router;