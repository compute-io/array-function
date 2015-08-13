/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( './fixtures/noop.js' ),
	add1 = require( './fixtures/add1.js' ),
	add = require( './fixtures/add.js' ),
	apply = require( './../lib/apply.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'apply', function tests() {

	it( 'should export a function', function test() {
		expect( apply ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided a function', function test() {
		var values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				apply( value, [1,2,3] );
			};
		}
	});

	it( 'should throw an error if provided an options argument which is not an object', function test() {
		var values = [
			// '5', // array-like
			5,
			NaN,
			true,
			null,
			undefined,
			function(){} // array-like
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				apply( noop, [1,2,3], value );
			};
		}
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				apply( noop, [1,2,3], {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided an invalid output data type', function test() {
		var values = [
			'beep',
			'boop',
			'object'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				apply( noop, [1,2,3], {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if not provided input arrays', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			apply( noop, {
				'out': true
			});
		}
	});

	it( 'should throw an error if not provided array-like arguments', function test() {
		var values = [
			// '5', // array-like
			5,
			NaN,
			true,
			null,
			undefined,
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue1( values[i] ) ).to.throw( TypeError );
			expect( badValue2( values[i] ) ).to.throw( TypeError );
			expect( badValue3( values[i] ) ).to.throw( TypeError );
		}
		function badValue1( value ) {
			return function() {
				apply( noop, value );
			};
		}
		function badValue2( value ) {
			return function() {
				apply( noop, [1,2,3], value, {} );
			};
		}
		function badValue3( value ) {
			return function() {
				apply( noop, [1,2,3], [1,2,3], value, {} );
			};
		}
	});

	it( 'should throw an error if provided incompatible array-like arguments', function test() {
		var values = [
			[1,2,3,4],
			[],
			[1,2,3,4,5]
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				apply( noop, [1,2,3], value );
			};
		}
	});

	it( 'should apply a function to a single array', function test() {
		var arr,
			out;

		arr = [ 1, 1, 1, 1 ];

		out = apply( add1, arr );
		assert.deepEqual( out, [2,2,2,2] );
	});

	it( 'should apply a function to multiple arrays', function test() {
		var arr1,
			arr2,
			out;

		arr1 = [ 1, 1, 1, 1 ];
		arr2 = [ 2, 2, 2, 2 ];

		out = apply( add, arr1, arr2 );
		assert.deepEqual( out, [3,3,3,3] );
	});

	it( 'should apply a function and return an array having a specified type', function test() {
		var arr,
			out;

		arr = [ 1, 1, 1, 1 ];

		out = apply( add1, arr, {
			'dtype': 'float32'
		});
		assert.deepEqual( out, new Float32Array( [2,2,2,2] ) );
	});

	it( 'should apply a function to a single array and use a provided output array', function test() {
		var arr,
			out,
			actual;

		arr = [ 1, 1, 1, 1 ];
		out = new Array( arr.length );

		actual = apply( add1, out, arr, {
			'out': true
		});
		assert.strictEqual( out, actual );
		assert.deepEqual( out, [2,2,2,2] );
	});

});
