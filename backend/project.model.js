const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Project = new Schema(
  {
    projectName: {
      type: String
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
      type: Number
    },
    manager: {
      type: String
    }
  },
  { toJSON: { virtuals: true } }
);

// Project.virtual("numOfTask", {
//   ref: "Task", // The model to use
//   localField: "projectName", // Find people where `localField`
//   foreignField: "parentTask", // is equal to `foreignField`
//   // If `justOne` is true, 'members' will be a single doc as opposed to
//   // an array. `justOne` is false by default.
//   justOne: true,
//   count: true
// });
module.exports = mongoose.model("Project", Project);
