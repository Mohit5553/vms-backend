const activeScreens = new Map();

module.exports = {
    add: (
        deviceId,
        locationId,
        locationName,
        currentVideo = null,
        socketId = null,
        companyName = "Unknown"
    ) => {
        activeScreens.set(deviceId, {
            deviceId,
            locationId,
            locationName,
            currentVideo,
            socketId,
            companyName, // 🔥 ADD THIS
            connectedAt: new Date(),
        });
    },


    updateVideo: (deviceId, currentVideo) => {
        if (activeScreens.has(deviceId)) {
            const data = activeScreens.get(deviceId);
            data.currentVideo = currentVideo;
            activeScreens.set(deviceId, data);
        }
    },

    updateSocketId: (deviceId, socketId) => {
        if (activeScreens.has(deviceId)) {
            const data = activeScreens.get(deviceId);
            data.socketId = socketId;
            activeScreens.set(deviceId, data);
        }
    },

    remove: (deviceId) => activeScreens.delete(deviceId),

    removeBySocketId: (socketId) => {
        for (const [key, screen] of activeScreens.entries()) {
            if (screen.socketId === socketId) {
                activeScreens.delete(key);
            }
        }
    },


    list: () => Array.from(activeScreens.values()),
};
