require("dotenv").config();

const express = require("express");
const cors = require("cors");
const calculateRoutes = require("./routes/calculate.routes");
const vinRoutes = require("./routes/vin.routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`ZustiFasi.ge API running → http://localhost:${PORT}`);
});

module.exports = app;
