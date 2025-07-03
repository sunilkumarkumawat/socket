const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/location", require("./routes/locationRoutes")); // ✅ Add this

// Sockets
io.on("connection", (socket) => {
  console.log("🟢 Client connected");

  socket.on("joinSchool", ({ schoolId }) => {
    socket.join(schoolId);
    console.log(`Joined school room: ${schoolId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
