const express = require("express");

const {
  getAllUsers,
  getAllAssessments,
  getAllCareerPaths,
  getAnalyticsReports
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/assessments", getAllAssessments);
router.get("/career-paths", getAllCareerPaths);
router.get("/analytics", getAnalyticsReports);

module.exports = router;