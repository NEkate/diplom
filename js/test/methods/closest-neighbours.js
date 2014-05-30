define([
	'chai',
	'methods/closest-neighbours'
], function (
	chai,
	closestNeighbours
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

	describe('closest-neighbours', function () {
		it('should return object in clusters to iteration methods', function () {

			var results = closestNeighbours([ raw1, raw2, raw3, raw4], 0.95);

			expect(JSON.stringify(results)).to.be.equal(
				JSON.stringify([
					[
						raw1, raw3
					],
					[
						raw2, raw4
					]
				])
			)
		});
	});
});