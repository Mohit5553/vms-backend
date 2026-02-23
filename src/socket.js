
const activeScreens = require("./activeScreens");
const Location = require("./models/Location"); // 🔥 ADD THIS
const Device = require("./models/Device"); // 🔥 ADD THIS

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /**
     * 1️⃣ Register device + JOIN LOCATION ROOM
     */

    socket.on("register_device", async ({ deviceId, locationId }) => {
      if (!deviceId) return;

      socket.join(`device_${deviceId}`);

      let locationName = "Unknown Location";
      let companyName = "Unknown Company";

      try {
        const device = await Device.findOne({ deviceId })
          .populate("company_id", "name");

        if (device?.company_id?.name) {
          companyName = device.company_id.name;
        }
      } catch (err) {
        console.error("Device fetch error:", err);
      }

      if (locationId) {
        try {
          const location = await Location.findById(locationId);
          if (location) locationName = location.name;
        } catch (err) {
          console.error("Location error:", err);
        }
      }

      activeScreens.add(
        deviceId,
        locationId,
        locationName,
        null,
        socket.id,
        companyName
      );

      // 🔥 ADD THIS
      io.emit("live_screens_update", activeScreens.list());
    });

    /**
     * 2️⃣ Update currently playing video (Live Preview)
     */
    socket.on("playing_video", ({ deviceId, videoPath, currentTime }) => {
      activeScreens.updateVideo(deviceId, videoPath, currentTime);
      io.emit("live_screens_update", activeScreens.list());
    });

    /**
     * 3️⃣ Remove screen on disconnect
     */
    socket.on("disconnect", () => {
      activeScreens.removeBySocketId(socket.id);

      // 🔥 ADD THIS
      io.emit("live_screens_update", activeScreens.list());
    });
  });
};
