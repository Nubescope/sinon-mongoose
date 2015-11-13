var sinon = require('sinon');
var mongoose = require('mongoose');

function chain(method) {
  var queryMock = sinon.mock(new mongoose.Query());
  makeChainable(queryMock);

  this.returns(queryMock.object);

  return queryMock.expects(method);
}

function makeChainable(mock) {
  var expectsMethod = mock.expects;

  mock.expects = function () {
    var expectation = expectsMethod.apply(mock, arguments);
    expectation.chain = chain.bind(expectation);
    return expectation;
  };
}

var oldMock = sinon.mock;

sinon.mock = function mock(object) {
  var mockResult = oldMock.apply(this, arguments);

  if (object instanceof mongoose.Model || object.schema instanceof mongoose.Schema) {
    makeChainable(mockResult);
  }

  return mockResult;
};
