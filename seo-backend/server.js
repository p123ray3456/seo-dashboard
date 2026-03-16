require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const teamMembers = require("./routes/teamMembers");
const seoRoutes = require("./routes/seo.routes");

const app = express();

app.use(cors());
app.use(express.json());

/* ========================= */
/*        RATE LIMIT         */
/* ========================= */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});

app.use(limiter);

/* ========================= */
/*        HEALTH CHECK       */
/* ========================= */

app.get("/", (req, res) => {
  res.send("SEO Dashboard API running 🚀");
});

/* ========================= */
/*        MONGODB            */
/* ========================= */

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

const JWT_SECRET = "dgilab_secret_key";

/* ========================= */
/*     START SERVER          */
/* ========================= */

async function startServer() {
  try {

    await client.connect();

    db = client.db("seo-dashboard");

    app.locals.db = db;

    console.log("🔥 MongoDB Connected");

    /* ================= ROUTES ================= */

    app.use("/seo", seoRoutes);
    app.use("/team-members", teamMembers);

    /* ================= CLIENT APIs ================= */

    app.get("/clients", async (req, res) => {

      const data = await db
        .collection("clients")
        .find()
        .toArray();

      res.json(data);

    });


    app.get("/clients/:id", async (req, res) => {

      const clientData = await db
        .collection("clients")
        .findOne({ id: String(req.params.id) });

      if (!clientData) {
        return res.status(404).json({ message: "Client not found" });
      }

      res.json(clientData);

    });


    app.post("/clients", async (req, res) => {

      await db.collection("clients").insertOne(req.body);

      res.json({ message: "Client added successfully" });

    });


    app.put("/clients/:id", async (req, res) => {

      await db.collection("clients").updateOne(
        { id: req.params.id },
        { $set: req.body }
      );

      res.json({ message: "Client updated" });

    });


    app.delete("/clients/:id", async (req, res) => {

      await db.collection("clients").deleteOne({ id: req.params.id });

      res.json({ message: "Client deleted" });

    });

    /* ================= AGENCY TASKS ================= */

    app.get("/agency-tasks", async (req, res) => {

      const tasks = await db
        .collection("agency_tasks")
        .find()
        .toArray();

      res.json(tasks);

    });

    /* ================= AUTH APIs ================= */

    app.post("/auth/register", async (req, res) => {

      try {

        const { email, password, role, clientId } = req.body;

        const existingUser = await db
          .collection("users")
          .findOne({ email });

        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.collection("users").insertOne({
          email,
          password: hashedPassword,
          role,
          clientId: clientId || null
        });

        res.json({ message: "User registered successfully" });

      } catch (error) {

        res.status(500).json({ error: error.message });

      }

    });


    app.post("/auth/login", async (req, res) => {

      try {

        const { email, password } = req.body;

        const user = await db.collection("users").findOne({ email });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
          {
            email: user.email,
            role: user.role,
            clientId: user.clientId
          },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.json({
          message: "Login success",
          token,
          role: user.role,
          clientId: user.clientId
        });

      } catch (error) {

        res.status(500).json({ error: error.message });

      }

    });

    /* ================= MONTHLY SUMMARY ================= */

    app.get("/monthly-summary/:clientId", async (req, res) => {

      try {

        const report = await db
          .collection("monthly_reports")
          .findOne({ clientId: req.params.clientId });

        if (!report) {
          return res.json(null);
        }

        res.json(report);

      } catch (error) {

        res.status(500).json({ error: error.message });

      }

    });


    app.post("/monthly-summary", async (req, res) => {

      try {

        const data = req.body;

        await db.collection("monthly_reports").updateOne(
          { clientId: data.clientId },
          { $set: data },
          { upsert: true }
        );

        res.json({ message: "Monthly summary saved" });

      } catch (error) {

        res.status(500).json({ error: error.message });

      }

    });

    /* ================= NEXT MONTH PLAN ================= */

    app.get("/next-month-plan/:clientId", async (req, res) => {

      const plan = await db
        .collection("next_month_plans")
        .findOne({ clientId: req.params.clientId });

      res.json(plan || { roadmap: [] });

    });


    app.post("/next-month-plan", async (req, res) => {

      const data = req.body;

      await db.collection("next_month_plans").updateOne(
        { clientId: data.clientId },
        { $set: data },
        { upsert: true }
      );

      res.json({ message: "Plan saved" });

    });

    /* ================= ADMIN SETTINGS ================= */

    app.get("/admin/settings", async (req, res) => {

      const settings = await db
        .collection("agency_settings")
        .findOne({});

      res.json(settings || {});

    });


    app.post("/admin/settings", async (req, res) => {

      const data = req.body;

      await db.collection("agency_settings").updateOne(
        {},
        { $set: data },
        { upsert: true }
      );

      res.json({ message: "Settings saved" });

    });

    /* ================= SUPPORT ================= */

    app.post("/support-message", async (req, res) => {

      const data = req.body;

      await db.collection("support_messages").insertOne({
        clientId: data.clientId,
        subject: data.subject,
        message: data.message,
        createdAt: new Date()
      });

      res.json({ message: "Message saved" });

    });


    app.get("/support-messages", async (req, res) => {

      const messages = await db
        .collection("support_messages")
        .find()
        .sort({ createdAt: -1 })
        .toArray();

      res.json(messages);

    });

    /* ================= SERVER ================= */

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });

  } catch (error) {

    console.log("❌ MongoDB Error:", error);

  }
}

startServer();