const generateRoadmap = (req, res) => {
  const { learningPath } = req.body;

  if (!learningPath || !Array.isArray(learningPath)) {
    return res.status(400).json({
      message: "learningPath must be an array"
    });
  }

  const roadmap = learningPath.map((item, index) => ({
    milestone: index + 1,
    skill: item.skill,
    stages: item.levels,
    projects: [`Practice ${item.skill} project`],
    certifications: [`Complete ${item.skill} certification`]
  }));

  res.status(200).json({
    roadmap
  });
};

module.exports = {
  generateRoadmap
};