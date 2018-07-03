<!-- prettier-ignore-start -->
# sinon-mongoose [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![devDependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> Extend [Sinon][sinon-url] stubs for [Mongoose][mongoose-url] methods to test chained methods easily

## Installation

```sh
$ npm install sinon-mongoose
```

> IMPORTANT! As of version **2.2.0** we are supporting sinon >= 5. 
> If you are using sinon < 5 you could have some problems due to some [breaking changes][sinon-5-breaking-changes] in sinon 5. 

## Usage

```js
require('sinon')
require('sinon-mongoose')
```

### With Promises

> If you are using a version < 2 of `sinon-mongoose` we recommend you to use [sinon-as-promised][sinon-as-promised-url] to have `resolves` and `rejects` methods on stubs.

If you want to test this

```js
MongooseModel.find()
  .limit(10)
  .sort('-date')
  .exec()
  .then(function(result) {
    console.log(result)
  })
```

Just `mock` and `expects` as usual and use `chain` to expects the chained methods.
Finally call `resolves` or `rejects` (remember to require [sinon-as-promised][sinon-as-promised-url]).

```js
sinon
  .mock(MongooseModel)
  .expects('find')
  .chain('limit')
  .withArgs(10)
  .chain('sort')
  .withArgs('-date')
  .chain('exec')
  .resolves('SOME_VALUE')
```

See complete [example][promises-example-url]

### With callbacks (no Promises)

If you want to test this

```js
MongooseModel.find()
  .limit(10)
  .sort('-date')
  .exec(function(err, result) {
    console.log(result)
  })
```

Just `mock` and `expects` as usually and use `chain` to expects the chained methods.
Finally `yields` as always.

```js
sinon
  .mock(MongooseModel)
  .expects('find')
  .chain('limit')
  .withArgs(10)
  .chain('sort')
  .withArgs('-date')
  .chain('exec')
  .yields(null, 'SOME_VALUE')
```

See complete [example][callbacks-example-url]

## Contributors

[@jniemin](https://github.com/jniemin)  
[@joebowbeer](https://github.com/joebowbeer)  
[@YasharF](https://github.com/YasharF)

## License

MIT © [Gonzalo Aguirre]()

[npm-image]: https://badge.fury.io/js/sinon-mongoose.svg
[npm-url]: https://npmjs.org/package/sinon-mongoose
[travis-image]: https://travis-ci.org/underscopeio/sinon-mongoose.svg?branch=master
[travis-url]: https://travis-ci.org/underscopeio/sinon-mongoose
[daviddm-image]: https://david-dm.org/underscopeio/sinon-mongoose/dev-status.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/underscopeio/sinon-mongoose?type=dev
[coveralls-image]: https://coveralls.io/repos/underscopeio/sinon-mongoose/badge.svg
[coveralls-url]: https://coveralls.io/r/underscopeio/sinon-mongoose
[sinon-url]: https://github.com/cjohansen/sinon.js
[mongoose-url]: https://github.com/Automattic/mongoose
[sinon-as-promised-url]: https://github.com/bendrucker/sinon-as-promised
[promises-example-url]: https://github.com/underscopeio/sinon-mongoose/tree/master/examples/promises
[callbacks-example-url]: https://github.com/underscopeio/sinon-mongoose/tree/master/examples/callbacks
[sinon-5-breaking-changes]: http://sinonjs.org/guides/migrating-to-5.0
<!-- prettier-ignore-end -->
