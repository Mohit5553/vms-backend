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
            companyName,
            connectedAt: new Date(),
        });
    },

    // ✅ ADD THIS
    get: (deviceId) => activeScreens.get(deviceId),

    updateVideo: (deviceId, currentVideo, currentTime = null) => {
        if (activeScreens.has(deviceId)) {
            const data = activeScreens.get(deviceId);
            data.currentVideo = currentVideo;

            if (currentTime !== null) {
                data.currentTime = currentTime;
            }

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