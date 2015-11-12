var assert = require('assert');
var sinon = require('sinon');
var mongoose = require('mongoose');
require('sinon-as-promised');

require('../lib');

describe('sinon-mongoose', function () {
  var bookSchema = new mongoose.Schema({
    title: String
  });

  var Book = mongoose.model('Book', bookSchema);

  describe('should made Mongoose model methods chainables', function () {

    it('#find', function () {
      var BookMock = sinon.mockModel(Book);

      BookMock
        .expects('find').withArgs('SOME_ARGUMENTS')
        .chain('exec')
        .resolves('RESULT');

      Book.find('SOME_ARGUMENTS')
        .exec()
        .then(function (result) {
          assert.equal(result, 'RESULT');
        });
    });
  });

  describe('should made Mongoose document methods chainables', function () {

    it('#update', function () {
      var bookMock = sinon.mockDocument(Book, { title: 'Rayuela' });

      bookMock
        .expects('update').withArgs('SOME_ARGUMENTS')
        .chain('exec')
        .resolves('RESULT');

      bookMock.object.update('SOME_ARGUMENTS')
        .exec()
        .then(function (result) {
          assert.equal(result, 'RESULT');
        });
    });
  });
});
