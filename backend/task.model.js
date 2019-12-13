const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Task = new Schema({
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
  }
});
module.exports = mongoose.model("Task", Task);
