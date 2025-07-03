const pool = require("../config/db");
const { sendFCM } = require("../config/firebase");

exports.sendMessage = async (req, res) => {
  const { text, senderId, schoolId, receiverType, fcmTokens } = req.body;

  console.log("📥 Received Data:", { text, senderId, schoolId, receiverType, fcmTokens });

  try {
    // 📝 Insert message into DB
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

    // 🔔 Send push notification if tokens provided
    if (fcmTokens && fcmTokens.length > 0) {
      try {
        await sendFCM(fcmTokens, {
          title: "New Message",
          body: text,
        });
        console.log("✅ Push sent to tokens:", fcmTokens);
      } catch (pushError) {
        console.warn("⚠️ Push notification failed but message was saved:", pushError.message);
        // Optionally continue even if FCM fails
      }
    }

    // ✅ Return success with message
    res.status(200).json({ success: true, message });

  } catch (err) {
    console.error("❌ MySQL insert error:", err);
    res.status(500).json({ success: false, error: "Message send failed" });
  }
};
