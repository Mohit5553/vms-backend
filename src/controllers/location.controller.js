const Location = require("../models/Location");
const Company = require("../models/Company");

/**
 * @desc    Create Location
 * @route   POST /api/location/create
 */
exports.createLocation = async (req, res) => {
  try {
    const { company_id } = req.body;

    // 🔐 Ensure company exists
    const companyExists = await Company.findById(company_id);
    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const location = await Location.create(req.body);

    res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: location,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    List Locations by Company
 * @route   GET /api/location/list/:companyId
 */
exports.listLocationsByCompany = async (req, res) => {
  try {
    const locations = await Location.find({
      company_id: req.params.companyId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    View Location
 * @route   GET /api/location/details/:id
 */
exports.viewLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).populate(
      "company_id",
      "name",
    );

    if (!location || !location.isActive) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update Location
 * @route   PUT /api/location/edit/:id
 */
exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: location,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Soft Delete Location
 * @route   DELETE /api/location/delete/:id
 */
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
