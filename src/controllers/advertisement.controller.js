const Advertisement = require("../models/Advertisement");
const socketInstance = require("../socketInstance");
/**
 * @desc    Create Advertisement (Video Upload)
 * @route   POST /api/advertisement/create
 */

exports.createAdvertisement = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    let { company_id, location_id, deviceId, title, description, startDate, endDate, playOrder } =
      req.body;

    // ✅ Convert deviceId from JSON string to array
    if (typeof deviceId === "string") {
      try {
        deviceId = JSON.parse(deviceId);
      } catch {
        deviceId = [deviceId]; // fallback
      }
    }

    const publicVideoPath = `/uploads/videos/${req.file.filename}`;

    const advertisement = await Advertisement.create({
      company_id,
      location_id,
      deviceId,      // 👈 now a real array
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * @desc    List Advertisements
 * @route   GET /api/advertisement/list
 */
exports.listAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find({ isActive: true })
      .populate("company_id", "name")
      .populate("location_id", "name")
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

/**
 * @desc    View Advertisement
 * @route   GET /api/advertisement/details/:id
 */
exports.viewAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate("company_id", "name")
      .populate("location_id", "name");

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

/**
 * @desc    Update Advertisement
 * @route   PUT /api/advertisement/edit/:id
 */
exports.updateAdvertisement = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // ✅ Convert deviceId to array if needed
    if (updateData.deviceId && typeof updateData.deviceId === "string") {
      try {
        updateData.deviceId = JSON.parse(updateData.deviceId);
      } catch {
        updateData.deviceId = [updateData.deviceId];
      }
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


/**
 * @desc    Soft Delete Advertisement (status change only)
 * @route   DELETE /api/advertisement/delete/:id
 */
exports.deleteAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
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

/**
 * @desc    Play Ads on Device
 * @route   POST /api/advertisement/play
 */

/**
 * @desc    Play Ads on Device
 * @route   POST /api/advertisement/play
 */
exports.playAdvertisements = async (req, res) => {
  try {
    const { companyId, deviceId } = req.body;

    if (!companyId || !deviceId) {
      return res.status(400).json({
        success: false,
        message: "companyId and deviceId (MAC) are required",
      });
    }

    // Find ads assigned to THIS DEVICE
    const ads = await Advertisement.find({
      isActive: true,
      company_id: companyId,
      deviceId: deviceId,   // 👈 MATCH MAC
    }).sort({ playOrder: 1 });

    if (!ads.length) {
      return res.status(404).json({
        success: false,
        message: "No ads found for this device",
      });
    }

    const io = socketInstance.getIO();

    // 🔥 SEND ONLY TO THIS DEVICE ROOM
    io.to(`device_${deviceId}`).emit("play_ads", {
      companyId,
      deviceId,
      ads,
    });

    res.status(200).json({
      success: true,
      message: "Ads sent to device",
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


exports.stopAdvertisements = async (req, res) => {
  const { companyId, deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).json({
      success: false,
      message: "deviceId (MAC) is required to stop ads",
    });
  }

  const io = socketInstance.getIO();

  io.to(`device_${deviceId}`).emit("stop_ads", {
    companyId,
    deviceId,
  });

  res.json({
    success: true,
    message: `Ads stopped for device ${deviceId}`,
  });
};

/**
 * @desc    Pause Ads on Device
 * @route   POST /api/advertisement/pause
 */
exports.pauseAdvertisements = async (req, res) => {
  try {
    const { companyId, deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "deviceId is required",
      });
    }

    const io = socketInstance.getIO();

    // 🔥 Send pause event to device
    io.to(`device_${deviceId}`).emit("pause_ads", {
      companyId,
      deviceId,
    });

    res.json({
      success: true,
      message: `Ads paused for device ${deviceId}`,
    });
  } catch (error) {
    console.error("Pause error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

