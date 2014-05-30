define([
	'chai',
	'methods/methodMix'
], function (
	chai,
	methodMix
) {

	var expect = chai.expect;

	var raw1 = [1, 2, 3],
		raw2 = [2, 3, 1],
		raw3 = [110, 315, 400],
		raw4 = [1010, 1233, 1223];

	raw1.region = 'raw1';
	raw2.region = 'raw2';
	raw3.region = 'raw3';
	raw4.region = 'raw4';

	describe('method-mix', function(){
	    it('should return object in cluster to method mix',function(){

			var result = methodMix({
				factor: 0.95,
				objectList: [ raw1, raw2, raw3, raw4],
				counter: 1
			});

			expect(JSON.stringify(result)).to.be.equal(
				JSON.stringify([
					[raw1, raw3],
					[raw2, raw4]
				])
			);

	    });
	});

});