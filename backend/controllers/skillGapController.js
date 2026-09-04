const analyzeSkillGap = async (req, res) => {
  try {
    const {
      career,
      currentSkills,
      requiredSkills,
    } = req.body;

    // Check career
    if (!career || !career.trim()) {
      return res.status(400).json({
        message: "Career is required",
      });
    }

    // Check skills
    if (
      !currentSkills ||
      !requiredSkills ||
      !Array.isArray(currentSkills) ||
      !Array.isArray(requiredSkills)
    ) {
      return res.status(400).json({
        message:
          "Current skills and required skills are required",
      });
    }

    // Convert current skills to lowercase
    const current = currentSkills
      .map((skill) => String(skill).trim().toLowerCase())
      .filter((skill) => skill);

    // Clean required skills
    const required = requiredSkills
      .map((skill) => String(skill).trim())
      .filter((skill) => skill);

    // Find missing skills
    const missingSkills = required.filter(
      (skill) =>
        !current.includes(skill.toLowerCase())
    );

    // Send result
    res.status(200).json({
      career: career.trim(),
      currentSkills: currentSkills,
      requiredSkills: requiredSkills,
      missingSkills: missingSkills,
    });
  } catch (error) {
    console.error("Skill Gap Error:", error);

    res.status(500).json({
      message: "Skill gap analysis failed",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeSkillGap,
};