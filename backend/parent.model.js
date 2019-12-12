const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Parent = new Schema({
  parent_task: {
    type: String
  }
});
module.exports = mongoose.model("Parent", Parent);
