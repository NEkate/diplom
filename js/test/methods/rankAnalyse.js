define([
	'chai',
	'methods/rankAnalyse',
	'test/object-list'
], function (
	chai,
	rankAnalyse,
	objectList
) {

	var expect = chai.expect;

	describe('rankAnalyse', function(){
	    it('should return sorted average list', function(){
			expect(rankAnalyse(objectList)).to.deep.equal(
				[
					{
						region: 'region1',
						averageValue: 5
					},
					{
						region: 'region2',
						averageValue: 4
					}
				]
			);
	    });
	});
});