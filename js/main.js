var LowHangingFruitView = Backbone.View.extend({
    width: 750,
    height: 300,
    interval: 1000,

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

        var scaleTargetX = [
            d3.scale.linear().domain([0, 1]).range([0, 98]),
            d3.scale.linear().domain([0, 1]).range([125, 181]),
            d3.scale.linear().domain([0, 1]).range([204, 750])
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

        setInterval(function() {
            var dt = new Date();

            var idx = Math.floor(scale(Math.random() * 100));

            var newNode = {id: idx, x: scaleSourceX[idx](Math.random()), y: height, idx: i};
            nodes.push(newNode);

            if (nodes.length > 1000) {
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
                "r": 20
            })
            .transition()
            .ease("cubic-out")
            .duration(5500)
            .attr({
                "transform": function(d, i) {
                    var tx = scaleTargetX[d.id](Math.random()),
                        ty = scaleTargetY(Math.random());
                    return "translate(" + [tx, ty].join(" ") + ")";
                },
                "r": 4
            })
            
            i++;
        }, 10);
    }
});
var Model = Backbone.Model.extend({});

$(document).ready(function() {
	var lowHangingFruitView = new LowHangingFruitView({ el: "#low-hanging-fruit" });
	lowHangingFruitView.render();
});
 
