const pool = require("./config/db");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    socket.on("joinSchool", ({ schoolId }) => {
      socket.join(`school_${schoolId}`);
      console.log(`Client joined room: school_${schoolId}`);
    });

    socket.on("sendMessage", async (data) => {
      const { text, senderId, schoolId, receiverType } = data;

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

        io.to(`school_${schoolId}`).emit("newMessage", message);
      } catch (err) {
        console.error("Socket error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};
