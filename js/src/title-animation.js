var TitleAnimationView = Backbone.View.extend({
    width: 350,
    height: 224,

    initialize: function() {
        _.bindAll(this, "render");
        this.intervalScale = d3.scale.linear()
        .domain([0, 25, 50, 75, 100])
        .range([100, 20, 5, 2, 1]);

        this.i = 0;
        this.nodes = [];
        var g = d3.select(this.el).select("#intro-smoke-particles svg");
        this.particles = g.selectAll("circle");
    },

    render: function() {
        var height = this.height,
            width = this.width;

        var start = [{x: 116, y: 124}, {x: 150, y: 126}, {x: 161, y: 140}, {x: 183, y: 147}, {x: 203, y: 148}, {x: 225, y: 151}];



        var idx = Math.floor(Math.random() * start.length);

        var newNode = {id: idx, x: start[idx].x, y: start[idx].y, idx: this.i};
        this.nodes.push(newNode);

        if (this.nodes.length > 300) {
            this.nodes.shift(); 
        }

        this.particles = this.particles.data(this.nodes, function(d) { return d.idx; });
        this.particles.exit().remove();
        
        this.particles.enter().append("circle")
        .attr({
            "class": "particle",
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
        
        this.i++;

        var intervalLength = this.intervalScale(this.model.get("progress"));

        setTimeout(this.render, intervalLength);
    }
});

TitleAnimationChartView = Backbone.View.extend({

    initialize: function() {
        _.bindAll(this, "render", "update");
        this.intervalScale = d3.scale.linear()
        .domain([0, 25, 50, 75, 100])
        .range([100, 20, 5, 2, 1]);

        this.model.on("change:progress", this.update);
        this.g = d3.select(this.el).select("#intro-chart svg");

        this.timeScales = {
            "past": d3.time.scale().domain([new Date(1980, 0, 1), new Date(2014, 0, 1)]).range([0, 100]),
            "projection": d3.time.scale().domain([new Date(2014, 0, 1), new Date(2035, 0, 1)]).range([0, 100]),
            "scenario": d3.time.scale().domain([new Date(2014, 0, 1), new Date(2100, 0, 1)]).range([0, 100]),
            "axis": d3.time.scale().domain([new Date(1980, 0, 1), new Date(2100, 0, 1)]).range([0, 678])
        }
    },

    update: function() {
        var g = this.g;

        var progress = this.model.get("progress");
        var dt = this.model.get("date");

        var lPast       = g.select(".timeseries-past").node().getTotalLength();
        var lProjection = g.select(".timeseries-projection").node().getTotalLength();
        var lScenario   = g.select(".target-scenario").node().getTotalLength();
        var visiblePast       = lPast / 100 * Math.max(0, Math.min(100, this.timeScales.past(dt)));
        var visibleProjection = lProjection / 100 * Math.max(0, Math.min(100, this.timeScales.projection(dt)));
        var visibleScenario   = lScenario / 100 * Math.max(0, Math.min(100, this.timeScales.scenario(dt)));

        var dashArrayPast = visiblePast + "," + (lPast-visiblePast);
        var dashArrayProjection = visibleProjection + "," + (lProjection-visibleProjection);
        var dashArrayScenario = visibleScenario + "," + (lScenario-visibleScenario);
        g.select(".timeseries-past").attr("stroke-dasharray", dashArrayPast);
        g.select(".timeseries-projection").attr("stroke-dasharray", dashArrayProjection);
        g.select(".target-scenario").attr("stroke-dasharray", dashArrayScenario);

        g.select(".timeseries-projection-decoration-1").attr("opacity", visibleProjection >= lProjection ? 1 : 0);
        g.select(".target-scenario-decoration-1").attr("opacity", visibleScenario >= lScenario*.98 ? 1 : 0);

        var currentYear = g.select(".current-year");
        currentYear.attr("transform", "translate(" + (19 + this.timeScales.axis(dt)) + " 389)");
        currentYear.select("tspan").text(dt.getFullYear());
    },

    render: function() {
        var g = this.g;

        g.select(".target-scenario").attr("stroke-dasharray", "0,1500,0");
        g.select(".timeseries-past").attr("stroke-dasharray", "0,1500,0");
        g.select(".timeseries-projection").attr("stroke-dasharray", "0,1500,0");
        g.select(".timeseries-projection-decoration-1").attr("opacity", 0);
        g.select(".target-scenario-decoration-1").attr("opacity", 0);
      // g.select("")
    }

});