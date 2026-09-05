const User = require("../models/User");
const Assessment = require("../models/Assessment");
const Progress = require("../models/progress");

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      message: "Users fetched successfully",
      users
    });
  } catch (error) {
    console.error("Admin Users Error:", error);

    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
};

// GET ALL ASSESSMENTS
const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({});

    res.status(200).json({
      message: "Assessments fetched successfully",
      assessments
    });
  } catch (error) {
    console.error("Admin Assessments Error:", error);

    res.status(500).json({
      message: "Failed to fetch assessments",
      error: error.message
    });
  }
};

// GET ALL CAREER PATHS
const getAllCareerPaths = async (req, res) => {
  try {
    const careerPaths = [
      "Software Developer",
      "Data Analyst",
      "UI/UX Designer",
      "Digital Marketer",
      "Business Analyst",
      "Cybersecurity Analyst",
      "AI/ML Engineer"
    ];

    res.status(200).json({
      message: "Career paths fetched successfully",
      careerPaths
    });
  } catch (error) {
    console.error("Admin Career Paths Error:", error);

    res.status(500).json({
      message: "Failed to fetch career paths"
    });
  }
};

// GET ANALYTICS AND REPORTS
const getAnalyticsReports = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Total assessments
    const totalAssessments =
      await Assessment.countDocuments();

    // Users who completed an assessment
    const completedUsers =
      await Assessment.distinct("userId");

    const assessmentCompletionRate =
      totalUsers > 0
        ? Math.round(
            (completedUsers.length / totalUsers) * 100
          )
        : 0;

    // Most recommended careers
    const mostRecommendedCareers =
      await Assessment.aggregate([
        {
          $match: {
            personalityType: {
              $exists: true,
              $ne: ""
            }
          }
        },
        {
          $group: {
            _id: "$personalityType",
            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            count: -1
          }
        }
      ]);

    // Student progress reports
    const progressRecords =
      await Progress.find({});

    const progressUserIds =
      progressRecords.map(
        (progress) => progress.userId
      );

    const users = await User.find({
      _id: {
        $in: progressUserIds
      }
    }).select("name email");

    const userMap = new Map(
      users.map((user) => [
        String(user._id),
        user
      ])
    );

    const studentProgressReports =
      progressRecords.map((progress) => {
        const user = userMap.get(
          String(progress.userId)
        );

        const milestones =
          progress.milestones || [];

        const courses =
          progress.courses || [];

        const skills =
          progress.skills || [];

        const completedMilestones =
          milestones.filter(
            (milestone) =>
              milestone.completed
          ).length;

        const completedCourses =
          courses.filter(
            (course) =>
              course.completed
          ).length;

        const totalMilestones =
          milestones.length;

        const totalCourses =
          courses.length;

        const totalSkills =
          skills.length;

        const milestoneProgress =
          totalMilestones > 0
            ? (completedMilestones /
                totalMilestones) *
              100
            : 0;

        const courseProgress =
          totalCourses > 0
            ? (completedCourses /
                totalCourses) *
              100
            : 0;

        const skillProgress =
          totalSkills > 0
            ? skills.reduce(
                (total, skill) =>
                  total +
                  (Number(
                    skill.progress
                  ) || 0),
                0
              ) / totalSkills
            : 0;

        // Overall progress
        const overallProgress =
          Math.round(
            (milestoneProgress +
              courseProgress +
              skillProgress) /
              3
          );

        return {
          name: user
            ? user.name
            : "Unknown",

          email: user
            ? user.email
            : "",

          progress:
            overallProgress,

          milestones:
            `${completedMilestones}/${totalMilestones}`,

          courses:
            `${completedCourses}/${totalCourses}`,

          skillsTracked:
            totalSkills,

          badges:
            (progress.badges || []).length
        };
      });

    res.status(200).json({
      message:
        "Analytics and reports fetched successfully",

      analytics: {
        totalUsers,
        totalAssessments,
        mostRecommendedCareers,
        assessmentCompletionRate,
        studentProgressReports
      }
    });
  } catch (error) {
    console.error(
      "Admin Analytics Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch analytics and reports",

      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getAllAssessments,
  getAllCareerPaths,
  getAnalyticsReports
};