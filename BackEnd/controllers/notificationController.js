const { getRealtimeNotifications } = require("../services/notification/notificationService");

const getNotifications = async (req, res) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : 10.8505;
    const lon = req.query.lon ? parseFloat(req.query.lon) : 76.2711;
    const notifications = await getRealtimeNotifications(lat, lon);
    res.json(notifications);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = { getNotifications };
