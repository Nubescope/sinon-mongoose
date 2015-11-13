# sinon-mongoose [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Extend [Sinon][sinon-url] stubs for [Mongoose][mongoose-url] methods to test chained methods easily

## Installation

```sh
$ npm install sinon-mongoose
```

## Usage

```js
require('sinon');
require('sinon-mongoose');
```
### With Promises

First of all, if you are using Promises we recommend to use [sinon-as-promised][sinon-as-promised-url] npm to have `resolves` and `rejects` methods on stubs.

If you want to test this
```js
MongooseModel.find()
  .limit(10)
  .sort('-date')
  .exec()
  .then(function(result) {
    console.log(result);
  });
```
Just `mock` and `expects` as usual and use `chain` to expects the chained methods.
Finally call `resolves` or `rejects` (remember to require [sinon-as-promised][sinon-as-promised-url]).

```js
sinon.mock(MongooseModel)
  .expects('find')
  .chain('limit').withArgs(10)
  .chain('sort').withArgs('-date')
  .chain('exec')
  .resolves('SOME_VALUE');
```

See complete [example][promises-example-url]

### With callbacks (no Promises)

If you want to test this
```js
MongooseModel.find()
  .limit(10)
  .sort('-date')
  .exec(function(err, result) {
    console.log(result);
  });
```
Just `mock` and `expects` as usually and use `chain` to expects the chained methods.
Finally `yields` as always.

```js
sinon.mock(MongooseModel)
  .expects('find')
  .chain('limit').withArgs(10)
  .chain('sort').withArgs('-date')
  .chain('exec')
  .yields(null, 'SOME_VALUE');
```

See complete [example][callbacks-example-url]
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
[sinon-url]: https://github.com/cjohansen/sinon.js
[mongoose-url]: https://github.com/Automattic/mongoose
[sinon-as-promised-url]: https://github.com/bendrucker/sinon-as-promised
[promises-example-url]: https://github.com/gaguirre/sinon-mongoose/tree/master/examples/promises
[callbacks-example-url]: https://github.com/gaguirre/sinon-mongoose/tree/master/examples/callbacks
