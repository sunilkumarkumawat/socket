const pool = require("../config/db");

exports.updateLocation = async (req, res) => {
  const { user_id, lat, lng, school_id } = req.body;

  console.log("📥 Received Location:", req.body);

  if (!user_id || !lat || !lng) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO user_locations (user_id, lat, lng, school_id) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE lat = VALUES(lat), lng = VALUES(lng), updated_at = CURRENT_TIMESTAMP`,
      [user_id, lat, lng, school_id]
    );

    console.log("✅ DB Query Result:", result);

    res.status(200).json({ success: true, message: "Location updated" });
  } catch (error) {
    console.error("❌ DB Insert Error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
};
