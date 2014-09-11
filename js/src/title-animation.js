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