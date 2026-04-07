const { Router } = require("express");
const {
  calculateByLink,
  calculateManual,
  calculateCustomsOnly,
} = require("../controllers/calculate.controller");

const router = Router();

router.post("/link", calculateByLink);
router.post("/manual", calculateManual);
router.post("/customs", calculateCustomsOnly);

module.exports = router;
