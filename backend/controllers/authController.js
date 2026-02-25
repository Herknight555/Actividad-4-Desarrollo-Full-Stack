const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "jwt_clave_local";

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Usuario y contraseña son obligatorios" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      role: "free"
    });

    await user.save();

    return res.status(201).json({ message: "Usuario registrado" });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Usuario y contraseña son obligatorios" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    let validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword && user.password === password) {
      validPassword = true;
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login
};
