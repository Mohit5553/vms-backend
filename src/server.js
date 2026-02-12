// const http = require("http");
// const connectDB = require("./config/db");
// require("dotenv").config();

// const app = require("./app");
// const server = http.createServer(app);

// connectDB();

// const io = require("socket.io")(server, {
//   cors: { origin: "*" },
// });

// const socketInstance = require("./socketInstance");
// socketInstance.setIO(io); // 🔥 SET ONCE

// require("./socket")(io);

// server.listen(5000, () => {
//   console.log("Backend running on port 5000");
// });

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


// const http = require("http");
// const connectDB = require("./config/db");
// require("dotenv").config();

// const app = require("./app");
// const server = http.createServer(app);

// connectDB();

// /* ================= CORS ORIGINS ================= */
// const allowedOrigins = [
//   "http://localhost:5173",
//   // "https://jts-vm.netlify.app",
//   "https://jts-vms.vercel.app"   // ✅ ADD THIS

// ];

// /* ================= SOCKET.IO ================= */
// const io = require("socket.io")(server, {
//   cors: {
//     origin: allowedOrigins,
//     credentials: true,
//   },
// });

// const socketInstance = require("./socketInstance");
// socketInstance.setIO(io);

// require("./socket")(io);

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`Backend running on port ${PORT}`);
// });
