define([], function () {

	function getCorrelationCoefficient(a, b) {
		var middleA = a.reduce(function(sum, x){return sum + x;}) / a.length;
		var middleB = b.reduce(function(sum, x){return sum + x;}) / b.length;

		var sum = 0,
			sumA = 0,
			sumB = 0;
		for (var i = 0; i < a.length; i++) {
			var x = (a[i] - middleA);
			var y = (b[i] - middleB);
			sum += x * y;
			sumA += x * x;
			sumB += y * y;
		}

		return sum / Math.sqrt(sumA * sumB);
	}

	return getCorrelationCoefficient;
});