const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    phone: {
      type: String,
      default: ''
    },

    education: {
      type: String,
      default: ''
    },

    careerInterests: {
      type: [String],
      default: []
    },

    technicalSkills: {
      type: [String],
      default: []
    },

    softSkills: {
      type: [String],
      default: []
    },

    preferredIndustries: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Profile', profileSchema)