var sinon = require('sinon');
var mongoose = require('mongoose');

function chainMethod(type) {
  var mockType = type === 'query' ? new mongoose.Query() : new mongoose.Aggregate();

  return function chain(method) {
    var queryMock = sinon.mock(mockType);
    makeChainable(queryMock, type);
    this.returns(queryMock.object);

    return queryMock.expects(method);
  };
}

function makeChainable(mock, mockType) {
  var expectsMethod = mock.expects;

  mock.expects = function (method) {
    mockType = mockType || (method === 'aggregate' ? 'aggregate' : 'query');
    var expectation = expectsMethod.apply(mock, arguments);
    expectation.chain = chainMethod(mockType).bind(expectation);
    return expectation;
  };
}

var oldMock = sinon.mock;

sinon.mock = function mock(object) {
  var mockResult = oldMock.apply(this, arguments);

  if (object && (object instanceof mongoose.Model || object.schema instanceof mongoose.Schema)) {
    makeChainable(mockResult);
  }

  return mockResult;
};
