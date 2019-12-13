const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ParentTask = new Schema({
  taskName: {
    type: String
  }
});
module.exports = mongoose.model("ParentTask", ParentTask);
