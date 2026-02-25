const User = require("../models/User");

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("username role");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

const upgradeToPremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "El usuario admin no puede cambiar de plan" });
    }

    user.role = "premium";
    await user.save();

    return res.json({ message: "Ahora eres usuario premium", role: user.role });
  } catch (error) {
    return next(error);
  }
};

const listUsersForAdmin = async (req, res, next) => {
  try {
    const users = await User.find({}, "username role").sort({ username: 1 });
    return res.json(users);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMyProfile,
  upgradeToPremium,
  listUsersForAdmin
};
