const activeScreens = require("./activeScreens"); // Map file

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /**
     * 1️⃣ Register device + JOIN LOCATION ROOM
     */
    socket.on("register_device", ({ deviceId, locationId, locationName }) => {
      if (!deviceId) {
        console.log("❌ No deviceId provided!");
        return;
      }

      // 🔥 JOIN UNIQUE DEVICE ROOM (MAC based)
      socket.join(`device_${deviceId}`);

      activeScreens.add(
        deviceId,
        locationId,
        locationName || "Unknown Location",
        null,
        socket.id
      );

      console.log(`Screen ${deviceId} joined room: device_${deviceId}`);
    });

    /**
     * 2️⃣ Update currently playing video (for Admin preview)
     */
    socket.on("playing_video", ({ deviceId, videoPath }) => {
      activeScreens.updateVideo(deviceId, videoPath);
    });

    /**
     * 3️⃣ Remove screen on disconnect
     */
    socket.on("disconnect", () => {
      activeScreens.removeBySocketId(socket.id);
    });
  });
};
