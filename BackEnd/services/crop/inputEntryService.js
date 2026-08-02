const InputEntry = require("../../models/inputEntry");

async function getUserEntries(userId) {
  return await InputEntry.find({ user: userId }).sort({ createdAt: -1 });
}

async function createInputEntry(userId, data) {
  const { date, category, item, quantity, unit, cost, notes } = data;
  if (!item || !cost) {
    throw { status: 400, message: "Item and cost are required" };
  }
  return await InputEntry.create({
    user: userId,
    date,
    category,
    item,
    quantity,
    unit,
    cost: Number(cost),
    notes,
  });
}

async function deleteInputEntry(userId, entryId) {
  const entry = await InputEntry.findById(entryId);
  if (!entry) {
    throw { status: 404, message: "Entry not found" };
  }
  if (entry.user.toString() !== userId) {
    throw { status: 403, message: "Not authorized to delete this entry" };
  }
  await InputEntry.findByIdAndDelete(entryId);
  return { success: true };
}

module.exports = {
  getUserEntries,
  createInputEntry,
  deleteInputEntry,
};
