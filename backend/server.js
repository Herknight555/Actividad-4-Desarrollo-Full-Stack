const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");
const userRoutes = require("./routes/users");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/playlistDB";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const ensureAdminUser = async () => {
  const adminUsername = process.env.ADMIN_USER || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await User.findOne({ username: adminUsername });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      username: adminUsername,
      password: hashedPassword,
      role: "admin"
    });
    console.log(`Usuario admin creado: ${adminUsername}`);
  }
};

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB conectado");
    await ensureAdminUser();
  })
  .catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use("/songs", songRoutes);
app.use("/users", userRoutes);

// Middleware de errores
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

module.exports = app;
