var assert = require('assert');
var sinon = require('sinon');
var mongoose = require('mongoose');

require('../lib');

describe('sinon-mongoose', function() {
  var bookSchema = new mongoose.Schema({
    title: String,
  });

  var Book = mongoose.model('Book', bookSchema);

  describe('should made Mongoose model methods chainables', function() {
    it('#find', function(done) {
      var BookMock = sinon.mock(Book);

      BookMock.expects('find').withArgs('SOME_ARGUMENTS').chain('exec').resolves('RESULT');

      Book.find('SOME_ARGUMENTS').exec().then(function(result) {
        BookMock.verify();
        BookMock.restore();
        assert.equal(result, 'RESULT');
        done();
      });
    });

    it('#lean', function(done) {
      var BookMock = sinon.mock(Book);

      BookMock.expects('find').withArgs('SOME_ARGUMENTS').chain('lean').chain('exec').resolves('RESULT');

      Book.find('SOME_ARGUMENTS').lean().exec().then(function(result) {
        BookMock.verify();
        BookMock.restore();
        assert.equal(result, 'RESULT');
        done();
      });
    });

    it('#count', function(done) {
      var BookMock = sinon.mock(Book);

      BookMock.expects('find').withArgs('SOME_ARGUMENTS').chain('count').chain('exec').resolves('RESULT');

      Book.find('SOME_ARGUMENTS').count().exec().then(function(result) {
        BookMock.verify();
        BookMock.restore();
        assert.equal(result, 'RESULT');
        done();
      });
    });

    it('#aggregate', function(done) {
      var BookMock = sinon.mock(Book);

      BookMock.expects('aggregate').chain('lookup').resolves('RESULT');

      Book.aggregate().lookup().then(function(result) {
        BookMock.verify();
        BookMock.restore();
        assert.equal(result, 'RESULT');
        done();
      });
    });
  });

  describe('should made Mongoose document methods chainables', function() {
    it('#update', function(done) {
      var bookMock = sinon.mock(new Book({ title: 'Rayuela' }));

      bookMock.expects('update').withArgs('SOME_ARGUMENTS').chain('exec').resolves('RESULT');

      bookMock.object.update('SOME_ARGUMENTS').exec().then(function(result) {
        bookMock.verify();
        bookMock.restore();
        assert.equal(result, 'RESULT');
        done();
      });
    });
  });

  describe('using sinon sandbox', function() {
    var sandbox = sinon.sandbox.create();

    afterEach(function() {
      sandbox.verify();
      sandbox.restore();
    });

    it('should work mocking Model', function() {
      var BookMock = sandbox.mock(Book);

      BookMock.expects('find').withArgs('SOME_ARGUMENTS').chain('exec').resolves('RESULT');

      Book.find('SOME_ARGUMENTS').exec().then(function(result) {
        assert.equal(result, 'RESULT');
      });
    });

    it('should work mocking Document', function() {
      var bookMock = sandbox.mock(new Book({ title: 'Rayuela' }));

      bookMock.expects('update').withArgs('SOME_ARGUMENTS').chain('exec').resolves('RESULT');

      bookMock.object.update('SOME_ARGUMENTS').exec().then(function(result) {
        assert.equal(result, 'RESULT');
      });
    });
  });
});
