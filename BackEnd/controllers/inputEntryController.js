const InputEntry = require("../models/inputEntry");

const getEntries = async (req, res) => {
  try {
    const entries = await InputEntry.find({ user: req.userData.id }).sort({
      createdAt: -1,
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEntry = async (req, res) => {
  try {
    const { date, category, item, quantity, unit, cost, notes } = req.body;
    if (!item || !cost) {
      return res.status(400).json({ error: "Item and cost are required" });
    }
    const entry = await InputEntry.create({
      user: req.userData.id,
      date,
      category,
      item,
      quantity,
      unit,
      cost: Number(cost),
      notes,
    });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const entry = await InputEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    if (entry.user.toString() !== req.userData.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    await InputEntry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getEntries, createEntry, deleteEntry };