var RetirementsChartView = Backbone.View.extend({

    events:  {
        "click .stage-next": "next",
        "click .stage-prev": "back",
        "click .toggle-US": "toggle",
        "click .toggle-EU": "toggle" 
    },

    initialize: function() {
        _.bindAll(this, "render", "next", "back", "update", "toggle");
        this.model.on("change", this.update);
    },

    next: function() {
    	var stage = this.model.get("stage") || 1;
    	stage = Math.min(3, stage + 1);
    	this.model.set("stage", stage);
    	return false;
    },

    back: function() {
    	var stage = this.model.get("stage") || 1;
    	stage = Math.max(1, stage - 1);
    	this.model.set("stage", stage);
    	return false;
    },

    toggle: function(ev) {
    	var id = $(ev.currentTarget).attr("class");
    	var toggle = id.split("-")[1];
    	this.model.set({
    		"stage": 1,
    		"toggle": toggle
    	});
    	return false;
    },

    update: function() {
    	var stage = this.model.get("stage") || 1;
    	var toggle = this.model.get("toggle") || "US";
    	d3.select(this.el).attr("class", "chart-lg retirements " + toggle + " stage-" + stage);
    	d3.select(this.el).select("svg." + toggle).attr("class", toggle + " stage-" + stage);
    },

    render: function() {
    	this.update();
    }
});


