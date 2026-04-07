const { Router } = require("express");
const { decodeVin, isVin } = require("../services/vinDecoder.service");

const router = Router();

router.get("/:vin", async (req, res) => {
  const vin = (req.params.vin || "").trim().toUpperCase();

  if (!isVin(vin)) {
    return res.status(400).json({
      success: false,
      error: "Invalid VIN. Must be 17 alphanumeric characters (no I/O/Q).",
    });
  }

  const decoded = await decodeVin(vin);
  if (!decoded) {
    return res.status(404).json({
      success: false,
      error: "VIN could not be decoded.",
    });
  }

  return res.json({ success: true, data: decoded });
});

module.exports = router;
