let io = null;

module.exports = {
  setIO: (serverIO) => {
    io = serverIO;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  },
};
