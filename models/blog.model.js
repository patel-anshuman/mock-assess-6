const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  username: String,
  title: String,
  content: String,
  category: String,
  date: String,
  likes: Number,
  comments: [Object]
},{
  versionKey: false
});

const BlogModel = mongoose.model("blog",blogSchema);

module.exports = { BlogModel };
