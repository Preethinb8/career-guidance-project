const User = require("../models/User");
const Assessment = require("../models/Assessment");
const Progress = require("../models/progress");

// ========================================
// 1. USER GROWTH STATISTICS
// ========================================
const getUserGrowthStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      message: "User growth statistics fetched successfully",
      statistics: {
        totalUsers: totalUsers,
      },
    });
  } catch (error) {
    console.error("User Growth Statistics Error:", error);

    res.status(500).json({
      message: "Failed to fetch user growth statistics",
      error: error.message,
    });
  }
};

// ========================================
// 2. MOST RECOMMENDED CAREERS
// ========================================
const getMostRecommendedCareers = async (req, res) => {
  try {
    const careers = await Assessment.aggregate([
      {
        $match: {
          personalityType: {
            $exists: true,
            $ne: "",
          },
        },
      },
      {
        $group: {
          _id: "$personalityType",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    const mostRecommendedCareers = careers.map((career) => ({
      career: career._id,
      count: career.count,
    }));

    res.status(200).json({
      message: "Most recommended careers fetched successfully",
      careers: mostRecommendedCareers,
    });
  } catch (error) {
    console.error("Recommended Careers Error:", error);

    res.status(500).json({
      message: "Failed to fetch most recommended careers",
      error: error.message,
    });
  }
};

// ========================================
// 3. ASSESSMENT COMPLETION RATES
// ========================================
const getAssessmentCompletionRates = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const completedUsers = await Assessment.distinct("userId");

    const completedAssessments = completedUsers.length;

    const assessmentCompletionRate =
      totalUsers > 0
        ? Math.round(
            (completedAssessments / totalUsers) * 100
          )
        : 0;

    res.status(200).json({
      message: "Assessment completion rates fetched successfully",
      assessmentCompletionRate: assessmentCompletionRate,
    });
  } catch (error) {
    console.error("Assessment Completion Error:", error);

    res.status(500).json({
      message: "Failed to fetch assessment completion rates",
      error: error.message,
    });
  }
};

// ========================================
// 4. STUDENT PROGRESS REPORTS
// ========================================
const getStudentProgressReports = async (req, res) => {
  try {
    const studentProgressReports = await Progress.find()
      .populate("userId", "name email")
      .select("userId milestones courses skills badges");

    res.status(200).json({
      message: "Student progress reports fetched successfully",
      studentProgressReports: studentProgressReports,
    });
  } catch (error) {
    console.error("Student Progress Reports Error:", error);

    res.status(500).json({
      message: "Failed to fetch student progress reports",
      error: error.message,
    });
  }
};

// ========================================
// EXPORT FUNCTIONS
// ========================================
module.exports = {
  getUserGrowthStatistics,
  getMostRecommendedCareers,
  getAssessmentCompletionRates,
  getStudentProgressReports,
};