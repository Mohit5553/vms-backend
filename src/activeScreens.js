const activeScreens = new Map();

module.exports = {
    add: (deviceId, locationId, locationName, currentVideo = null, socketId = null) => {
        activeScreens.set(deviceId, {
            deviceId,
            locationId,              // ✅ store location too
            locationName: locationName || "Unknown Location",
            currentVideo: currentVideo || null,
            socketId,
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
        for (const [deviceId, screen] of activeScreens.entries()) {
            if (screen.socketId === socketId) {
                activeScreens.delete(deviceId);
            }
        }
    },

    list: () => Array.from(activeScreens.values()),
};
