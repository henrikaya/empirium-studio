function View() {

	this.mode = 0;

	this.scenterX = 0;
	this.scenterY = 0;
	this.acenterX = 0;
	this.acenterY = 0;
	this.smouseX = 0;
	this.smouseY = 0;
	this.amouseX = 0;
	this.amouseY = 0;

	this.center = function(x,y) {

		this.acenterX = x;
		this.acenterY = y;

		var nposx = renderer.width/2 - x*scrollArea.scale.x;
		var nposy = renderer.height/2 - y*scrollArea.scale.y;

		scrollArea.x = nposx;
		scrollArea.y = nposy;
	}

}

function MouseWheelHandler(e) {

		var e = window.event || e;
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

		if (delta == 1) {
			zoomIndex += 1;
			if (zoomIndex >= zoomList.length) {
				zoomIndex = zoomList.length - 1;
			}
		}
		else {
			zoomIndex -= 1;
			if (zoomIndex < 0) {
				zoomIndex = 0;
			}
		}

		var centerX = view.acenterX;
		var centerY = view.acenterY;

		scrollArea.scale.x = zoomList[zoomIndex];
		scrollArea.scale.y = zoomList[zoomIndex];

		view.center(centerX, centerY);

		return false;
}

function initPixi() {
	
	stage = new PIXI.Stage(0x000000);
 	renderer = PIXI.autoDetectRenderer($(window).width(), $(window).height());

	// add the renderer view element to the DOM
	var x = document.getElementById("map"); 
	x.appendChild(renderer.view);
	 
	requestAnimFrame( animate );
	 
	scrollArea = new PIXI.DisplayObjectContainer();
			
	scrollArea.interactive = true;
	scrollArea.buttonMode = true;

	texture_planete = PIXI.Texture.fromImage("static/images/planete_bleue.png");

	stage.addChild(scrollArea);

	zoomIndex = 3;
	scrollArea.scale.x = zoomList[zoomIndex];
	scrollArea.scale.y = zoomList[zoomIndex];

	if (document.addEventListener) {
		document.addEventListener("mousewheel", MouseWheelHandler, false);
		document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	}
	else document.attachEvent("onmousewheel", MouseWheelHandler);
 
	texture_background = PIXI.Texture.fromImage("static/images/background.png");

	view = new View();
	view.center(-276,179);

}

function bindMap() {

	for (i = 0; i < map.backgrounds.length; i++) {
		scrollArea.addChild(map.backgrounds[i].sprite);
	}

	for (i = 0; i < map.planets.length; i++) {
		scrollArea.addChild(map.planets[i].sprite);
	}

}

function animate() {
	 
	requestAnimFrame( animate );
	renderer.render(stage);
}


