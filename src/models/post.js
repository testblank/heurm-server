const mongoose = require("mongoose");
const { Schema } = mongoose;

const Meta = new Schema({
  likes: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  }
});

const Post = new Schema({
  title: String,
  username: String,
  text: String,
  photo: {
    type: String,
    default: "https://dummyimage.com/600x400/000/fff"
  },
  tags: String,
  date: {
    created: { type: Date, default: Date.now },
    edited: { type: Date, default: Date.now }
  },
  is_edited: { type: Boolean, default: false },
  meta: Meta
});

Post.statics.findByTitleOrUsername = function(value) {
  return this.find({ title: title }).exec();
};

Post.statics.findByUsername = function(username) {
  return this.find({ username: username }).exec();
};

module.exports = mongoose.model("Post", Post);
