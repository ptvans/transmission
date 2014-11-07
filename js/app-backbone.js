(function() {
	

//LAYOUT SVG
$("#model-engine-speed").attr({
	"transform":"translate(175,270)"
});
$("#model-road-speed").attr({
	"transform":"translate(795,320)"
});
$("#model-gear-ratio").attr({
	"transform":"translate(400,-125)"
});

//Code School stuff
	var TodoItem = Backbone.Model.extend({});

	var todoItem = new TodoItem (
		{ description: 'pick up milk', status: 'incomplete', id:1 }
	);

	var TodoView = Backbone.View.extend({
		render: function(){
			var html = '<h3>' + this.model.get('description') + '</h3>';
			$(this.el).html(html);
		}
	});

	var todoView = new TodoView({model: todoItem});
	todoView.render();

	console.log(todoView.el);


//Paul Stuff
console.log("app js is loading")

	var now = new Date();
	var startTime = now.getTime();
	var timer = now.getTime() - startTime;
	console.log(timer);

	// http://www.crawlpedia.com/rpm_gear_calculator.htm
	// Speed  = (RPM * tire diameter) / (Axle Ratio * Transmission Ratio * 336.13) 
	// Note: 336.13 is used to convert the result to RPM = 
	// [63358 inches per mile / (60 minutes per hour x Pi.)]
	var rpm = 0;
	var speed = 0;
	var diam = 24.6;
	//wheel diameter based on General Tire Altimax HP 215/45R17 at 24.6 inches (839 revs per mile)
	var axle = 4.05;
	var convert = 336.13;
	var gear = 1;

	//transmission gear ratios for 2001 Saab 9-3 Viggen manual trans
	//http://www.saabcentral.com/forums/showthread.php?t=62413
	var t1 = 3.38;
	var t2 = 1.76;
	var t3 = 1.18;
	var t4 = 0.89;
	var t5 = 0.66;
	var tratios = [t1, t2, t3, t4, t5];


	//FAKE ENGINE SPEED MODEL
	// time coeff per gear
	var g1 = 0.5;
	var g2 = 0.4;
	var g3 = 0.3;
	var g4 = 0.2;
	var g5 = 0.1;
	var tcoeffs = [g1, g2, g3, g4, g5];

	var maxRPM = 6;
	var maxMPH = 155;
	var rotateRPM = 0;
	var rotateMPH = 0;
	var gas = 0;
	var idle = 0.9;

	function calcRPM(t){
		rpm = gas * ( maxRPM - Math.pow((tcoeffs[gear-1] * t - 2.25 ),2) );
		speed = (rpm * 1000 * diam)/(axle * tratios[gear-1] * convert);
	}

	//CAR MODEL
	var model = d3.select("#svg-model");
	var gears = d3.selectAll("#gears>rect")
	console.log(gears);
	var gear01 = d3.select("#gear01");
	var gear02 = d3.select("#gear02");
	var gear03 = d3.select("#gear03");
	var gear04 = d3.select("#gear04");
	var gear05 = d3.select("#gear05");


	//GAUGE ROTATION SCALES
	var rpmScale = d3.scale.linear()
	    .domain([0, maxRPM])
	    .range([0, 185]);
	var rpmStrokeScale = d3.scale.linear()
	    .domain([0, maxRPM])
	    .range([295, 0]);
	var mphScale = d3.scale.linear()
	    .domain([0, maxMPH])
	    .range([0, 335]);
	var mphStrokeScale01 = d3.scale.linear()
	    .domain([0, 35])
	    .range([100, 0]);
	var mphStrokeScale02 = d3.scale.linear()
	    .domain([12, 55])
	    .range([144, 0]);
	var mphStrokeScale03 = d3.scale.linear()
	    .domain([25, 90])
	    .range([247, 0]);
	var mphStrokeScale04 = d3.scale.linear()
	    .domain([37, 123])
	    .range([310, 0]);
	var mphStrokeScale05 = d3.scale.linear()
	    .domain([50, maxMPH])
	    .range([386, 0]);


	var arcs = d3.selectAll("#arcs>g");
	console.log(arcs);
	var arc01 = d3.select("#stroke-mph-1");
	var arc02 = d3.select("#stroke-mph-2");
	var arc03 = d3.select("#stroke-mph-3");
	var arc04 = d3.select("#stroke-mph-4");
	var arc05 = d3.select("#stroke-mph-5");

	// CONTROLS - GEAR POSITION
	function setGearPos() {
		console.log("gear pos called!");
		switch(gear) {
			case 1:
				$("#gear-selector").attr({
					"style":"transform: translate(1px,1px)",
					"class":"01"
				});
				gears.classed('active',false);
				gear01.classed('active',true);
				arcs.classed('active',false);
				arc01.classed('active',true);
				break;
			case 2:
				$("#gear-selector").attr({
					"style":"transform: translate(1px,52px)",
					"class":"02"
				});
				gears.classed('active',false);
				gear02.classed('active',true);
				arcs.classed('active',false);
				arc02.classed('active',true);
				break;
			case 3:
				$("#gear-selector").attr({
					"style":"transform: translate(26px,1px)",
					"class":"03"
				});
				gears.classed('active',false);
				gear03.classed('active',true);
				arcs.classed('active',false);
				arc03.classed('active',true);
				break;
			case 4:
				$("#gear-selector").attr({
					"style":"transform: translate(26px,52px)",
					"class":"04"
				});
				gears.classed('active',false);
				gear04.classed('active',true);
				arcs.classed('active',false);
				arc04.classed('active',true);
				break;
			case 5:
				$("#gear-selector").attr({
					"style":"transform: translate(52px,1px)",
					"class":"05"
				});
				gears.classed('active',false);
				gear05.classed('active',true);
				arcs.classed('active',false);
				arc05.classed('active',true);
				break;
			default:
				$("#gear-selector").attr({
					"style":"transform: translate(26px,26px)"
				});
				gears.classed('active',false);
		}
	}	

	//THE BIG LOOP THAT DOES ALL THE STUFF
	setInterval(dothis, 100);
	
	function dothis() {
		//now = Date();
		//console.log('do this every 1 seconds');
		//console.log(now);
		if (gas > 0) {
			//maintain engine speed
			if (rpm > gas * maxRPM - 0.1) {
				rpm = gas * maxRPM - 0.11;
				timer -= 0.1;
			} else {
				timer += 0.1;
				calcRPM(timer);
			}
			//Shift up if RPM exceeds 5900
			if (rpm > 5.9) {
				rpm -= (4*tcoeffs[gear-1]);
				gear += 1;
				timer = gear-1;
				setGearPos();
			}
			//Shift down if RPM dips below 1500
			if (gear > 1 && timer > 5 && rpm < 1.5) {
				rpm += 1.5;
				gear -= 1;
				setGearPos();
			}
			console.log("gear "+gear);
			console.log("MPH "+speed);
			console.log("RPM "+rpm*1000);
			console.log("timer "+timer);
			//ROTATE THE RPM NEEDLE
			$("#needle-rpm").attr({
				"transform":"rotate("+ rpmScale(rpm) +" 100 100)"
			});
			$("#stroke-rpm").attr({
				"stroke-dashoffset": rpmStrokeScale(rpm)
			});
			//ROTATE THE MPH NEEDLE
			$("#needle-mph").attr({
				"transform":"rotate("+ mphScale(speed) +" 90 90)"
			});
			if (gear == 1) {
				$("#stroke-mph-1").attr({
					"stroke-dashoffset": mphStrokeScale01(speed)
				}); }
			if (gear == 2) {
			$("#stroke-mph-2").attr({
				"stroke-dashoffset": mphStrokeScale02(speed)
			}); }
			if (gear == 3) {
			$("#stroke-mph-3").attr({
				"stroke-dashoffset": mphStrokeScale03(speed)
			}); }
			if (gear == 4) {
			$("#stroke-mph-4").attr({
				"stroke-dashoffset": mphStrokeScale04(speed)
			}); }
			if (gear == 5) {
			$("#stroke-mph-5").attr({
				"stroke-dashoffset": mphStrokeScale05(speed)
			}); }
			$("#model-engine-speed").text(1000*rpm.toPrecision(4));
			$("#model-gear-ratio").text(tratios[gear-1]+":1");
			$("#model-road-speed").text((1000*rpm/tratios[gear-1]).toPrecision(4));
			$("#drive-wheel").attr({
				"style":"-webkit-animation: wheel-spin linear infinite; -webkit-animation-duration:"+(1000/rpm)+"ms; animation: wheel-spin linear infinite; animation-duration:"+(1000/rpm)+"ms;"
			});
		}
	}

	$(".slider").noUiSlider({
		start: 0,
		connect: "lower",
		range: {
			'min': 0,
			'max': 1
		}
	});

	var sliderVal = $(".slider").val();
	console.log(sliderVal);

	$(".slider").on({
		slide: function(){
			console.log("slide "+$(".slider").val());
			gas = $(".slider").val();
			$("#pedal-gas").attr({
				"transform":"translate(0,"+ ( 94 - 94 * $(".slider").val() ) +")"
			});
			setGearPos();
		},
		set: function(){
			console.log("set "+$(".slider").val());
			gas = $(".slider").val();
			setGearPos();
		},
		change: function(){
			console.log("change "+$(".slider").val());
			gas = $(".slider").val();
			setGearPos();
		}
	});





//END
})();

 