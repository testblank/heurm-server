const mongoose = require("mongoose");
const { Schema } = mongoose;

const Post = new Schema({
  title: String,
  username: String,
  text: String,
  photo: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", Post);
