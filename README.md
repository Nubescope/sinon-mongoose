# sinon-mongoose [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Sinon extensions for Mongoose stubs

## Installation

```sh
$ npm install --save-dev sinon-mongoose
```

## Usage

```js
require('sinon');
require('sinon-mongoose');
```

First, we recommend to also use `sinon-as-promised` npm to have `resolves` and `rejects` methods on stubs.
The following examples require it.

### Mock Model

Suppose we want to test this

```js
MongooseModel.find()
  .limit(10)
  .sort('-date')
  .exec()
  .then(function(result) {
    console.log(result);
  });
```
Just use `mockModel` instead of `mock`, expects the method as always and use `chain` to expects the chained methods

```js
sinon.mockModel(MongooseModel)
  .expects('find')
  .chain('limit').withArgs(10)
  .chain('sort').withArgs('-date')
  .chain('exec')
  .resolves('SOME_VALUE');
```

## License

MIT © [Gonzalo Aguirre]()


[npm-image]: https://badge.fury.io/js/sinon-mongoose.svg
[npm-url]: https://npmjs.org/package/sinon-mongoose
[travis-image]: https://travis-ci.org/gaguirre/sinon-mongoose.svg?branch=master
[travis-url]: https://travis-ci.org/gaguirre/sinon-mongoose
[daviddm-image]: https://david-dm.org/gaguirre/sinon-mongoose.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/gaguirre/sinon-mongoose
[coveralls-image]: https://coveralls.io/repos/gaguirre/sinon-mongoose/badge.svg
[coveralls-url]: https://coveralls.io/r/gaguirre/sinon-mongoose
