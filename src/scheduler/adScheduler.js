const Advertisement = require("../models/Advertisement");
const socketInstance = require("../socketInstance");

const startAdScheduler = () => {
    console.log("Ad Scheduler started...");

    setInterval(async () => {
        try {
            const now = new Date();

            const currentDay = now.toLocaleString("en-US", {
                weekday: "long",
            });

            const currentTime = now.toTimeString().slice(0, 5);

            const ads = await Advertisement.find({
                isActive: true,
                startDate: { $lte: now },
                endDate: { $gte: now },
            });

            const io = socketInstance.getIO();

            for (const ad of ads) {
                const validDay =
                    !ad.days?.length || ad.days.includes(currentDay);

                const validTime =
                    !ad.startTime ||
                    (currentTime >= ad.startTime &&
                        currentTime <= ad.endTime);

                if (validDay && validTime) {
                    ad.deviceId.forEach((deviceId) => {
                        io.to(`device_${deviceId}`).emit("play_ads", {
                            deviceId,
                            ads: [ad],
                        });
                    });
                }
            }
        } catch (err) {
            console.error("Scheduler error:", err);
        }
    }, 60000); // every 1 minute
};

module.exports = startAdScheduler;
