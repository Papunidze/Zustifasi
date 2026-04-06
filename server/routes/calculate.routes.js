const { Router } = require("express");
const {
  calculateByLink,
  calculateManual,
} = require("../controllers/calculate.controller");

const router = Router();

router.post("/link", calculateByLink);
router.post("/manual", calculateManual);

module.exports = router;
