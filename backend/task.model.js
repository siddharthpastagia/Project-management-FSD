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
  user: {
    type: String
  },
  project: {
    type: String
  }
});
module.exports = mongoose.model("Task", Task);
