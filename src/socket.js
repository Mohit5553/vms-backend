
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
        // 🔥 Always fetch device company (best source)
        const device = await Device.findOne({ deviceId })
          .populate("company_id", "name");

        if (device?.company_id?.name) {
          companyName = device.company_id.name;
        }
      } catch (err) {
        console.error("Device fetch error:", err);
      }

      // 🔥 Location name (optional)
      if (locationId) {
        try {
          const location = await Location.findById(locationId);
          if (location) locationName = location.name;
        } catch (err) {
          console.error("Location error:", err);
        }
      }
      console.log("Company:", companyName); // ✅ DEBUG

      activeScreens.add(
        deviceId,
        locationId,
        locationName,
        null,
        socket.id,
        companyName
      );
    });

    /**
     * 2️⃣ Update currently playing video (Live Preview)
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
