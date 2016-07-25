/**
 * Titulo: Crear un slider desde 0
 * Categoria: Tutorial, Diseño web, Javascript
 * Blog: http://creaticode.com/blog/
 */
$(function() {
	var SliderModule = (function() {
		var pb = {};
		pb.el = $('#slider');
		pb.items = {
			panel: pb.el.find('li')
		}

		// Variables Necesarias
		var SliderInterval,
			currentSlider = 0,
			nextSlider = 1,
			lengthSlider = pb.items.panel.length;

		// Initialize
		pb.init = function(settings) {
			this.settings = settings || {duration: 8000} 
			var output = '';

			// Activamos nuestro slider
			SliderInit();

			for(var i = 0; i < lengthSlider; i++) {
				if (i == 0) {
					output += '<li class="active"></li>'; 
				} else {
					output += '<li></li>';
				}
			}

			// Controles del Slider
			$('#slider-controls').html(output).on('click', 'li', function (e){
				var $this = $(this);
				if (currentSlider !== $this.index()) {
					changePanel($this.index());
				};
			});
		}

		var SliderInit = function() {
			SliderInterval = setInterval(pb.startSlider, pb.settings.duration);
		}

		pb.startSlider = function() {
			var panels = pb.items.panel,
				controls = $('#slider-controls li');

			if (nextSlider >= lengthSlider) {
				nextSlider = 0;
				currentSlider = lengthSlider-1;
			}

			// Efectos
			controls.removeClass('active').eq(nextSlider).addClass('active');
			panels.eq(currentSlider).fadeOut(1000);
			panels.eq(nextSlider).fadeIn(1000);

			// Actualizamos nuestros datos
			currentSlider = nextSlider;
			nextSlider += 1; 
		}

		// Funcion para controles del slider
		var changePanel = function(id) {
			clearInterval(SliderInterval);
			var panels = pb.items.panel,
				controls = $('#slider-controls li');

			// Comprobamos el ID
			if (id >= lengthSlider) {
				id = 0;
			} else if (id < 0) {
				id = lengthSlider-1;
			}

			// Efectos
			controls.removeClass('active').eq(id).addClass('active');
			panels.eq(currentSlider).fadeOut(1000);
			panels.eq(id).fadeIn(1000);

			// Actualizamos nuestros datos
			currentSlider = id;
			nextSlider = id+1;

			// Reactivamos el slider
			SliderInit();
		}


		return pb;
	}());
	SliderModule.init({duration: 4000});
});

