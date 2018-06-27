'use strict';
var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  date: Date,
  tags: [String]
});

bookSchema.static('findByAuthor', function (author, callback) {
  return this.find({ author: author })
    .limit(10)
    .sort('-date')
    .exec(callback);
});

bookSchema.method('addTag', function (tag, callback) {
  return this.update({ $addToSet: { tags: tag } }).exec(callback);
});

mongoose.model('Book', bookSchema);
