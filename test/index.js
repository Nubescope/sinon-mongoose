'use strict'
var assert = require('assert')
var sinon = require('sinon')
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
require('../lib')

describe('sinon-mongoose', function() {
  var bookSchema = new mongoose.Schema({
    title: String,
  })

  var Book = mongoose.model('Book', bookSchema)

  describe('should made Mongoose model methods chainables', function() {
    it('#find', function(done) {
      var BookMock = sinon.mock(Book)

      BookMock.expects('find')
        .withArgs('SOME_ARGUMENTS')
        .chain('exec')
        .resolves('RESULT')

      Book.find('SOME_ARGUMENTS')
        .exec()
        .then(function(result) {
          BookMock.verify()
          BookMock.restore()
          assert.equal(result, 'RESULT')
          done()
        })
    })

    it('#lean', function(done) {
      var BookMock = sinon.mock(Book)

      BookMock.expects('find')
        .withArgs('SOME_ARGUMENTS')
        .chain('lean')
        .chain('exec')
        .resolves('RESULT')

      Book.find('SOME_ARGUMENTS')
        .lean()
        .exec()
        .then(function(result) {
          BookMock.verify()
          BookMock.restore()
          assert.equal(result, 'RESULT')
          done()
        })
    })

    it('#count', function(done) {
      var BookMock = sinon.mock(Book)

      BookMock.expects('find')
        .withArgs('SOME_ARGUMENTS')
        .chain('count')
        .chain('exec')
        .resolves('RESULT')

      Book.find('SOME_ARGUMENTS')
        .count()
        .exec()
        .then(function(result) {
          BookMock.verify()
          BookMock.restore()
          assert.equal(result, 'RESULT')
          done()
        })
    })

    it('#aggregate', function(done) {
      var BookMock = sinon.mock(Book)

      BookMock.expects('aggregate')
        .chain('lookup')
        .resolves('RESULT')

      Book.aggregate()
        .lookup()
        .then(function(result) {
          BookMock.verify()
          BookMock.restore()
          assert.equal(result, 'RESULT')
          done()
        })
    })
  })

  describe('should made Mongoose document methods chainables', function() {
    it('#update', function(done) {
      var bookMock = sinon.mock(new Book({ title: 'Rayuela' }))

      bookMock
        .expects('update')
        .withArgs('SOME_ARGUMENTS')
        .chain('exec')
        .resolves('RESULT')

      bookMock.object
        .update('SOME_ARGUMENTS')
        .exec()
        .then(function(result) {
          bookMock.verify()
          bookMock.restore()
          assert.equal(result, 'RESULT')
          done()
        })
    })

    it('#verify chained', function(done) {
      var bookMock = sinon.mock(new Book({ title: 'Rayuela' }))

      bookMock
        .expects('update')
        .chain('sort')
        .chain('exec')
        .resolves('RESULT')

      bookMock.object
        .update('SOME_ARGUMENTS')
        .exec()
        .then(function() {
          // eslint-disable-line
          try {
            bookMock.verify()
            bookMock.restore()
            done(new Error('should fail to bookMock.verify()'))
          } catch (err) {
            bookMock.restore()
            assert.equal(
              err.message,
              'Expected sort([...]) once (never called)'
            )
            done()
          }
        })
    })
  })

  describe('using sinon sandbox', function() {
    beforeEach(function() {
      sinon.restore()
    })

    afterEach(function() {
      sinon.verify()
    })

    it('should work mocking Model', function() {
      var BookMock = sinon.mock(Book)

      BookMock.expects('find')
        .withArgs('SOME_ARGUMENTS')
        .chain('exec')
        .resolves('RESULT')

      Book.find('SOME_ARGUMENTS')
        .exec()
        .then(function(result) {
          assert.equal(result, 'RESULT')
        })
    })

    it('should work mocking Document', function() {
      var bookMock = sinon.mock(new Book({ title: 'Rayuela' }))

      bookMock
        .expects('update')
        .withArgs('SOME_ARGUMENTS')
        .chain('exec')
        .resolves('RESULT')

      bookMock.object
        .update('SOME_ARGUMENTS')
        .exec()
        .then(function(result) {
          assert.equal(result, 'RESULT')
        })
    })

    it('Model should be restored properly', function() {
      var bookMock = sinon.mock(Book)
      bookMock.expects('findOne').never()
      sinon.restore()
      var anotherBookMock = sinon.mock(Book)
      anotherBookMock.expects('findOne').never()
    })

    it('Verify chained - expectation.never()', function(done) {
      var bookMock = sinon.mock(new Book({ title: 'Rayuela' }))

      bookMock
        .expects('update')
        .chain('sort')
        .never()
        .chain('limit')
        .chain('exec')
        .resolves('RESULT')

      bookMock.object
        .update('SOME_ARGUMENTS')
        .exec()
        .then(function() {
          // eslint-disable-line
          try {
            bookMock.verify()
            sinon.restore()
            done(new Error('should fail to bookMock.verify()'))
          } catch (err) {
            sinon.restore()
            try {
              assert.equal(
                err.message,
                'Expected limit([...]) once (never called)'
              )
              done()
            } catch (error) {
              done(error)
            }
          }
        })
    })

    it('Verify chained - expectation withArgs()', function(done) {
      var bookMock = sinon.mock(new Book({ title: 'Rayuela' }))

      bookMock
        .expects('update')
        .chain('sort')
        .withArgs({ field: 'asc' })
        .chain('limit')
        .chain('exec')
        .resolves('RESULT')

      bookMock.object
        .update('SOME_ARGUMENTS')
        .sort({ field: 'asc' })
        .exec()
        .then(function() {
          // eslint-disable-line
          try {
            bookMock.verify()
            sinon.restore()
            done(new Error('should fail to bookMock.verify()'))
          } catch (err) {
            sinon.restore()
            try {
              assert.equal(
                err.message,
                'Expected limit([...]) once (never called)'
              )
              done()
            } catch (error) {
              done(error)
            }
          }
        })
    })
  })
})
