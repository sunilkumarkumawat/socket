// routes/locationRoutes.js
const express = require("express");
const router = express.Router();

router.post("/update", (req, res) => {
  const { user_id, lat, lng, school_id } = req.body;

  if (!user_id || !lat || !lng || !school_id) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  // You can also store this in DB if needed
  console.log(`📍 Location update from ${user_id}: ${lat}, ${lng}`);

  // Broadcast to frontend via Socket.IO
  req.io.to(school_id).emit("driverLocation", { user_id, lat, lng });

  res.status(200).json({ success: true, message: "Location updated" });
});

module.exports = router;
