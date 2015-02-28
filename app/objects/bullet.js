export class Bullet {
	
	constructor(config={
		width: 400,
		height: 150,
		orient: 'left',
		reverse: false,
		duration: 0,
		ranges: null,
		markers: null,
		measures: null,
		tickFormat: null
		}) {
			this.config = config;
		// let ranges = this.bulletRanges();
		// let markers = this.bulletMarkers();
		// let measures = this.bulletMeasures();
	}
	
	get width() {
		return this.config.width;
	}
	set width(value) {
		this.config.width = value;
	}
	setWidth(value) {
		this.config.width = value;
		return this;
	}
	
	get height() {
		return this.config.height;
	}
	set height(value) {
		this.config.height = value;
	}
	setHeight(value) {
		this.config.height = value;
	}

	get orient() {
		return this.config.orient;
	}
	set orient(value) {
		this.config.orient = value;
	}
	setOrient(value) {
		this.config.orient = value;
		return this;
	}
	
	get reverse() {
		return this.config.reverse;
	}
    set reverse(value) {
      this.config.reverse = value;
    }
    setReverse(value) {
      this.config.reverse = value;
    }
	
	get duration() {
		return this.config.duration;
	}
    set duration(value) {
      this.config.duration = value;
    }
    setDuration(value) {
      this.config.duration = value;
    }
	
	get ranges() {
		return this.config.ranges;
	}
    set ranges(value) {
      this.config.ranges = value;
    }
    setRanges(value) {
      this.config.ranges = value;
    }
	
	get markers() {
		return this.config.markers;
	}
    set markers(value) {
      this.config.markers = value;
    }
    setMarkers(value) {
      this.config.markers = value;
    }
	
	get tickFormat() {
		return this.config.tickFormat;
	}
    set tickFormat(value) {
      this.config.tickFormat = value;
    }
    setTickFormat(value) {
      this.config.tickFormat = value;
    }
	
	bulletRanges(d) {
	  return d.ranges;
	}

	bulletMarkers(d) {
	  return d.markers;
	}

	bulletMeasures(d) {
	  return d.measures;
	}

	bulletTranslate(x) {
	  return function(d) {
	    return "translate(" + x(d) + ",0)";
	  };
	}

	bulletWidth(x) {
	  var x0 = x(0);
	  return function(d) {
	    return Math.abs(x(d) - x0);
	  };
	}
	
	draw(g) {
		console.log('THIS was: %o', this);
		var self = this;
		g.each(function(d, i) {
			console.log('processing %o, %o', d, i);
			console.log('THIS is: %o', this);
			var rangez = d.ranges.sort(d3.descending);
			var	markerz = d.markers.sort(d3.descending),
				measurez = d.measures.sort(d3.descending),
			// var	markerz = d.markers.call(this, d, i).slice().sort(d3.descending),
			// 	measurez = d.measures.call(this, d, i).slice().sort(d3.descending),
			g = d3.select(this);

			// Compute the new x-scale.
			var x1 = d3.scale.linear()
				.domain([0, Math.max(rangez[0], markerz[0], measurez[0])])
				.range(self.reverse ? [self.width, 0] : [0, self.width]);

			// Retrieve the old x-scale, if this is an update.
			var x0 = self.__chart__ || d3.scale.linear()
						.domain([0, Infinity])
						.range(x1.range());

			// Stash the new scale.
			self.__chart__ = x1;

			// Derive width-scales from the x-scales.
			var w0 = self.bulletWidth(x0),
				w1 = self.bulletWidth(x1);
			console.log('bullet scales: %s,%s', x0, x1);
			console.log('bullet widths: %s,%s', w0, w1);
			console.log('rangez: %o', rangez);

			// Update the range rects.
			var range = g.selectAll("rect.range").data(rangez);

			range.enter().append("rect")
					.attr("class", function(d, i) { return "range s" + i; })
					.attr("width", w0)
					.attr("height", self.height)
					.attr("x", self.reverse ? x0 : 0)
				.transition()
				.duration(self.duration)
					.attr("width", w1)
					.attr("x", self.reverse ? x1 : 0);

			range.transition()
				.duration(self.duration)
				.attr("x", self.reverse ? x1 : 0)
				.attr("width", w1)
				.attr("height", self.height);

			// Update the measure rects.
			var measure = g.selectAll("rect.measure")
				.data(measurez);

			measure.enter().append("rect")
					.attr("class", function(d, i) { return "measure s" + i; })
					.attr("width", w0)
					.attr("height", self.height / 3)
					.attr("x", self.reverse ? x0 : 0)
					.attr("y", self.height / 3)
				.transition()
				.duration(self.duration)
					.attr("width", w1)
					.attr("x", self.reverse ? x1 : 0);

			measure.transition()
				.duration(self.duration)
					.attr("width", w1)
					.attr("height", self.height / 3)
					.attr("x", self.reverse ? x1 : 0)
					.attr("y", self.height / 3);

			// Update the marker lines.
			var marker = g.selectAll("line.marker")
					.data(markerz);

			marker.enter().append("line")
					.attr("class", "marker")
					.attr("x1", x0)
					.attr("x2", x0)
					.attr("y1", self.height / 6)
					.attr("y2", self.height * 5 / 6)
				.transition()
				.duration(self.duration)
					.attr("x1", x1)
					.attr("x2", x1);

			marker.transition()
				.duration(self.duration)
					.attr("x1", x1)
					.attr("x2", x1)
					.attr("y1", self.height / 6)
					.attr("y2", self.height * 5 / 6);

			// Compute the tick format.
			var format = self.tickFormat || x1.tickFormat(8);

			// Update the tick groups.
			var tick = g.selectAll("g.tick")
			.data(x1.ticks(8), function(d) {
				return this.textContent || format(d);
			});

			// Initialize the ticks with the old scale, x0.
			var tickEnter = tick.enter().append("g")
			.attr("class", "tick")
			.attr("transform", self.bulletTranslate(x0))
			.style("opacity", 1e-6);

			tickEnter.append("line")
			.attr("y1", self.height)
			.attr("y2", self.height * 7 / 6);

			tickEnter.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "1em")
			.attr("y", self.height * 7 / 6)
			.text(format);

			// Transition the entering ticks to the new scale, x1.
			tickEnter.transition()
			.duration(self.duration)
			.attr("transform", self.bulletTranslate(x1))
			.style("opacity", 1);

			// Transition the updating ticks to the new scale, x1.
			var tickUpdate = tick.transition()
			.duration(self.duration)
			.attr("transform", self.bulletTranslate(x1))
			.style("opacity", 1);

			tickUpdate.select("line")
			.attr("y1", self.height)
			.attr("y2", self.height * 7 / 6);

			tickUpdate.select("text")
			.attr("y", self.height * 7 / 6);

			// Transition the exiting ticks to the new scale, x1.
			tick.exit().transition()
			.duration(self.duration)
			.attr("transform", self.bulletTranslate(x1))
			.style("opacity", 1e-6)
			.remove();
		});
		d3.timer.flush();
	}
}