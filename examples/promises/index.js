'use strict';
var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  date: Date,
  tags: [String]
});

bookSchema.static('findByAuthor', function (author) {
  return this.find({ author: author })
    .limit(10)
    .sort('-date')
    .exec();
});

bookSchema.method('addTag', function (tag) {
  return this.update({ $addToSet: { tags: tag } }).exec();
});

mongoose.model('Book', bookSchema);
