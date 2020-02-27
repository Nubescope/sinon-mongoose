'use strict'
var sinon = require('sinon')
var mongoose = require('mongoose')

var MethodTypes = Object.freeze({
  aggregate: 'aggregate',
  populate: 'populate',
  query: 'query',
})

function getMethodType(method) {
  const methodType = MethodTypes[method]
  return methodType || MethodTypes.query
}

function chainMethod(type, object) {
  var mockType
  switch (type) {
    case MethodTypes.aggregate:
      mockType = new mongoose.Aggregate()
      break

    case MethodTypes.populate:
      mockType = object
      break

    default:
      mockType = new mongoose.Query()
      break
  }

  return function chain(method) {
    var queryMock = sinon.mock(mockType)
    this.owner.chainedMock = queryMock
    makeChainable(queryMock, object, type)
    makeChainableVerify(queryMock)
    this.returns(queryMock.object)

    return queryMock.expects(method)
  }
}

function makeChainable(mock, object, mockType) {
  var expectsMethod = mock.expects

  mock.expects = function(method) {
    mockType = mockType || getMethodType(method)
    var expectation = expectsMethod.apply(mock, arguments)
    expectation.owner = mock
    expectation.chain = chainMethod(mockType, object).bind(expectation)
    return expectation
  }
}

function makeChainableVerify(mockResult) {
  var originalVerify = mockResult.verify
  function chainedVerify() {
    originalVerify.call(mockResult)
    if (mockResult.chainedMock) {
      mockResult.chainedMock.verify()
    }
  }
  mockResult.verify = chainedVerify
}

var oldMock = sinon.mock
var newMock = function mock(object) {
  var mockResult = oldMock.apply(this, arguments)

  if (
    object &&
    (object instanceof mongoose.Model ||
      object.schema instanceof mongoose.Schema)
  ) {
    makeChainable(mockResult, object)
    makeChainableVerify(mockResult)
  }
  return mockResult
}

sinon.mock = newMock

function sandboxMock(object) {
  var mockResult = oldMock.apply(null, arguments)

  if (
    object &&
    (object instanceof mongoose.Model ||
      object.schema instanceof mongoose.Schema)
  ) {
    makeChainable(mockResult, object)
    makeChainableVerify(mockResult)
  }

  return this.add(mockResult)
}

if (sinon.sandbox) {
  sinon.sandbox.mock = sandboxMock
}
