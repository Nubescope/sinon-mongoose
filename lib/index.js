'use strict';
var sinon = require('sinon');
var mongoose = require('mongoose');

function chainMethod(type) {
  var mockType = type === 'query' ? new mongoose.Query() : new mongoose.Aggregate();

  return function chain(method) {
    var queryMock = sinon.mock(mockType);
    this.owner.chainedMock = queryMock;
    makeChainable(queryMock, type);
    makeChainableVerify(queryMock);
    this.returns(queryMock.object);

    return queryMock.expects(method);
  };
}

function makeChainable(mock, mockType) {
  var expectsMethod = mock.expects;

  mock.expects = function(method) {
    mockType = mockType || (method === 'aggregate' ? 'aggregate' : 'query');
    var expectation = expectsMethod.apply(mock, arguments);
    expectation.owner = mock;
    expectation.chain = chainMethod(mockType).bind(expectation);
    return expectation;
  };
}

function makeChainableVerify(mockResult){
  var originalVerify = mockResult.verify;
  function chainedVerify(){
    originalVerify.call(mockResult);
    if (mockResult.chainedMock){
      mockResult.chainedMock.verify();
    }
  }
  mockResult.verify = chainedVerify;
}


var oldMock = sinon.mock;
var newMock = function mock(object) {
  var mockResult = oldMock.apply(this, arguments);

  if (object && (object instanceof mongoose.Model || object.schema instanceof mongoose.Schema)) {
    makeChainable(mockResult);
    makeChainableVerify(mockResult);
  }
  return mockResult;
};

sinon.mock = newMock;

function sandboxMock(object) {
  var mockResult = oldMock.apply(null, arguments);

  if (object && (object instanceof mongoose.Model || object.schema instanceof mongoose.Schema)) {
    makeChainable(mockResult);
    makeChainableVerify(mockResult);
  }

  return this.add(mockResult);
}

sinon.sandbox.mock = sandboxMock;
