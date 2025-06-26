const admin = require("firebase-admin");
const path = require("path");

// Convert relative path to absolute
const serviceAccountPath = path.resolve(__dirname, "../firebase-service-account.json");
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendFCM = async (tokens, payload) => {
  try {
    const message = {
      notification: payload,
      tokens,
    };
    await admin.messaging().sendMulticast(message);
  } catch (error) {
    console.error("FCM Error:", error);
  }
};
