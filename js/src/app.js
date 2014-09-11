var Model = Backbone.Model.extend({});

$(document).ready(function() {
	var lowHangingFruitView = new LowHangingFruitView({ el: "#low-hanging-fruit" });
	lowHangingFruitView.render();

	d3.json("../data/scenarios.json", function(data) {
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
 