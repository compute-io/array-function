Array Function
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Applies a function to each [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) element.


## Installation

``` bash
$ npm install compute-array-function
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var arrayfun = require( 'compute-array-function' );
```

<a name="arrayfun"></a>
#### arrayfun( fcn, ...array[, options] )

Applies a `function` to each [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) element.

``` javascript
var arr = [ 1, 2, 3, 4, 5 ];

function add5( val ) {
	return val + 5;
}

var out = arrayfun( add5, arr );
// returns [ 6, 7, 8, 9, 10 ]
```

The function accepts the following `options`:

*	__dtype__: output data type. Default: `generic`.
*	__out__: `boolean` indicating whether an output [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) has been provided. Default: `false`.

By default, the output [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) is a `generic` array. To specify a different data type, set the `dtype` option (see [`compute-array-constructors`](https://github.com/compute-io/array-constructors) for a list of acceptable data types).

``` javascript
var out = arrayfun( add5, arr, {
	'dtype': 'int8';
});
// return Int8Array( [6,7,8,9,10] )
```

By default, the `function` returns a new [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array). To mutate an [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (e.g., when input values can be discarded or when optimizing memory usage), set the `out` option to `true` to indicate that an output [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) has been provided as the __first__ [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) argument.

``` javascript
var out = [ 0, 0, 0, 0, 0 ];

arrayfun( add5, out, arr, {
	'out': 'true';
});
// returns [ 5, 5, 5, 5, 5 ]

// Works with typed output arrays...
out = new Int8Array( 5 );

arrayfun( add5, out, arr, {
	'out': 'true';
});
// returns Int8Array( [5,5,5,5,5] )
```

===
### Factory

The main exported `function` does __not__ make any assumptions regarding the number of input [`arrays`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array). To create a reusable [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) function where the number of input [`arrays`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) is known, a factory method is provided.


<a name="arrayfun-factory"></a>
#### arrayfun.factory( [fcn,] num[, options] )

Creates an apply `function` to apply a `function` to each [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) element.

``` javascript
var afun = arrayfun.factory( 2 );

function add( x, y ) {
	return x + y;
}

var arr1 = new Array( 5 ),
	arr2 = new Array( 5 );

for ( var i = 0; i < 5; i++ ) {
	arr1[ i ] = 5;
	arr2[ i ] = i + 5;
}
// arr1 = [ 5, 5, 5, 5, 5 ]
// arr2 = [ 5, 6, 7, 8, 9 ]

var out = afun( add, arr1, arr2 );
// returns [ 10, 11, 12, 13, 14 ]
```

An apply `function` may be provided during `function` creation.

``` javascript
var aadd = arrayfun.factory( add, 2 );

var out = aadd( arr1, arr2 );
// returns [ 10, 11, 12, 13, 14 ]
```

The function accepts the following `options`:

*	__dtype__: output data type. Default: `generic`.

By default, the output [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) is a `generic` array. To specify a different data type, set the `dtype` option.

``` javascript
var aadd = arrayfun.factory( add, 2, {
	'dtype': 'int32';
});

var out = aadd( arr1, arr2 );
// returns Int32Array( [10,11,12,13,14] )

// ...and for all subsequent calls...
out = aadd( arr1, arr2 );
// returns Int32Array( [10,11,12,13,14] )
```

__Note__: a factory `function` __always__ returns a new [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).


===
### Create

To facilitate using [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) functions within an application where input arguments are of known types and where memory management occurs externally, a method to create minimal [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) functions is provided.

#### arrayfun.create( [fcn,] num )

Creates an apply `function` to apply a `function` to each [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) element, where `num` is the number of input [`arrays`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) __including__ the output [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

``` javascript
var afcn = arrayfun.create( 3 );

var out = afcn( add, out, arr1, arr2 );
// returns [ 10, 11, 12, 13, 14 ]

function subtract( x, y ) {
	return x - y;
}

out = afcn( subtract, out, arr1, arr2 );
// returns [ 0, -1, -2, -3, -4 ]
```

An apply `function` may be provided during `function` creation.

``` javascript
var aadd = arrayfun.create( add, 3 );

var out = aadd( out, arr1, arr2 );
// returns [ 10, 11, 12, 13, 14 ]
```



===
### Raw

Lower-level APIs are provided which forgo some of the guarantees of the above APIs, such as input argument validation. While use of the above APIs are encouraged in REPL environments, use of the lower-level interfaces may be warranted when arguments are of a known type or when performance is paramount.

#### arrayfun.raw( fcn, ...array[, options] )

Applies a `function` to each [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) element.

``` javascript
var arr = [ 0, 0, 0, 0, 0 ]

var out = arrayfun.raw( add5, arr );
// returns [ 5, 5, 5, 5, 5 ]
```

The function accepts the same `options` as the main exported [function](#arrayfun).


#### arrayfun.rawFactory( [fcn,] num[, options] )

Creates an apply `function` to apply a `function` to each [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) element.

``` javascript
var afun = arrayfun.rawFactory( 2 );

var out = afun( add, arr1, arr2 );
// returns [ 10, 11, 12, 13, 14 ]
```

The function accepts the same `options` as [`arrayfun.factory()`](#arrayfun-factory).



## Notes

*	Both factory methods, as well as the `.create()` method, use dynamic code evaluation. Beware when using these methods in the browser as they may violate your [content security policy](https://developer.mozilla.org/en-US/docs/Web/Security/CSP) (CSP). 



## Examples

``` javascript
var arrayfun = require( 'compute-array-function' );

var arr1,
	arr2,
	out,
	i;

arr1 = new Array( 25 );
for ( i = 0; i < arr1.length; i++ ) {
	arr1[ i ] = i;
}

arr2 = new Array( 25 );
for ( i = 0; i < arr2.length; i++ ) {
	arr2[ i ] = 5;
}

function add( x, y ) {
	return x + y;
}

out = arrayfun( add, arr1, arr2 );
console.log( out );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. The [Compute.io](https://github.com/compute-io) Authors.


[npm-image]: http://img.shields.io/npm/v/compute-array-function.svg
[npm-url]: https://npmjs.org/package/compute-array-function

[travis-image]: http://img.shields.io/travis/compute-io/array-function/master.svg
[travis-url]: https://travis-ci.org/compute-io/array-function

[codecov-image]: https://img.shields.io/codecov/c/github/compute-io/array-function/master.svg
[codecov-url]: https://codecov.io/github/compute-io/array-function?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/array-function.svg
[dependencies-url]: https://david-dm.org/compute-io/array-function

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/array-function.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/array-function

[github-issues-image]: http://img.shields.io/github/issues/compute-io/array-function.svg
[github-issues-url]: https://github.com/compute-io/array-function/issues
