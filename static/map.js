function View() {

	this.mode = 0;

	// Store center coordonates (start and current)
	this.scenterX = 0;
	this.scenterY = 0;
	this.acenterX = 0;
	this.acenterY = 0;

	// Store mouse coordonates (start and current)
	this.smouseX = 0;
	this.smouseY = 0;
	this.amouseX = 0;
	this.amouseY = 0;

	// Sore mouse coordonates (current, and absolute (relative to window))
	this.amouseAbsX = 0;
	this.amouseAbsY = 0;

	// Center map on x,y
	this.center = function(x,y) {

		this.acenterX = x;
		this.acenterY = y;

		var nposx = renderer.width/2 - x*scrollArea.scale.x;
		var nposy = renderer.height/2 - y*scrollArea.scale.y;

		scrollArea.x = nposx;
		scrollArea.y = nposy;
	}

	// Bind a point (relative to map) to a position (relative to window)
	this.bindPoint = function(xMap, yMap, xAbs, yAbs) {
	
		var dX = (xAbs - $(window).width()/2) / scrollArea.scale.x;
		var dY = (yAbs - $(window).height()/2) / scrollArea.scale.y;

		this.center(xMap - dX, yMap - dY);
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
		var xMap = view.amouseX;
		var yMap = view.amouseY;
		var xAbs = view.amouseAbsX;
		var yAbs = view.amouseAbsY;

		scrollArea.scale.x = zoomList[zoomIndex];
		scrollArea.scale.y = zoomList[zoomIndex];

		view.bindPoint(xMap, yMap, xAbs, yAbs)

		return false;
}

function initPixi() {
	
	stage = new PIXI.Stage(0x000000);
 	renderer = PIXI.autoDetectRenderer($(window).width(), $(window).height());

	var x = document.getElementById("map"); 
	x.appendChild(renderer.view);
	 
	requestAnimFrame( animate );
	 
	scrollArea = new PIXI.DisplayObjectContainer();
			
	scrollArea.interactive = true;
	scrollArea.buttonMode = true;

	texture_planete = PIXI.Texture.fromImage("static/images/planete_bleue.png");
	texture_ship = PIXI.Texture.fromImage("static/images/ship.png");	
	texture_vortex = PIXI.Texture.fromImage("static/images/vortex.png");

	textures = {};
	textures["frg_1.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_1.gif");
	textures["frg_3.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_3.gif");
	textures["frg_4.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_4.gif");
	textures["frg_5.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_5.gif");
	textures["frg_6.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_6.gif");
	textures["frg_7.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_7.gif");
	textures["frg_8.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_8.gif");
	textures["frg_9.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_9.gif");
	textures["frg_10.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_10.gif");
	textures["frg_11.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_11.gif");
	textures["frg_12.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_12.gif");
	textures["frg_14.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_14.gif");
	textures["frg_15.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_15.gif");
	textures["frg_17.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_17.gif");
	textures["frg_18.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_18.gif");
	textures["frg_20.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_20.gif");
	textures["frg_21.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_21.gif");
	textures["frg_22.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_22.gif");
	textures["frg_23.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_23.gif");
	textures["frg_24.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_24.gif");
	textures["frg_25.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_25.gif");
	textures["frg_26.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_26.gif");
	textures["frg_27.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_27.gif");
	textures["frg_28.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_28.gif");
	textures["frg_29.gif"] = PIXI.Texture.fromImage("static/images/ships/frg_29.gif");

	stage.addChild(scrollArea);

	zoomIndex = 5;
	scrollArea.scale.x = zoomList[zoomIndex];
	scrollArea.scale.y = zoomList[zoomIndex];

	if (document.addEventListener) {
		document.addEventListener("mousewheel", MouseWheelHandler, false);
		document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	}
	else document.attachEvent("onmousewheel", MouseWheelHandler);
 
	texture_background = PIXI.Texture.fromImage("static/images/background.png");

	view = new View();
	view.center(0,0);
}

function bindMap() {

	for (i = 0; i < map.backgrounds.length; i++) {
		scrollArea.addChild(map.backgrounds[i].sprite);
	}

	for (i = 0; i < map.planets.length; i++) {
		scrollArea.addChild(map.planets[i].sprite);
	}

	for (i = 0; i < map.vortex.length; i++) {
		scrollArea.addChild(map.vortex[i].sprite);
	}

	for (i = 0; i < map.ships.length; i++) {
		scrollArea.addChild(map.ships[i].sprite);
	}

}

function animate() {
	 
	requestAnimFrame( animate );

	for (i = 0; i < map.vortex.length; i++) {
		map.vortex[i].anim();
	}

	renderer.render(stage);
}


