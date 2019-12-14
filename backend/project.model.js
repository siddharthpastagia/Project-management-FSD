const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Project = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      max: 100
    },
    dateRequired: {
      type: Boolean
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    priority: {
      type: Number,
      required: true
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true
    }
  },
  { toJSON: { virtuals: true } }
);

Project.virtual("task", {
  ref: "Task",
  localField: "_id",
  foreignField: "project",
  justOne: false
});

module.exports = mongoose.model("Project", Project);
