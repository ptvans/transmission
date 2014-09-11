var PolicyScenario = Backbone.View.extend({

	initialize: function(options) {
		_.bindAll(this, "render");
		this.data = options.data;
	},

	render: function() {
		var data = this.data;

		var index = this.model.get("index") || 0;

		var d = data[index];
		var currentData = [d["value_loss"], d["higher_costs"], d["tax_revenue"], d["net_gain"]];

		var format = d3.format(".1f");

		var g = d3.select(this.el);

		var gChartBig = g.select(".svg-detail svg");

		g.select("#country-name")
		.text(d.region)

		var bars = gChartBig.selectAll(".bar")
		.data(currentData);

		var scaleX = d3.scale.linear()
		.domain([0, d3.max(currentData, function(d, i) { return Math.abs(d)})])
		.range([0, 71])

		var newBars = bars.enter().append("g")
		.attr({
		    "class": "bar",
		    "transform": function(d, i) {
		        var tx = 0,
		                ty = i * 80 + 10;
		        return "translate(" + [tx, ty].join(" ") + ")";
		    }
		});

		newBars.append("rect")
		.attr({
		    "height": 30
		});

		newBars.append("text")
		.attr({
		    "class": "num-label",
		    "text-anchor": "middle",
		    "transform": function(d, i) {
		        var tx = 100,
		            ty = 20;
		        return "translate(" + [tx, ty].join(" ") + ")";
		    }
		});

		bars.selectAll("rect")
		.transition()
		.attr({
		    "transform": function(d, i) {
		        var tx = d >= 0 ? 129 : 71 + scaleX(d),
		                ty = 0;
		        return "translate(" + [tx, ty].join(" ") + ")";
		    },
		    "width": function(d) {
		        return Math.abs(scaleX(d));
		    },
		});

		bars.select(".num-label")
		.text(function(d, i) {
		    return d > 0 ? "+" + format(d/1000) : format(d/1000)	
		})

	}
});

var PolicyScenarioCountries = PolicyScenario.extend({

	events: {
		"click #net-country-1": "changeCountry",
		"click #net-country-2": "changeCountry",
		"click #net-country-3": "changeCountry",
		"click #net-country-4": "changeCountry",
		"click #net-country-5": "changeCountry",
		"click #net-country-6": "changeCountry"
	},

	initialize: function(options) {
		_.bindAll(this, "render", "changeCountry");
		this.data = options.data;
		this.model.on("change:index", this.render);
	},

	changeCountry: function(ev) {
		var id = parseInt($(ev.currentTarget).attr("id").split("-")[2]);
		this.model.set("index", id-1);
	}


});