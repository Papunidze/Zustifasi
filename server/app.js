require("dotenv").config();

const express = require("express");
const cors = require("cors");
const calculateRoutes = require("./routes/calculate.routes");
const vinRoutes = require("./routes/vin.routes");

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.set("trust proxy", 1);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/calculate", calculateRoutes);
app.use("/api/v1/vin", vinRoutes);

app.use((err, req, res, next) => {
  void req;
  void next;
  console.error("[Server] Unhandled error:", err.message);
  res.status(500).json({ success: false, error: "Internal server error." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ZustiFasi.ge API running on port ${PORT}`);
});

module.exports = app;
