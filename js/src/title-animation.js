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
        var g = d3.select(this.el).select("svg");
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
        console.log(intervalLength);

        setTimeout(this.render, intervalLength);
    }
});