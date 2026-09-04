const express = require("express");
const { analyzeSkillGap } = require("../controllers/skillGapController");

const router = express.Router();

router.post("/analyze", analyzeSkillGap);

module.exports = router;