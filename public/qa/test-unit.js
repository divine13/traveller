var fortune = require('../../lib/fortune.js');

var expect = require('chai').expect;

suite('fortune cookies test', function() {
	test('get fortune() should return fortune', function(){
		expect(typeof fortune.getFortune() === 'string');
	});
});