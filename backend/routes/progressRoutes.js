const express = require("express");

const {
  createLearningMilestone,
  trackCompletedCourse,
  updateSkillProgress,
  awardAchievementBadge,
  getProgress,
} = require("../controllers/progressController");

const router = express.Router();

// ========================================
// GET SAVED PROGRESS FROM MONGODB
// ========================================
router.get("/", getProgress);

// ========================================
// CREATE LEARNING MILESTONE
// ========================================
router.post("/milestone", createLearningMilestone);

// ========================================
// TRACK COMPLETED COURSE
// ========================================
router.post("/course", trackCompletedCourse);

// ========================================
// UPDATE SKILL PROGRESS
// ========================================
router.post("/skill", updateSkillProgress);

// ========================================
// AWARD ACHIEVEMENT BADGE
// ========================================
router.post("/badge", awardAchievementBadge);

// ========================================
// EXPORT ROUTER
// ========================================
module.exports = router;