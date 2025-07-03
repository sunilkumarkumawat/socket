const admin = require("firebase-admin");
const path = require("path");

// Convert relative path to absolute
const serviceAccountPath = path.resolve(__dirname, "../firebase-service-account.json");
const serviceAccount = require(serviceAccountPath);

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ✅ Push function with fallback and logs
exports.sendFCM = async (tokens, payload) => {
  try {
    // Use sendMulticast if available (Firebase Admin SDK v9+)
    if (typeof admin.messaging().sendMulticast === "function") {
      const message = {
        tokens,
        notification: {
          title: payload.title,
          body: payload.body,
        },
      };

      const response = await admin.messaging().sendMulticast(message);
      console.log(`✅ FCM sent: ${response.successCount} success, ${response.failureCount} failed`);
      return response;
    }

    // Fallback: loop through tokens and send individually
    console.warn("⚠️ sendMulticast not available, falling back to send() one-by-one.");
    for (const token of tokens) {
      await admin.messaging().send({
        token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
      });
      console.log(`✅ Sent to token: ${token}`);
    }

    return { successCount: tokens.length, failureCount: 0 };
  } catch (error) {
    console.error("❌ FCM Error:", error.message);
    throw error;
  }
};
