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

		//alert ( "old scroll origin : " + scrollArea.x + "/" + scrollArea.y + " --- mouse position : " + x + "/" + y + " --- zoom : " + scrollArea.scale.x  + " --- new scroll origin : " + nposx + "/" + nposy);

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

		scrollArea.scale.x = zoomList[zoomIndex];
		scrollArea.scale.y = zoomList[zoomIndex];

		view.center(-276,179);

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
    	// create a new Sprite using the texture
    	var bunny = new PIXI.Sprite(texture_planete);
	bunny.scale.x = 0.0012;
	bunny.scale.y = 0.0012;
 
    	// center the sprites anchor point
    	bunny.anchor.x = 0.5;
    	bunny.anchor.y = 0.5;
 
    	// move the sprite t the center of the screen
    	bunny.position.x = 200;
    	bunny.position.y = 150;

	bunny.mousedown = function(data) { alert("badibou"); }
	bunny.interactive = true;
	bunny.buttonMode = true;
 
    	scrollArea.addChild(bunny);

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
	var background = new PIXI.Sprite(texture_background);
	background.position.x = 0;
	background.position.y = 0;
	background.scale.x = 1000;
	background.scale.y = 1000;
	background.interactive = true;
	background.buttonMode = true;
	background.mousdown = function(data) {
		alert("background...");
	}

	scrollArea.addChild(background);

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
	// render the stage   
	renderer.render(stage);
}


