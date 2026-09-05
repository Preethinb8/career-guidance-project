const express = require("express");

const {
  getCareerRecommendation,
  getLearningPath,
  getSkillGapAnalysis,
} = require("../controllers/aiController");

const router = express.Router();

// AI Career Guidance
router.post("/career-guidance", getCareerRecommendation);

// Personalized Learning Path
router.post("/learning-path", getLearningPath);

// Skill Gap Analysis
router.post("/skill-gap", getSkillGapAnalysis);

module.exports = router;