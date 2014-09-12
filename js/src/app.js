var Model = Backbone.Model.extend({});

$(document).ready(function() {
	var lowHangingFruitView = new LowHangingFruitView({ el: "#low-hanging-fruit" });
	lowHangingFruitView.render();

	var model = new Model({ progress: 0 });

	var titleAnimation = new TitleAnimationView({ el: "#intro", model: model });
	titleAnimation.render();

	var titleAnimationChart = new TitleAnimationChartView({ el: "#intro-chart", model: model });
	titleAnimationChart.render();

	var retirementChart = new RetirementsChartView({ el: "#chart-retirements", model: new Model({ stage: 0, toggle: "US"})});
	retirementChart.render();

	var waterfallCoal = new WaterfallCoalView({ el: "#waterfall-coal", model: new Model({ stage: 1 })});
	waterfallCoal.render();

	var waterfallTransport = new WaterfallCoalView({ el: "#waterfall-transport", model: new Model({ stage: 1 })});
	waterfallTransport.render();

	d3.json("data/scenarios.json", function(data) {
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

	var introScrollHeight = 1000;

	var timeScale = d3.scale.linear()
	.domain([0, 100])
	.range([1980, 2100]);

	$(window).scroll(function() {
		var currentPos = $(this).scrollTop();
		var progress = 100/introScrollHeight * currentPos;
		
		// stop if we're past the intro screen
		if (progress > 100) {
			return;
		}

		model.set({
			"progress": progress,
			"date": new Date(Math.round(timeScale(progress)), 0, 1)
		});
	});
});

 