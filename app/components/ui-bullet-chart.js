import Ember from 'ember';
import {Bullet} from '../objects/bullet';

export default Ember.Component.extend({
	width: 300,
	height: 25,
 	margin: {top: 25, right: 40, bottom: 20, left: 120},
    // width: 960 - margin.left - margin.right,
    // height: 50 - margin.top - margin.bottom;
	
	chart: null,
	_chart: function() {
		let {width,height,margin,chart,chartData} = this.getProperties('width','height','margin','chart','chartData');
		let self = this;
		console.log('width: %s, height: %s', width, height);
		chart = new Bullet();
		console.log('chart is: %o', chart);
		console.log('Chart width is: %o', chart.width);
		chart.setWidth(width).setHeight(height);
		d3.json("ui-d3-charts/bullet-data.json", function(error, chartData) { 
			console.log('chart data returned');
			let svg = d3.select("#bullet").selectAll("svg")
					.data(chartData)
				.enter().append("svg")
					.attr("class", "bullet")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
				.append("g") 
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			chart.draw(svg);	
			let title = svg.append("g")
				.style("text-anchor", "end")
				.attr("transform", "translate(-6," + height / 2 + ")");

			title.append("text")
				.attr("class", "title")
				.text(function(d) { return d.title; });

			title.append("text")
				.attr("class", "subtitle")
				.attr("dy", "1em")
				.text(function(d) { return d.subtitle; });

			d3.selectAll("button").on("click", function() {
				svg.datum(self.randomize);
				chart.draw(svg);
			});
			self.set('chart', chart.setWidth(width).setHeight(height));
		});
	}.on('didInsertElement'),
	
	randomize: function(d) {
		console.log('randomize set: %o', d);
		if (!d.randomizer) {
			console.log('randomizer NOT set: %o', d);
			d.randomizer = () => {
				console.log('processing: %o', d);
				var k = d3.max(d.ranges) * .2;
				return function(d) {
					return Math.max(0, d + k * (Math.random() - .5));
				};
			};		
		}
		d.ranges = d.ranges.map(d.randomizer);
		d.markers = d.markers.map(d.randomizer);
		d.measures = d.measures.map(d.randomizer);
		return d;
	},	
	
	

});
