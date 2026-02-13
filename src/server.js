

const http = require("http");
const connectDB = require("./config/db");
require("dotenv").config();

const app = require("./app");
const server = http.createServer(app);

connectDB();

/* ================= SOCKET.IO ================= */

const io = require("socket.io")(server, {
  cors: {
    origin: true,        // ✅ allow all origins
    credentials: true,
  },
});

const socketInstance = require("./socketInstance");
socketInstance.setIO(io);

require("./socket")(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});


