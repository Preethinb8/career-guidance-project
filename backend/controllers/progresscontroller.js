const Progress = require("../models/progress");

// ========================================
// DEFAULT PROGRESS DATA
// ========================================
const getDefaultProgress = (userId) => {
  return new Progress({
    userId,

    milestones: [
      {
        title: "Complete Career Assessment",
        completed: false,
      },
      {
        title: "Complete Skill Assessment",
        completed: false,
      },
      {
        title: "Choose Career Path",
        completed: false,
      },
      {
        title: "Complete Learning Path",
        completed: false,
      },
    ],

    courses: [
      {
        name: "HTML & CSS",
        completed: true,
      },
      {
        name: "JavaScript",
        completed: false,
      },
      {
        name: "React.js",
        completed: false,
      },
      {
        name: "Node.js",
        completed: false,
      },
    ],

    skills: [
      {
        name: "HTML",
        progress: 90,
      },
      {
        name: "CSS",
        progress: 80,
      },
      {
        name: "JavaScript",
        progress: 60,
      },
      {
        name: "React",
        progress: 40,
      },
      {
        name: "Node.js",
        progress: 30,
      },
    ],

    badges: [],
  });
};


// ========================================
// GET SAVED PROGRESS
// ========================================
const getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({
      userId: req.user.id,
    });

    // If no progress exists, create default progress
    if (!progress) {
      progress = getDefaultProgress(req.user.id);
      await progress.save();
    } else {
      // Fix existing progress document
      // Remove duplicate milestones
      const milestoneTitles = [
        "Complete Career Assessment",
        "Complete Skill Assessment",
        "Choose Career Path",
        "Complete Learning Path",
      ];

      progress.milestones = milestoneTitles.map((title) => {
        const existing = progress.milestones.find(
          (item) =>
            item.title.toLowerCase() === title.toLowerCase()
        );

        return {
          title,
          completed: existing ? existing.completed : false,
        };
      });

      // Add missing courses
      const defaultCourses = [
        {
          name: "HTML & CSS",
          completed: true,
        },
        {
          name: "JavaScript",
          completed: false,
        },
        {
          name: "React.js",
          completed: false,
        },
        {
          name: "Node.js",
          completed: false,
        },
      ];

      defaultCourses.forEach((defaultCourse) => {
        const existingCourse = progress.courses.find(
          (item) =>
            item.name.toLowerCase() ===
            defaultCourse.name.toLowerCase()
        );

        if (!existingCourse) {
          progress.courses.push(defaultCourse);
        }
      });

      // Add missing skills
      const defaultSkills = [
        {
          name: "HTML",
          progress: 90,
        },
        {
          name: "CSS",
          progress: 80,
        },
        {
          name: "JavaScript",
          progress: 60,
        },
        {
          name: "React",
          progress: 40,
        },
        {
          name: "Node.js",
          progress: 30,
        },
      ];

      defaultSkills.forEach((defaultSkill) => {
        const existingSkill = progress.skills.find(
          (item) =>
            item.name.toLowerCase() ===
            defaultSkill.name.toLowerCase()
        );

        if (!existingSkill) {
          progress.skills.push(defaultSkill);
        }
      });

      await progress.save();
    }

    res.status(200).json({
      message: "Progress loaded successfully",
      progress,
    });
  } catch (error) {
    console.error("Get Progress Error:", error);

    res.status(500).json({
      message: "Failed to load progress",
      error: error.message,
    });
  }
};


// ========================================
// CREATE / COMPLETE LEARNING MILESTONE
// ========================================
const createLearningMilestone = async (req, res) => {
  try {
    const { milestone } = req.body;

    if (!milestone) {
      return res.status(400).json({
        message: "Milestone is required",
      });
    }

    let progress = await Progress.findOne({
      userId: req.user.id,
    });

    if (!progress) {
      progress = getDefaultProgress(req.user.id);
    }

    const existingMilestone = progress.milestones.find(
      (item) =>
        item.title.toLowerCase() ===
        milestone.toLowerCase()
    );

    if (existingMilestone) {
      existingMilestone.completed = true;
    } else {
      progress.milestones.push({
        title: milestone,
        completed: true,
      });
    }

    await progress.save();

    res.status(200).json({
      message: "Learning milestone completed successfully",
      progress,
    });
  } catch (error) {
    console.error("Progress Error:", error);

    res.status(500).json({
      message: "Failed to complete learning milestone",
      error: error.message,
    });
  }
};


// ========================================
// TRACK COMPLETED COURSE
// ========================================
const trackCompletedCourse = async (req, res) => {
  try {
    const { course } = req.body;

    if (!course) {
      return res.status(400).json({
        message: "Course is required",
      });
    }

    let progress = await Progress.findOne({
      userId: req.user.id,
    });

    if (!progress) {
      progress = getDefaultProgress(req.user.id);
    }

    const existingCourse = progress.courses.find(
      (item) =>
        item.name.toLowerCase() ===
        course.toLowerCase()
    );

    if (existingCourse) {
      existingCourse.completed = true;
    } else {
      progress.courses.push({
        name: course,
        completed: true,
      });
    }

    await progress.save();

    res.status(200).json({
      message: "Course marked as completed",
      progress,
    });
  } catch (error) {
    console.error("Course Progress Error:", error);

    res.status(500).json({
      message: "Failed to track completed course",
      error: error.message,
    });
  }
};


// ========================================
// UPDATE SKILL PROGRESS
// ========================================
const updateSkillProgress = async (req, res) => {
  try {
    const {
      skill,
      progress: skillValue,
    } = req.body;

    if (!skill || skillValue === undefined) {
      return res.status(400).json({
        message: "Skill and progress are required",
      });
    }

    if (skillValue < 0 || skillValue > 100) {
      return res.status(400).json({
        message: "Progress must be between 0 and 100",
      });
    }

    let progress = await Progress.findOne({
      userId: req.user.id,
    });

    if (!progress) {
      progress = getDefaultProgress(req.user.id);
    }

    const existingSkill = progress.skills.find(
      (item) =>
        item.name.toLowerCase() ===
        skill.toLowerCase()
    );

    if (existingSkill) {
      existingSkill.progress = skillValue;
    } else {
      progress.skills.push({
        name: skill,
        progress: skillValue,
      });
    }

    await progress.save();

    res.status(200).json({
      message: "Skill progress updated successfully",
      progress,
    });
  } catch (error) {
    console.error("Skill Progress Error:", error);

    res.status(500).json({
      message: "Failed to update skill progress",
      error: error.message,
    });
  }
};


// ========================================
// AWARD ACHIEVEMENT BADGE
// ========================================
const awardAchievementBadge = async (req, res) => {
  try {
    const { badge } = req.body;

    if (!badge) {
      return res.status(400).json({
        message: "Badge is required",
      });
    }

    let progress = await Progress.findOne({
      userId: req.user.id,
    });

    if (!progress) {
      progress = getDefaultProgress(req.user.id);
    }

    const existingBadge = progress.badges.find(
      (item) =>
        item.name.toLowerCase() ===
        badge.toLowerCase()
    );

    if (!existingBadge) {
      progress.badges.push({
        name: badge,
      });
    }

    await progress.save();

    res.status(200).json({
      message: "Achievement badge awarded successfully",
      progress,
    });
  } catch (error) {
    console.error("Achievement Badge Error:", error);

    res.status(500).json({
      message: "Failed to award achievement badge",
      error: error.message,
    });
  }
};


// ========================================
// EXPORT FUNCTIONS
// ========================================
module.exports = {
  getProgress,
  createLearningMilestone,
  trackCompletedCourse,
  updateSkillProgress,
  awardAchievementBadge,
};