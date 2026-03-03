const InputEntry = require("../models/inputEntry");
const { getUserFromToken } = require("../middleware/auth");

const getEntries = async (req, res) => {
  try {
    const userData = await getUserFromToken(req);
    const entries = await InputEntry.find({ user: userData.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch {
    res.status(401).json({ error: "Not authenticated" });
  }
};

const createEntry = async (req, res) => {
  try {
    const userData = await getUserFromToken(req);
    const { date, category, item, quantity, unit, cost, notes } = req.body;
    if (!item || !cost) return res.status(400).json({ error: "Item and cost are required" });
    const entry = await InputEntry.create({
      user: userData.id,
      date, category, item, quantity, unit,
      cost: Number(cost),
      notes,
    });
    res.json(entry);
  } catch {
    res.status(401).json({ error: "Not authenticated" });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const userData = await getUserFromToken(req);
    const entry = await InputEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    if (entry.user.toString() !== userData.id)
      return res.status(403).json({ error: "Not authorized" });
    await InputEntry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(401).json({ error: "Not authenticated" });
  }
};

module.exports = { getEntries, createEntry, deleteEntry };