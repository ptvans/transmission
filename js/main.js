var TitleAnimationView = Backbone.View.extend({
    width: 350,
    height: 224,
    interval: 1000,

    initialize: function() {
        _.bindAll(this, "render");
    },

    render: function() {
        var height = this.height,
            width = this.width,
            interval = this.interval;

        var nodes = [],
            start = [{x: 116, y: 124}, {x: 150, y: 126}, {x: 161, y: 140}, {x: 183, y: 147}, {x: 203, y: 148}, {x: 225, y: 151}];

        var g = d3.select(this.el).select("svg");

        var i = 0;
        
        var particles = g.selectAll("circle");

        var classes = ["oil", "gas", "coal"];

        setInterval(function() {
            var idx = Math.floor(Math.random() * start.length);

            var newNode = {id: idx, x: start[idx].x, y: start[idx].y, idx: i};
            nodes.push(newNode);

            if (nodes.length > 300) {
              nodes.shift(); 
            }

            particles = particles.data(nodes, function(d) { return d.idx; });
            particles.exit().remove();
            
            particles.enter().append("circle")
            .attr({
                "class": function(d) { return "particle " + classes[d.id] },
                "transform": function(d, i) {
                    var tx = d.x,
                        ty = d.y;
                    return "translate(" + [tx, ty].join(" ") + ")";
                },
                "cx": 0,
                "cy": 0,
                "r": 2
            })
            .style({
            	"fill": "#cc545b"
            })
            .transition()
            .ease("cubic-out")
            .duration(10500)
            .attr({
                "transform": function(d, i) {
                    var tx = start[idx].x + (Math.random() - 0.5) * 50,
                        ty = 0;
                    return "translate(" + [tx, ty].join(" ") + ")";
                },
                "r": 10
            })
            .style({
            	"fill": "#333"
            })
            
            i++;
        }, 10);
    }
});
var LowHangingFruitView = Backbone.View.extend({
    width: 750,
    height: 300,
    interval: 5,
    numBubbles: 750,

    events:  {
        "click .stage-next": "next"
    },

    initialize: function() {
        _.bindAll(this, "render", "next");
    },

    next: function() {
        this.$el.addClass("stage2");
        return false;
    },

    render: function() {
        var height = this.height,
            width = this.width,
            interval = this.interval;

        var nodes = [],
            foci = [{x: 150, y: 150}, {x: 350, y: 150}, {x: 550, y: 150}],
            start = [{x: 100, y: height}, {x: 500, y: height}, {x: 600, y: height}];

        var scale = d3.scale.linear()
        .domain([0, 14.01, 22.01, 100])
        .range([0, 1, 2, 3]);

        var radiusStart = 2,
            radiusEnd   = 8;

        var scaleTargetX = [
            d3.scale.linear().domain([0, 1]).range([radiusEnd, 98-radiusEnd]),
            d3.scale.linear().domain([0, 1]).range([125+radiusEnd, 181-radiusEnd]),
            d3.scale.linear().domain([0, 1]).range([204+radiusEnd, 750-radiusEnd])
        ];

        var scaleSourceX = [
            d3.scale.linear().domain([0, 1]).range([0, 546]),
            d3.scale.linear().domain([0, 1]).range([572, 632]),
            d3.scale.linear().domain([0, 1]).range([650, 750])
        ];

        var scaleTargetY = d3.scale.linear()
        .domain([0, 1])
        .range([0, 40]);

        var g = d3.select(this.el).select("svg")
        .attr({
            "width": width,
            "height": height
        });

        var i = 0;
        
        var particles = g.selectAll("circle");

        var classes = ["oil", "gas", "coal"];
        var numBubbles = this.numBubbles;
        var interval = this.interval;

        setInterval(function() {
            var dt = new Date();

            var idx = Math.floor(scale(Math.random() * 100));

            var newNode = {id: idx, x: scaleSourceX[idx](Math.random()), y: height, idx: i};
            nodes.push(newNode);

            if (nodes.length > numBubbles) {
              nodes.shift(); 
            }

            particles = particles.data(nodes, function(d) { return d.idx; });
            particles.exit().remove();
            
            particles.enter().append("circle")
            .attr({
                "class": function(d) { return "particle " + classes[d.id] },
                "transform": function(d, i) {
                    var tx = d.x,
                        ty = height;
                    return "translate(" + [tx, ty].join(" ") + ")";
                },
                "cx": 0,
                "cy": 0,
                "r": radiusStart
            })
            .transition()
            .ease("cubic-out")
            .duration(20000)
            .attr({
                "transform": function(d, i) {
                    var tx = scaleTargetX[d.id](Math.random()),
                        ty = scaleTargetY(Math.random());
                    return "translate(" + [tx, ty].join(" ") + ")";
                },
                "r": radiusEnd
            })
            
            i++;
        }, interval);
    }
});
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
var Model = Backbone.Model.extend({});

$(document).ready(function() {
	var lowHangingFruitView = new LowHangingFruitView({ el: "#low-hanging-fruit" });
	lowHangingFruitView.render();

	var titleAnimation = new TitleAnimationView({ el: "#intro" });
	titleAnimation.render();

	d3.json("data/scenarios.json", function(data) {
		var dataTaxes = data.taxes;
		var dataInnovation = data.innovation;
		var dataCountries = data.countries;

		var taxesScenarioView = new PolicyScenario({ "model": new Model(), "data": dataTaxes, el: "#scenario-taxes-cost"});
		taxesScenarioView.render();

		var innovationScenarioView = new PolicyScenario({ "model": new Model(), "data": dataInnovation, el: "#scenario-innovation"});
		innovationScenarioView.render();

		var countryScenarioView = new PolicyScenarioCountries({ "model": new Model({ index: 0 }), "data": dataCountries, el: "#scenario-taxes-consumer-benefit"});
		countryScenarioView.render();

	});
});
 
