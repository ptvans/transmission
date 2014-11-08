(function() {
	

//LAYOUT SVG
$("#model-engine-speed").attr({
	"transform":"translate(100,250)"
});
$("#model-road-speed").attr({
	"transform":"translate(715,300)"
});
$("#model-gear-ratio").attr({
	"transform":"translate(400,-125)"
});

//SLIDERS
	$("#slider-gas").noUiSlider({
		start: 0,
		connect: "lower",
		range: {
			'min': 0,
			'max': 1
		}
	});

	$("#slider-shifts").noUiSlider({
		start: [1600,4000],
		connect: true,
		range: {
			'min': 1000,
			'max': 5900
		}
	});

	var lowerRPM = $("#slider-shifts").val()[0]/1000;
	var upperRPM = $("#slider-shifts").val()[1]/1000;

	$("#slider-shifts .noUi-handle.noUi-handle-lower").attr("data-content",(lowerRPM*1000).toFixed(0)+" rpm");
	$("#slider-shifts .noUi-handle.noUi-handle-upper").attr("data-content",(upperRPM*1000).toFixed(0)+" rpm");
		

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
	var rpmScaleDeg = d3.scale.linear()
	    .domain([0, maxRPM])
	    .range([360, 0]);


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
					"class":"01",
					"data-content":gear
				});
				gears.classed('active',false);
				gear01.classed('active',true);
				arcs.classed('active',false);
				arc01.classed('active',true);
				break;
			case 2:
				$("#gear-selector").attr({
					"style":"transform: translate(1px,52px)",
					"class":"02",
					"data-content":gear
				});
				gears.classed('active',false);
				gear02.classed('active',true);
				arcs.classed('active',false);
				arc02.classed('active',true);
				break;
			case 3:
				$("#gear-selector").attr({
					"style":"transform: translate(26px,1px)",
					"class":"03",
					"data-content":gear
				});
				gears.classed('active',false);
				gear03.classed('active',true);
				arcs.classed('active',false);
				arc03.classed('active',true);
				break;
			case 4:
				$("#gear-selector").attr({
					"style":"transform: translate(26px,52px)",
					"class":"04",
					"data-content":gear
				});
				gears.classed('active',false);
				gear04.classed('active',true);
				arcs.classed('active',false);
				arc04.classed('active',true);
				break;
			case 5:
				$("#gear-selector").attr({
					"style":"transform: translate(52px,1px)",
					"class":"05",
					"data-content":gear
				});
				gears.classed('active',false);
				gear05.classed('active',true);
				arcs.classed('active',false);
				arc05.classed('active',true);
				break;
			default:
				$("#gear-selector").attr({
					"style":"transform: translate(26px,26px)",
					"data-content":"N"
				});
				gears.classed('active',false);
		}
	}	

	// function animationEndCallback() {

	// 	var $driveWheel = $(this);

	// 	$driveWheel.removeClass("spinning");

	// 	//Next step: Update class
	// 	var duration = 500/rpm;
	// 	console.error("animationEndCallback()", "New RPM value", rpm, "duration", duration);



	// 	if(duration >= 0 ){

	// 		console.error("animationEndCallback()", "if: duration not zero!");

	// 		$driveWheel.attr({
	// 			"style":"-webkit-animation-duration:"+(duration)+"ms; animation-duration:"+(duration)+"ms;"
	// 		});

	// 		console.error("animationEndCallback()", "if: CSS element", $(this));


	// 		setTimeout(function(){
	// 			$driveWheel.addClass("spinning");
	// 		}, 1);
			

	// 	}
		


	// }

	// $("#drive-wheel").bind('oanimationend animationend webkitAnimationEnd', animationEndCallback);

	function depressClutch(){
		$("#pedal-clutch").attr({
			"class":"animate"
		});
	}

	//THE BIG LOOP THAT DOES ALL THE STUFF

	var intervalSpeed = 10;
	var timerValue = intervalSpeed/100;

	setInterval(dothis, intervalSpeed);


	var index = 0;
	
	function dothis() {
		//now = Date();
		//console.log('do this every 1 seconds');
		//console.log(now);
		if (gas > 0) {
			//maintain engine speed
			if (rpm > gas * maxRPM - 0.1) {
				rpm = gas * maxRPM - 0.11;
				timer -= timerValue;
			} else {
				timer += timerValue;
				calcRPM(timer);
			}
			//Shift up if RPM exceeds upper shift point
			if (rpm > upperRPM) {
				rpm -= (4*tcoeffs[gear-1]);
				gear += 1;
				timer = gear-1;
				setGearPos();
				depressClutch();
			}
			//Shift down if RPM dips below lower shift point
			if (gear > 1 && timer > 5 && rpm < lowerRPM) {
				rpm += 1.5;
				gear -= 1;
				timer = 1;
				setGearPos();
				depressClutch();
			}
			// console.log("gear "+gear);
			// console.log("MPH "+speed);
			// console.log("RPM "+rpm*1000);
			// console.log("timer "+timer);
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
			$("#model-engine-speed").text((1000*rpm).toFixed(0));
			$("#model-gear-ratio").text(tratios[gear-1]+":1");

			var roadSpeed = 1000*rpm/tratios[gear-1];
			$("#model-road-speed").text((roadSpeed).toFixed(0));

			updateDriveWheel(index, rpm, roadSpeed);
			// $("#drive-wheel").attr({
			// 	"style":"-webkit-animation: wheel-spin linear; -webkit-animation-duration:"+(1000/rpm)+"ms; animation: wheel-spin linear infinite; animation-duration:"+(1000/rpm)+"ms;"
			// });

			index++;
			
		}
	}


	$driveWheel = $("#drive-wheel")
		.css("transform", "rotate("+(360)+"deg)");


	function updateDriveWheel(index, rpm, roadSpeed){
		

		var speed = roadSpeed/90;
		var deg = 360-((index % 360)*speed);

		console.log("updateDriveWheel", "speed ", (index % 10)+1, speed);
		$driveWheel.css("transform", "rotate("+(deg)+"deg)");
		
		// if(index % 360){
		// 	$driveWheel.css("transform", "rotate("+(360-(index*speed))+"deg)");
				
		// }


		



	}

	$("#slider-gas").on({
		slide: function(){
			// console.log("slide "+$("#slider-gas").val());
			gas = $("#slider-gas").val();
			$("#pedal-gas").attr({
				"transform":"translate(0,"+ ( 94 - 94 * $("#slider-gas").val() ) +")"
			});
			$("#slider-gas .noUi-handle.noUi-handle-lower").attr("data-content",(gas*100).toFixed(0)+"%");
			setGearPos();


			//$("#drive-wheel").addClass("spinning");

		},
		set: function(){
			// console.log("set "+$("#slider-gas").val());
			gas = $("#slider-gas").val();
			setGearPos();
		},
		change: function(){
			// console.log("change "+$("#slider-gas").val());
			gas = $("#slider-gas").val();
			setGearPos();
		}
	});

	$("#slider-shifts").on({
		slide: function(){
			lowerRPM = $("#slider-shifts").val()[0]/1000;
			upperRPM = $("#slider-shifts").val()[1]/1000;
			$("#slider-shifts .noUi-handle.noUi-handle-lower").attr("data-content",(lowerRPM*1000).toFixed(0)+" rpm");
			$("#slider-shifts .noUi-handle.noUi-handle-upper").attr("data-content",(upperRPM*1000).toFixed(0)+" rpm");
		},
		set: function(){
			lowerRPM = $("#slider-shifts").val()[0]/1000;
			upperRPM = $("#slider-shifts").val()[1]/1000;
		},
		change: function(){
			lowerRPM = $("#slider-shifts").val()[0]/1000;
			upperRPM = $("#slider-shifts").val()[1]/1000;
		}
	});



//END
})();

 