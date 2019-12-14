const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Task = new Schema(
  {
    taskName: {
      type: String
    },
    isParentTask: {
      type: Boolean
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    priority: {
      type: Number
    },
    status: {
      type: String
    },
    parentTask: {
      type: Schema.Types.ObjectId,
      ref: "ParentTask"
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project"
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users"
    }
  },
  { toJSON: { virtuals: true } }
);

Task.virtual("parentTaskObj", {
  ref: "ParentTask",
  localField: "taskName",
  foreignField: "taskName",
  justOne: true
});
module.exports = mongoose.model("Task", Task);
