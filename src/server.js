const http = require("http");
const connectDB = require("./config/db");
require("dotenv").config();

const app = require("./app");
const server = http.createServer(app);

connectDB();

const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

const socketInstance = require("./socketInstance");
socketInstance.setIO(io); // 🔥 SET ONCE

require("./socket")(io);

server.listen(5000, () => {
  console.log("Backend running on port 5000");
});
