const pool = require("../config/db");
const { sendFCM } = require("../config/firebase");

exports.sendMessage = async (req, res) => {
  const { text, senderId, schoolId, receiverType, fcmTokens } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO messages (text, sender_id, school_id, receiver_type) VALUES (?, ?, ?, ?)",
      [text, senderId, schoolId, receiverType]
    );

    const message = {
      id: result.insertId,
      text,
      sender_id: senderId,
      school_id: schoolId,
      receiver_type: receiverType,
      created_at: new Date(),
    };

    // Push notification
    if (fcmTokens && fcmTokens.length > 0) {
      await sendFCM(fcmTokens, {
        title: "New Message",
        body: text,
      });
    }

    res.status(200).json({ success: true, message });
  } catch (err) {
  console.error("❌ MySQL insert error:", err);  // <--- ADD THIS
  res.status(500).json({ success: false, error: "Message send failed" });
}
};
