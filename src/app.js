const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ✅ FIXED STATIC PATH
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/company", require("./routes/company.routes"));
app.use("/api/location", require("./routes/location.routes"));
app.use("/api/advertisement", require("./routes/advertisement.routes"));
app.use("/api/devices", require("./routes/device.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

module.exports = app;
