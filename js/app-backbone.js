(function() {
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

	console.log("app js is loading")

	var now = new Date();
	var startTime = now.getTime();
	console.log(startTime);


	setInterval(dothis, 15000);
	
	function dothis() {
		now = Date();
		console.log('do this every 5 seconds');
		console.log(now);
	}
	

	var running = true;
	/*while(running == true){
	};*/


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
			console.log($(".slider").val());
		},
		set: function(){
			console.log($(".slider").val());
		},
		change: function(){
			console.log($(".slider").val());
		}
	});


})();

 