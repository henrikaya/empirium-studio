var stage;
var renderer;

function initPixi() {
	
	stage = new PIXI.Stage(0x66FF99);
 	renderer = PIXI.autoDetectRenderer($(window).width() - $('#icon-map').width(), $(window).height());

	// add the renderer view element to the DOM
	var x = document.getElementById("map"); 
	x.appendChild(renderer.view);
	 
	requestAnimFrame( animate );
	 
	var scrollArea = new PIXI.DisplayObjectContainer();
			
	scrollArea.interactive = true;
	scrollArea.buttonMode = true;
}

function animate() {
	 
	requestAnimFrame( animate );
	 
	// render the stage   
	renderer.render(stage);
}
