var LowHangingFruitView = Backbone.View.extend({
    width: 780,
    height: 450,
    interval: 1000,

    initialize: function() {
        _.bindAll(this, "render");
    },

    render: function() {
        var height = this.height,
            width = this.width,
            interval = this.interval;

        var nodes = [],
            foci = [{x: 150, y: 150}, {x: 350, y: 150}, {x: 550, y: 150}],
            start = [{x: 100, y: height}, {x: 500, y: height}, {x: 600, y: height}];

        var scale = d3.scale.linear()
        .domain([0, 15, 45, 100])
        .range([0, 1, 2, 3]);

        var scaleTargetX = [
            d3.scale.linear().domain([0, 1]).range([0, 400]),
            d3.scale.linear().domain([0, 1]).range([450, 480]),
            d3.scale.linear().domain([0, 1]).range([530, 730])
        ];

        var scaleTargetY = d3.scale.linear()
        .domain([0, 1])
        .range([50, 90]);

        var fill = d3.scale.category10();

        var g = d3.select(this.el).select("svg")
        .attr({
            "width": width,
            "height": height
        });

        var i = 0;
        
        var particles = g.selectAll("circle");

        setInterval(function() {
            var dt = new Date();

            var idx = Math.floor(scale(Math.random() * 100));

            var newNode = {id: idx, x: start[idx].x + Math.random()*100, y: height, idx: i};
            nodes.push(newNode);

            if (nodes.length > 1000) {
              nodes.shift(); 
            }

            particles = particles.data(nodes, function(d) { return d.idx; });
            particles.exit().remove();
            
            particles.enter().append("circle")
            .attr({
                "class": "node",
                "transform": function(d, i) {
                    var tx = d.x,
                        ty = height;
                    return "translate(" + [tx, ty].join(" ") + ")";
                },
                "cx": 0,
                "cy": 0,
                "r": 20
            })
            .style("fill", function(d) { return fill(d.id); })
            .style("opacity", 0.1)
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