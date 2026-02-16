const Advertisement = require("../models/Advertisement");
const socketInstance = require("../socketInstance");
const activeScreens = require("../activeScreens");


/* =======================================================
   ✅ CREATE ADVERTISEMENT (MULTI COMPANY + LOCATION)
======================================================= */

exports.createAdvertisement = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    let {
      company_ids,
      location_ids,
      deviceIds,
      title,
      description,
      startDate,
      endDate,
      playOrder,
    } = req.body;

    // 🔥 Convert JSON string → Array
    if (typeof company_ids === "string") {
      company_ids = JSON.parse(company_ids);
    }

    if (typeof location_ids === "string") {
      location_ids = JSON.parse(location_ids);
    }

    if (typeof deviceIds === "string") {
      deviceIds = JSON.parse(deviceIds);
    }

    // 🔥 Validation
    if (!company_ids?.length || !location_ids?.length) {
      return res.status(400).json({
        success: false,
        message: "Company and Location are required",
      });
    }

    const publicVideoPath = `/uploads/videos/${req.file.filename}`;

    const advertisement = await Advertisement.create({
      company_ids,
      location_ids,
      deviceId: deviceIds,
      title,
      description,
      startDate,
      endDate,
      playOrder,
      videoPath: publicVideoPath,
    });

    res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      data: advertisement,
    });
  } catch (error) {
    console.error("Create Ad Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =======================================================
   ✅ LIST ADVERTISEMENTS
======================================================= */
exports.listAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find({ isActive: true })
      .populate("company_ids", "name")
      .populate("location_ids", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =======================================================
   ✅ VIEW SINGLE ADVERTISEMENT
======================================================= */
exports.viewAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate("company_ids", "name")
      .populate("location_ids", "name");

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: advertisement,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* =======================================================
   ✅ UPDATE ADVERTISEMENT
======================================================= */
exports.updateAdvertisement = async (req, res) => {
  try {
    let updateData = { ...req.body };

    /* 🔥 Convert JSON → arrays */
    if (updateData.company_ids && typeof updateData.company_ids === "string") {
      updateData.company_ids = JSON.parse(updateData.company_ids);
    }

    if (updateData.location_ids && typeof updateData.location_ids === "string") {
      updateData.location_ids = JSON.parse(updateData.location_ids);
    }

    if (updateData.deviceId && typeof updateData.deviceId === "string") {
      updateData.deviceId = JSON.parse(updateData.deviceId);
    }

    const advertisement = await Advertisement.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      updateData,
      { new: true, runValidators: true }
    );

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found or inactive",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advertisement updated successfully",
      data: advertisement,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* =======================================================
   ✅ SOFT DELETE ADVERTISEMENT
======================================================= */
exports.deleteAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advertisement deactivated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* =======================================================
   ✅ PLAY ADS ON DEVICE
======================================================= */
exports.playAdvertisements = async (req, res) => {
  try {
    const { companyId, deviceId } = req.body;

    if (!companyId || !deviceId) {
      return res.status(400).json({
        success: false,
        message: "companyId and deviceId required",
      });
    }

    /* 🔥 MULTI COMPANY SUPPORT */
    const ads = await Advertisement.find({
      isActive: true,
      company_ids: companyId,
      deviceId: deviceId,
    }).sort({ playOrder: 1 });

    if (!ads.length) {
      return res.status(404).json({
        success: false,
        message: "No ads found",
      });
    }

    const io = socketInstance.getIO();

    io.to(`device_${deviceId}`).emit("play_ads", {
      companyId,
      deviceId,
      ads,
    });

    if (ads.length) {
      activeScreens.updateVideo(deviceId, ads[0].videoPath);
    }

    res.status(200).json({
      success: true,
      message: "Ads sent",
      count: ads.length,
    });
  } catch (error) {
    console.error("Play error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =======================================================
   ✅ STOP ADS
======================================================= */
exports.stopAdvertisements = async (req, res) => {
  const { companyId, deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).json({
      success: false,
      message: "deviceId required",
    });
  }

  const io = socketInstance.getIO();

  io.to(`device_${deviceId}`).emit("stop_ads", {
    companyId,
    deviceId,
  });

  activeScreens.updateVideo(deviceId, null);

  res.json({
    success: true,
    message: `Stopped for device ${deviceId}`,
  });
};


/* =======================================================
   ✅ PAUSE ADS
======================================================= */
exports.pauseAdvertisements = async (req, res) => {
  try {
    const { companyId, deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "deviceId required",
      });
    }

    const io = socketInstance.getIO();

    io.to(`device_${deviceId}`).emit("pause_ads", {
      companyId,
      deviceId,
    });

    activeScreens.updateVideo(deviceId, "PAUSED");

    res.json({
      success: true,
      message: `Paused for device ${deviceId}`,
    });
  } catch (error) {
    console.error("Pause error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
