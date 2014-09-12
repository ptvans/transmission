var WaterfallCoalView = Backbone.View.extend({

    events:  {
        "click .stage-next": "next",
        "click .stage-prev": "back",
        "mouseover .toggle-annotation-savings": "toggleAnnotationSavings",
        "mouseout .toggle-annotation-savings": "toggleAnnotationSavings",
        "mouseover .costs": "toggleCosts",
        "mouseout .costs": "toggleCosts"
    },

    initialize: function() {
        _.bindAll(this, "render", "next", "back", "update", "toggleAnnotationSavings", "toggleCosts");
        this.model.on("change", this.update);
    },

    toggleAnnotationSavings: function(ev) {
    	d3.select(this.el).select(".annotation-savings").classed("hidden", ev.type == "mouseout");
    },

    toggleCosts: function(ev) {
    	var className = d3.select(ev.currentTarget).attr("class");
    	d3.select(this.el).selectAll(".costs").style("opacity", function() {
    		if (ev.type == "mouseout") { 
    			return "";
    		}
    		return d3.select(this).attr("class") == className ? "" : 0.5;
    	});
    },

    next: function() {
    	var stage = this.model.get("stage") || 1;
    	stage = Math.min(2, stage + 1);
    	this.model.set("stage", stage);
    	return false;
    },

    back: function() {
    	var stage = this.model.get("stage") || 1;
    	stage = Math.max(1, stage - 1);
    	this.model.set("stage", stage);
    	return false;
    },

    update: function() {
    	var stage = this.model.get("stage") || 1;
    	d3.select(this.el).attr("class", "chart-lg " + toggle + " stage-" + stage);
    },

    render: function() {
    	this.update();
    }
});


