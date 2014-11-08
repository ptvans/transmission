var contextClass = (window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext);

var messageDisplayed = false;

if (contextClass) {
  // Web Audio API is available.
  var context = new contextClass();
	var gainValue = 0.1;
	var gainNode = context.createGain ? context.createGain() : context.createGainNode();
	var oscillator;
} else {
	$(".beginTuning").click(function(e){
		e.stopImmediatePropagation();
		ga('send', 'event', 'Error caught', "No context available");
		if (!messageDisplayed){
			$("#generator").css("padding-top",'0').prepend("<p style='padding:20px;font-size:0.8em;'>Sorry, it looks like your browser is not compatible with this particular feature. If possible, please try again with the latest version of Chrome, Safari or Firefox.</p>");
			$(this).parents(".tuningTable").before("<p style='padding:20px;font-size:0.8em;'>Sorry, it looks like your browser is not compatible with the tone generator. If possible, please try again with the latest version of Chrome, Safari or Firefox.</p>");
			messageDisplayed = true;
		}
	});
}

var oscs = {sine:0, square:1, sawtooth:2, triangle:3 };

	var oscOn = function(freq){

		oscillator = context.createOscillator();

		oscillator.type = 0;
		oscillator.frequency.value = freq;

		oscillator.connect(gainNode);
		gainNode.connect(context.destination);
		gainNode.gain.value = $(".volume-slider").length ? volume($(".volume-slider").val())/2 : gainValue;


		// if ($("input[name='waveform']:checked").length){

		// 	if (oscillator.type === parseInt(oscillator.type)){
		// 		oscillator.type = oscs[$("input[name='waveform']:checked").val()];
		// 	} else {
		// 		oscillator.type = $("input[name='waveform']:checked").val();
		// 	}
		// } else {
		// 	if (oscillator.type === parseInt(oscillator.type)){
		// 		oscillator.type = 0;
		// 	} else {
		// 		oscillator.type = "sine";
		// 	}
		// }
		oscillator.start ? oscillator.start(0) : oscillator.noteOn(0)
		// oscillator.start(0);
	};

	function start(freq) {
		if (typeof oscillator != 'undefined') oscillator.disconnect();
		oscOn(freq);
		$(".beginTuning").addClass("active");
	}

	function startTuning(freq) {
		if (typeof oscillator != 'undefined') oscillator.disconnect();
		oscOn(freq);
		$("#generator .beginTuning").addClass("active");
	}

	function stop() {
		oscillator.disconnect();
		$("#generator .beginTuning").removeClass("active");
	}



	function validate(n){
		if (isNumber(n) && n > 0 && n < 20001){
			return true;
		}
	}
	function isNumber(n){
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function onSlide(){
		// console.log($(".volume-slider").val());
		gainNode.gain.value = volume($(".volume-slider").val())/2;
		// console.log(volume($(".volume-slider").val())/2);
	};


	if ($(".volume-slider").length){
		$(".volume-slider").noUiSlider({
			start: 50,
			// slide: onSlide,
			range: {
				'min': 0,
				'max': 100
			},
		});

		$('.volume-slider').on('slide', function(){
			onSlide();
		});

		$(".volume-slider").on("change", function(){
			ga('send', 'event', 'Volume Change', "Slider", $(this).val());
		})
	}


	function logSlider(position){
		var minP = 0;
		var maxP = 100;

		var minV = Math.log(0.0001);
		var maxV = Math.log(0.5);

		var scale = (maxV - minV) / (maxP - minP);

		return Math.pow(1.032, minV + scale*(position-minP));


	}

	function volume(position){
		// if (position > 50){
			return Math.pow(position,2) / 10000;
		// } else {
			// return position /100 ;
		// }
	}


	$("document").ready(function() {

		// $(".volume-wrapper input").mousedown(function(e){
		// 	// e.preventDefault();
		// 	console.log("change");
		// 	gainNode.gain.value = $(this).val() *2 / 1000;
		// });

		$(".waveform-wrapper").click(function(e){
			e.preventDefault();
			$(this).children("input").click();
		});


		$("input[name='waveform']").click(function(e){
			e.stopPropagation();
			if (typeof oscillator != 'undefined'){
				if (oscillator.type === parseInt(oscillator.type)){
					oscillator.type = oscs[$(this).val()];
				} else {
					oscillator.type = $(this).val();
				}
			}
			ga('send', 'event', 'Waveform Changed', $(this).val());
		});

		$("#generator .beginTuning").click(function(e){
			if (validate($("#freq").val())){

				start(parseFloat(document.getElementById("freq").value));
				var freq = $("#freq").val();
				var dataString = 'freq=' + freq + '&mode=javascript';
				ga('send', 'event', 'Tone Generated', "Web Audio", $("#freq").val());

			} else {
				alert("Sorry, you entered an invalid number. Please enter a number between 1 and 20000 and try again.");
			}
		});

	    $("#generator .downloadButton").click(function(e){
			e.preventDefault();
			var freq = $("#freq").val(); //Validate this!
			if (validate(freq)){

				timedHide();
				var dataString = 'freq=' + freq + '&mode=php';
				ga('send', 'event', 'Tone Generated', "PHP", $("#freq").val());

				$('#spinner').fadeIn('fast');
				$("#generatorForm").submit();


			} else {
				alert("Sorry, you entered an invalid number. Please enter a number between 1 and 20000 and try again.");
				return false;
			}
		});
	});

function timedHide()
{
var t=setTimeout("$('#spinner').fadeOut('fast')",8500);

}