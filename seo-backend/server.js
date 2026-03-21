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

/* ========================= */
/*           CORS            */
/* ========================= */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://seo-dashboard-pakjdjkv-p123ray3456s-projects.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.use(express.json());

/* ========================= */
/*        RATE LIMIT         */
/* ========================= */

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
}));

/* ========================= */
/*       HEALTH CHECK        */
/* ========================= */

app.get("/", (req,res)=>{
  res.send("SEO Dashboard API running 🚀");
});

/* ========================= */
/*        MONGODB            */
/* ========================= */

const client = new MongoClient(process.env.MONGO_URI);
let db;

const JWT_SECRET = process.env.JWT_SECRET;

/* ========================= */
/*      START SERVER         */
/* ========================= */

async function startServer(){

try{

await client.connect();
db = client.db("seo-dashboard");

console.log("🔥 MongoDB Connected");

/* ================= ROUTES ================= */

app.use("/seo", seoRoutes);
app.use("/team-members", teamMembers);

/* ================= CLIENT APIs ================= */

app.get("/clients", async (req,res)=>{
  const data = await db.collection("clients").find().toArray();
  res.json(data);
});

app.get("/clients/:id", async (req,res)=>{
  const clientData = await db.collection("clients").findOne({
    id:String(req.params.id)
  });

  if(!clientData){
    return res.status(404).json({message:"Client not found"});
  }

  res.json(clientData);
});

app.post("/clients", async (req,res)=>{
  await db.collection("clients").insertOne(req.body);
  res.json({message:"Client added successfully"});
});

app.put("/clients/:id", async (req,res)=>{
  await db.collection("clients").updateOne(
    { id:req.params.id },
    { $set:req.body }
  );
  res.json({message:"Client updated"});
});

app.delete("/clients/:id", async (req,res)=>{
  await db.collection("clients").deleteOne({ id:req.params.id });
  res.json({message:"Client deleted"});
});

/* ================= AUTH ================= */

app.post("/auth/register", async (req,res)=>{
  try{

    const {email,password,role,clientId} = req.body;

    const existingUser = await db.collection("users").findOne({email});

    if(existingUser){
      return res.status(400).json({message:"User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    await db.collection("users").insertOne({
      email,
      password:hashedPassword,
      role,
      clientId:clientId || null
    });

    res.json({message:"User registered successfully"});

  }catch(error){
    res.status(500).json({error:error.message});
  }
});

app.post("/auth/login", async (req,res)=>{
  try{

    const {email,password} = req.body;

    const user = await db.collection("users").findOne({email});

    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    const match = await bcrypt.compare(password,user.password);

    if(!match){
      return res.status(401).json({message:"Invalid password"});
    }

    const token = jwt.sign(
      {
        email:user.email,
        role:user.role,
        clientId:user.clientId
      },
      JWT_SECRET,
      {expiresIn:"7d"}
    );

    res.json({
      message:"Login success",
      token,
      role:user.role,
      clientId:user.clientId
    });

  }catch(error){
    res.status(500).json({error:error.message});
  }
});

/* ================= MONTHLY SUMMARY ================= */

app.get("/monthly-summary/:clientId", async (req,res)=>{
  try{
    const report = await db.collection("monthly_reports")
      .findOne({clientId:req.params.clientId});

    res.json(report || null);

  }catch(error){
    res.status(500).json({error:error.message});
  }
});

app.post("/monthly-summary", async (req,res)=>{
  try{
    const data = req.body;

    await db.collection("monthly_reports").updateOne(
      { clientId:data.clientId },
      { $set:data },
      { upsert:true }
    );

    res.json({message:"Monthly summary saved"});

  }catch(error){
    res.status(500).json({error:error.message});
  }
});

/* ================= NEXT MONTH PLAN ================= */

app.get("/next-month-plan/:clientId", async (req,res)=>{
  const plan = await db.collection("next_month_plans")
    .findOne({clientId:req.params.clientId});

  res.json(plan || {roadmap:[]});
});

app.post("/next-month-plan", async (req,res)=>{
  const data = req.body;

  await db.collection("next_month_plans").updateOne(
    { clientId:data.clientId },
    { $set:data },
    { upsert:true }
  );

  res.json({message:"Plan saved"});
});

/* ================= SUPPORT ================= */

app.post("/support-message", async (req,res)=>{
  const data = req.body;

  await db.collection("support_messages").insertOne({
    clientId:data.clientId,
    subject:data.subject,
    message:data.message,
    createdAt:new Date()
  });

  res.json({message:"Message saved"});
});

app.get("/support-messages", async (req,res)=>{
  const messages = await db.collection("support_messages")
    .find()
    .sort({createdAt:-1})
    .toArray();

  res.json(messages);
});

/* =====================================================
   🔥 DAILY WORKLOG SYSTEM (FINAL CLEAN VERSION)
===================================================== */

/* ===== SAVE WORK ===== */

app.post("/worklog", async (req, res) => {
  try {

    const { clientId, date, onPage, technical, offPage } = req.body;

    if (!clientId || !date) {
      return res.status(400).json({
        message: "clientId and date required"
      });
    }

    await db.collection("worklogs").updateOne(
      { clientId: String(clientId), date },
      {
        $set: {
          clientId: String(clientId),
          date,
          onPage: onPage || [],
          technical: technical || [],
          offPage: offPage || []
        }
      },
      { upsert: true }
    );

    res.json({ message: "Worklog saved successfully" });

  } catch (error) {
    console.log("❌ Worklog Save Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ===== GET SINGLE DAY ===== */

app.get("/worklog/:clientId", async (req, res) => {
  try {

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "date query required"
      });
    }

    const data = await db.collection("worklogs").findOne({
      clientId: String(req.params.clientId),
      date
    });

    res.json(data || {
      onPage: [],
      technical: [],
      offPage: []
    });

  } catch (error) {
    console.log("❌ Worklog Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ===== GET HISTORY ===== */

app.get("/worklog-history/:clientId", async (req, res) => {
  try {

    const data = await db.collection("worklogs")
      .find({ clientId: String(req.params.clientId) })
      .sort({ date: -1 })
      .toArray();

    res.json(data);

  } catch (error) {
    console.log("❌ Worklog History Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log(`🚀 Backend running on port ${PORT}`);
});

}catch(error){
  console.log("❌ MongoDB Error:",error);
}

}

startServer();