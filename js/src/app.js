var Model = Backbone.Model.extend({});

$(document).ready(function() {
	var lowHangingFruitView = new LowHangingFruitView({ el: "#low-hanging-fruit" });
	lowHangingFruitView.render();
});
 