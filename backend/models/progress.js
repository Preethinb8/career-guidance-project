const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    milestones: [
      {
        title: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    courses: [
      {
        name: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    skills: [
      {
        name: {
          type: String,
          required: true,
        },
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
      },
    ],

    badges: [
      {
        name: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Progress", progressSchema);