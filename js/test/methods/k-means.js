define(['chai', 'methods/k-means'], function (chai, kMeans) {

	var expect = chai.expect;

	var raw1 = [1, 2, 3],
		raw2 = [2, 3, 1],
		raw3 = [110, 315, 400],
		raw4 = [1010, 1233, 1223];

	raw1.region = 'raw1';
	raw2.region = 'raw2';
	raw3.region = 'raw3';
	raw4.region = 'raw4';

	describe('k-means', function () {
		it('should return object in clusters to k-means methods', function () {

			var result = kMeans([ raw1, raw2, raw3, raw4], 0.95, 3, true);


			expect(JSON.stringify(result)).to.be.equal(
				JSON.stringify([
					[raw3, raw1],
					[raw4],
					[raw2]
				])
			);
		});
	});

});
