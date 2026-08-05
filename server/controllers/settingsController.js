import Settings from "../models/Settings.js";

// ================= GET SETTINGS =================
// Public: the storefront may also need this (contact info, socials).

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE SETTINGS (ADMIN) =================

export const updateSettings = async (req, res) => {
  try {
    const {
      companyName,
      email,
      phone,
      address,
      website,
      instagram,
      facebook,
      youtube,
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({});
    }

    if (companyName !== undefined) settings.companyName = companyName;
    if (email !== undefined) settings.email = email;
    if (phone !== undefined) settings.phone = phone;
    if (address !== undefined) settings.address = address;
    if (website !== undefined) settings.website = website;
    if (instagram !== undefined) settings.instagram = instagram;
    if (facebook !== undefined) settings.facebook = facebook;
    if (youtube !== undefined) settings.youtube = youtube;

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
