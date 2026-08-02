const inputEntryService = require("../services/crop/inputEntryService");

const getEntries = async (req, res) => {
  try {
    const entries = await inputEntryService.getUserEntries(req.userData.id);
    res.json(entries);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const createEntry = async (req, res) => {
  try {
    const entry = await inputEntryService.createInputEntry(req.userData.id, req.body);
    res.json(entry);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const result = await inputEntryService.deleteInputEntry(req.userData.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = { getEntries, createEntry, deleteEntry };