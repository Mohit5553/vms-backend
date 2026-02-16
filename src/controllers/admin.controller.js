const User = require("../models/User");
const Company = require("../models/Company");
const Location = require("../models/Location");
const Advertisement = require("../models/Advertisement");
const activeScreens = require("../activeScreens"); // ✅ moved to top

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.role = req.body.role;
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Admin Dashboard Stats
 * @route   GET /api/admin/dashboard
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const [companyCount, locationCount, adCount, activeAdCount] =
      await Promise.all([
        Company.countDocuments({ isActive: true }),
        Location.countDocuments({ isActive: true }),
        Advertisement.countDocuments({}),
        Advertisement.countDocuments({ isActive: true }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        companies: companyCount,
        locations: locationCount,
        advertisements: adCount,
        activeAdvertisements: activeAdCount,
        activeScreens: activeScreens.list().length, // 🔥 IMPORTANT FIX
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get all live screens
 * @route   GET /api/admin/live-screens
 */
exports.getLiveScreens = async (req, res) => {
  try {
    const screens = activeScreens.list();

    // 🔥 Format data properly
    const formattedScreens = screens.map((s) => ({
      deviceId: s.deviceId,
      locationId: s.locationId,
      locationName: s.locationName || "Unknown Location",
      companyName: s.companyName || "Unknown Company", // 🔥 IMPORTANT
      currentVideo: s.currentVideo,
      socketId: s.socketId,
      connectedAt: s.connectedAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedScreens,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

