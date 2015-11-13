var assert = require('assert');
var sinon = require('sinon');
var mongoose = require('mongoose');
require('sinon-mongoose');

// Require index.js so the Book model will be declared
require('./index.js');

describe('Callbacks example', function () {
  var Book = mongoose.model('Book');
  var BookMock = sinon.mock(Book);

  it('#findByAuthor', function (done) {
    BookMock
      .expects('find').withArgs({ author: 'AUTHOR' })
      .chain('limit', 10)
      .chain('sort', '-date')
      .chain('exec')
      .yields(null, 'RESULT');

    Book.findByAuthor('AUTHOR', function (err, result) {
      BookMock.verify();
      BookMock.restore();
      assert.equal(result, 'RESULT');
      done();
    });
  });

  it('mocking some Document method', function (done) {
    var bookMock = sinon.mock(new Book({ title: 'Rayuela', author: 'Julio Cortazar' }));
    var book = bookMock.object;

    bookMock
      .expects('update').withArgs({ $addToSet: { tags: 'TAG' } })
      .chain('exec')
      .yields(null, 'RESULT');

    book.addTag('TAG', function (err, result) {
      bookMock.verify();
      bookMock.restore();
      assert.equal(result, 'RESULT');
      done();
    });
  });
});
