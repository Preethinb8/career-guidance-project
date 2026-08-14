const mongoose = require('mongoose')

const skillAssessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },

    technicalScore: {
      type: Number,
      required: true
    },

    aptitudeScore: {
      type: Number,
      required: true
    },

    communicationScore: {
      type: Number,
      required: true
    },

    totalScore: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'SkillAssessment',
  skillAssessmentSchema
)