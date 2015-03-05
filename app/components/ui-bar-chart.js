import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['ui-bar-chart','bar-chart'],
	margin: {top: 20, right: 20, bottom: 70, left: 40},

	xLabel: '',
	yLabel: '',
	yAxisPosition: 'left',
	xAxisPosition: 'bottom',
	timeFormat: false,
	barPadding: .05,
	min: 0,
	max: 'auto',
	valueLabel: false, // display the values in the bar? possible values include "all", "max", and "peaks"
	update: function() {
		let {data} = this.getProperties('data');
		svg.selectAll("bar")
			.data(data)
			.attr("class", function(d, i) { 
				let barClasses = ['bar', `s${i}`];
				if(d.value === maxValue) barClasses.push('max');
				if(d.value === 0) barClasses.push('zero');
				if(i % 2 === 0) barClasses.push('odd');
				else barClasses.push('even');
				return barClasses.join(' ');
			})
			.attr("x", d => x(d.name))
			.attr("width", x.rangeBand())
			.attr("y", d => y(d.value))
			.attr("height", d => height - y(d.value));
	},
	draw: function() {
		let {margin,componentWidth,componentHeight} = this.getProperties('margin','componentWidth','componentHeight');
		let {xLabel,yLabel,valueLabel,xAxisPosition, yAxisPosition, timeFormat} = this.getProperties('xLabel','yLabel','valueLabel','xAxisPosition','yAxisPosition','timeFormat');
		let {min,max, barPadding} = this.getProperties('min','max','barPadding');
		let {data} = this.getProperties('data');
		let width = 600 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

		// set the scale
		let x = d3.scale.ordinal().rangeRoundBands([0, width], barPadding);
		let y = d3.scale.linear().range([height, 0]);
		// Parse the name / time (if needed)
		let ordinalParser = timeFormat ? d3.time.format(timeFormat).parse : x => x;
		
		let xAxis = d3.svg.axis()
			.scale(x)
			.orient(xAxisPosition)
		.tickFormat(d3.time.format(timeFormat));

		let yAxis = d3.svg.axis()
			.scale(y)
			.orient(yAxisPosition)
			.ticks(10);
		
		let svg = d3.select(`#${this.elementId}`).append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// prep the data
		data.forEach(function(d) {
			d.name = ordinalParser(d.name); // process date if ordinal is a date
			d.value = +d.value; // ensure cast to numeric
		});

		// x-axis domain
		x.domain(data.map(d => d.name));
		// y-axis domain
		let minValue = d3.min(data, d => d.value);
		let maxValue = d3.max(data, d => d.value);
		min = min === 'auto' ? minValue : min;
		max = max === 'auto' ? maxValue : max;
		y.domain([min, max]);

		svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-0.8em")
				.attr("dy", "-.55em")
				.attr("transform", "rotate(-90)" );

		svg.append("g")
				.attr("class", "y axis")
			.call(yAxis)
			// add descriptor for y-axis label
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.attr("class", "y axis-label")
				.text(this.get('yLabel'));
				
		svg.selectAll("bar")
			.data(data)
			.enter().append("rect")
				.attr("class", function(d, i) { 
					let barClasses = ['bar', `s${i}`];
					if(d.value === maxValue) barClasses.push('max');
					if(d.value === 0) barClasses.push('zero');
					if(i % 2 === 0) barClasses.push('odd');
					else barClasses.push('even');
					return barClasses.join(' ');
				})
				.attr("x", d => x(d.name))
				.attr("width", x.rangeBand())
				.attr("y", d => y(d.value))
				.attr("height", d => height - y(d.value))
				.append('text')
					.attr('x', d => x(d.name))
					.attr('dy', '.8em')
					.text(d => d.value)
					.style('fill','black')
					.style('fond-size', '11px');
				
		if(valueLabel) {
			console.log('valueLabel set');
			svg.selectAll("text")
				.data(data)
			.enter()
				.append('text')
				.text(d => d.value)
				.attr('x', d => x(d.name))
				.attr('dx', '.8em')
				.style("text-anchor", "end")
				.style("color","black")
				.attr('class', 'value-label')
		}
	}.on('didInsertElement'),
	data: [
			{name:"2013-01", value:  53},
			{name:"2013-02", value:  165},
			{name:"2013-03", value:  269},
			{name:"2013-04", value:  344},
			{name:"2013-05", value:  376},
			{name:"2013-06", value:  410},
			{name:"2013-07", value:  421},
			{name:"2013-08", value:  405},
			{name:"2013-09", value:  376},
			{name:"2013-10", value:  359},
			{name:"2013-11", value:  392},
			{name:"2013-12", value:  433},
			{name:"2014-01", value:  455},
			{name:"2014-02", value:  478}
	],
	dataObserver: function() {
		console.log('data changed');
		this.update();
	}.observes('data@each.value')
});
