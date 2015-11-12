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

function mockModel(model) {
  var modelMock = sinon.mock(model);
  makeChainable(modelMock);

  return modelMock;
}

function mockDocument(Model, params) {
  var documentMock = sinon.mock(new Model(params));
  makeChainable(documentMock);

  return documentMock;
}

sinon.mockModel = mockModel;
sinon.mockDocument = mockDocument;
