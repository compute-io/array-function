/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( './fixtures/noop.js' ),
	add1 = require( './fixtures/add1.js' ),
	add = require( './fixtures/add.js' ),
	factory = require( './../lib/factory.raw.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'apply factory (raw)', function tests() {

	it( 'should export a function', function test() {
		expect( factory ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided the number of input arrays as a positive integer', function test() {
		var values = [
			'5',
			Math.PI,
			-1,
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
				factory( value );
			};
		}
	});

	it( 'should throw an error if provided an apply function argument which is not a function', function test() {
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
				factory( value, 2, {} );
			};
		}
	});

	it( 'should throw an error if provided an options argument which is not an object', function test() {
		var values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				factory( noop, 2, value );
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
			expect( badValue1( values[i] ) ).to.throw( TypeError );
			expect( badValue2( values[i] ) ).to.throw( TypeError );
		}
		function badValue1( value ) {
			return function() {
				factory( 2, {
					'dtype': value
				});
			};
		}
		function badValue2( value ) {
			return function() {
				factory( noop, 2, {
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
				factory( noop, 2, {
					'dtype': value
				});
			};
		}
	});

	it( 'should return a function', function test() {
		var apply;

		apply = factory( 2 );
		assert.isFunction( apply );

		apply = factory( noop, 2 );
		assert.isFunction( apply );

		apply = factory( noop, 2, {} );
		assert.isFunction( apply );
	});

	it( 'should throw an error if not provided the correct number of input arrays', function test() {
		var apply;

		apply = factory( 2 );
		expect( foo ).to.throw( Error );
		expect( foo2 ).to.throw( Error );

		apply = factory( noop, 2 );
		expect( bar ).to.throw( Error );

		function foo() {
			apply( noop );
		}
		function foo2() {
			var a = [1,2,3];
			apply( noop, a, a, a );
		}
		function bar() {
			apply( [1,2,3] );
		}
	});

	it( 'should apply a function to a single array', function test() {
		var apply,
			arr,
			out;

		arr = [ 1, 1, 1, 1 ];

		// General apply function...
		apply = factory( 1 );
		out = apply( add1, arr );
		assert.deepEqual( out, [2,2,2,2] );

		// Specialized apply function...
		apply = factory( add1, 1 );
		out = apply( arr );
		assert.deepEqual( out, [2,2,2,2] );
	});

	it( 'should apply a function to multiple arrays', function test() {
		var apply,
			arr1,
			arr2,
			out;

		arr1 = [ 1, 1, 1, 1 ];
		arr2 = [ 2, 2, 2, 2 ];

		// General apply function...
		apply = factory( 2 );
		out = apply( add, arr1, arr2 );
		assert.deepEqual( out, [3,3,3,3] );

		// Specialized apply function...
		apply = factory( add, 2 );
		out = apply( arr1, arr2 );
		assert.deepEqual( out, [3,3,3,3] );
	});

	it( 'should apply a function and return a array having a specified type', function test() {
		var apply,
			arr,
			out;

		arr = [1,1,1,1];

		apply = factory( add1, 1, {
			'dtype': 'float32'
		});
		out = apply( arr );

		assert.deepEqual( out, new Float32Array( [2,2,2,2] ) );
	});

});
