const mongoose = require('mongoose')

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    answers: [
      {
        question: {
          type: String,
          required: true
        },

        answer: {
          type: String,
          required: true
        }
      }
    ],

    personalityType: {
      type: String,
      default: null
    },

    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

module.exports =
  mongoose.models.Assessment ||
  mongoose.model('Assessment', assessmentSchema)