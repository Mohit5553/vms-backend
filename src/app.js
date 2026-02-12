// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// // ✅ FIXED STATIC PATH
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/company", require("./routes/company.routes"));
// app.use("/api/location", require("./routes/location.routes"));
// app.use("/api/advertisement", require("./routes/advertisement.routes"));
// app.use("/api/devices", require("./routes/device.routes"));
// app.use("/api/admin", require("./routes/admin.routes"));

// module.exports = app;
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================= CORS SETUP ================= */

const allowedOrigins = [
    "http://localhost:5173",
    "https://jts-vm.netlify.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

/* ================= MIDDLEWARE ================= */

app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);

/* ================= ROUTES ================= */

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/company", require("./routes/company.routes"));
app.use("/api/location", require("./routes/location.routes"));
app.use("/api/advertisement", require("./routes/advertisement.routes"));
app.use("/api/devices", require("./routes/device.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

module.exports = app;
