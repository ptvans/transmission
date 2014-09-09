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
            foci = [{x: 350, y: 150}, {x: 350, y: 150}, {x: 350, y: 150}],
            start = [{x: 100, y: height}, {x: 500, y: height}, {x: 600, y: height}];

        var scale = d3.scale.linear()
        .domain([0, 15, 45, 100])
        .range([0, 1, 2, 3]);

        var fill = d3.scale.category10();

        var g = d3.select(this.el).select("svg")
        .attr({
            "width": width,
            "height": height
        });

        var node = g.selectAll("circle");

        node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

        var force = d3.layout.force()
        .nodes(nodes)
        .links([])
        .friction(0.2)
        .gravity(0)
        .size([width, height])
        .on("tick", tick);
        
        function tick(e) {
            var kX = 0.024 * e.alpha;
            var kY = 0.1 * e.alpha;
          
            // Push nodes toward their designated focus.
            nodes.forEach(function(o, i) {
                o.y += (foci[o.id].y - o.y) * kY;
                o.x += (foci[o.id].x - o.x) * kX
            });

            node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });            
        }
        
        var i = 500;

        _.each(d3.range(500), function(d) {
            var idx = Math.floor(scale(Math.random() * 100));
            nodes.push({id: idx, x: start[idx].x + Math.random()*100, y: height, idx: i});
            i++;
        })
        setInterval(function() {
            var dt = new Date();
            console.log(dt);

            var idx = Math.floor(scale(Math.random() * 100));
            console.log(idx)

            nodes.push({id: idx, x: start[idx].x + Math.random()*100, y: height, idx: i});

            if (nodes.length > 500) {
              nodes.shift(); 
            }
            force.start();

            node = node.data(nodes, function(d) { return d.idx; });
            
            node.exit().remove();
            
            node.enter().append("circle")
            .attr("class", "node")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return height; })
            .attr("r", 4)
            .style("fill", function(d) { return fill(d.id); })
            
            i++;
        }, 50);
    }
});