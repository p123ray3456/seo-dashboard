const express = require("express");
const router = express.Router();

/* GET ALL MEMBERS */
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;

    const members = await db
      .collection("team_members")
      .find()
      .toArray();

    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

/* ADD MEMBER */
router.post("/", async (req, res) => {
  try {
    const db = req.app.locals.db;

    const { name, email, role } = req.body;

    const newMember = {
      name,
      email,
      role,
      status: "Active",
      createdAt: new Date(),
    };

    const result = await db
      .collection("team_members")
      .insertOne(newMember);

    res.json(result);
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({ error: "Failed to add member" });
  }
});

/* DELETE MEMBER */
router.delete("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { ObjectId } = require("mongodb");

    await db
      .collection("team_members")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    res.json({ message: "Member deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* UPDATE MEMBER */
router.put("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { ObjectId } = require("mongodb");

    await db.collection("team_members").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    res.json({ message: "Member updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;