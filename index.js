const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", require("./routes/chatRoutes"));

// Socket
require("./socket")(io);

// Start Server
server.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port ${process.env.PORT}`);
});
