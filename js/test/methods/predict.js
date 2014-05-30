define([
	'chai',
	'methods/predicts/methodMix'
], function (chai, methodMix) {
	var expect = chai.expect;

	var raw1 = [1, 2, 3],
		raw2 = [2, 3, 1];


	raw1.region = 'raw1';
	raw2.region = 'raw2';


	describe('predict', function () {
		it('should return predict by method exponential smoothing ', function () {

			var result = methodMix({
				objectList: [raw1, raw2],
				alpha: 0.9
			});

			expect(result[0].exponentialSmoothingPredict).to.be.within(2.9, 3);
			expect(result[1].exponentialSmoothingPredict).to.be.within(1.19, 1.21);
		});

		it('should return predict by method moving average predict', function(){

			var result = methodMix({
				objectList: [raw1, raw2],
				alpha: 0.9
			});

			expect(result[0].movingAveragePredict).to.be.within(1.9, 2.1);
			expect(result[1].movingAveragePredict).to.be.within(1.9, 2.1);
		});

		it('should return total predict ', function(){

			var result = methodMix({
				objectList: [raw1, raw2],
				alpha: 0.9
			});

			expect(result[0].predict).to.be.within(2.53, 2.55);
			expect(result[1].predict).to.be.within(1.51, 1.53);
		});


	});

});