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

	// Store mouse coordonates (current, and absolute (relative to window))
	this.amouseAbsX = 0;
	this.amouseAbsY = 0;

	// Store selected element position
	this.selectionX = 0;
	this.selectionY = 0;
	this.selectionAlpha = 1.0;
	this.selectionAlphaStep = 0.01;
	this.selectionAlphaMin = 0.2;
	this.selectionAlphaMax = 1.0;
	this.selectionAlphaDirection = -1;

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

	this.projectOnScreen = function(xMap, yMap) {

		var distanceX = ( xMap + (scrollArea.x / scrollArea.scale.x) ) * scrollArea.scale.x;
		var distanceY = ( - yMap + (scrollArea.y / scrollArea.scale.y) ) * scrollArea.scale.y;

		return [distanceX, distanceY];

	}
}

function MouseWheelHandler(e) {

	if (mode == "map") {

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
	}

	return false;
}

function initSector(key) {

	sectors[key] = new PIXI.Graphics();
	sectors[key].beginFill(0x6666FF);
	sectors[key].lineStyle(1, 0x0000FF);
	sectors[key].fillAlpha = alphaSectorList[zoomIndex];
	sectors[key].drawRect(0, 0, 800, 400);
	stage.addChild(sectors[key]);

	sectorsName[key] = new PIXI.Text(key, {fill:"#FFFFFF", font:"bold 15px Arial"});
	sectorsName[key].anchor.x = 0.5;
	sectorsName[key].anchor.y = 0.5;
	sectorsName[key].alpha = alphaSectorNameList[zoomIndex];
	stage.addChild(sectorsName[key]);
}

function initPixi() {

	stage = new PIXI.Stage(0x000000);
    	renderer = PIXI.autoDetectRenderer($(window).width(), $(window).height(), {antialias: true});

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

	textures_groups = {};
	textures_groups["2"] = PIXI.Texture.fromImage("static/images/groups/2.png");
	textures_groups["3"] = PIXI.Texture.fromImage("static/images/groups/3.png");
	textures_groups["4"] = PIXI.Texture.fromImage("static/images/groups/4.png");
	textures_groups["5"] = PIXI.Texture.fromImage("static/images/groups/5.png");
	textures_groups["6"] = PIXI.Texture.fromImage("static/images/groups/6.png");
	textures_groups["7"] = PIXI.Texture.fromImage("static/images/groups/7.png");
	textures_groups["8"] = PIXI.Texture.fromImage("static/images/groups/8.png");
	textures_groups["9"] = PIXI.Texture.fromImage("static/images/groups/9.png");
	textures_groups["1X"] = PIXI.Texture.fromImage("static/images/groups/1X.png");
	textures_groups["2X"] = PIXI.Texture.fromImage("static/images/groups/2X.png");
	textures_groups["3X"] = PIXI.Texture.fromImage("static/images/groups/3X.png");
	textures_groups["4X"] = PIXI.Texture.fromImage("static/images/groups/4X.png");
	textures_groups["5X"] = PIXI.Texture.fromImage("static/images/groups/5X.png");
	textures_groups["6X"] = PIXI.Texture.fromImage("static/images/groups/6X.png");
	textures_groups["7X"] = PIXI.Texture.fromImage("static/images/groups/7X.png");
	textures_groups["8X"] = PIXI.Texture.fromImage("static/images/groups/8X.png");
	textures_groups["9X"] = PIXI.Texture.fromImage("static/images/groups/9X.png");
	textures_groups["1XX"] = PIXI.Texture.fromImage("static/images/groups/1XX.png");
	textures_groups["2XX"] = PIXI.Texture.fromImage("static/images/groups/2XX.png");
	textures_groups["3XX"] = PIXI.Texture.fromImage("static/images/groups/3XX.png");
	textures_groups["4XX"] = PIXI.Texture.fromImage("static/images/groups/4XX.png");

	stage.addChild(scrollArea);

	zoomIndex = 23;
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

	sectors = {};
	sectorsName = {};

	initSector("A0");
	initSector("A1");
	initSector("A2");
	initSector("A3");
	initSector("A4");
	initSector("A5");
	initSector("A6");
	initSector("A7");

	initSector("B0");
	initSector("B1");
	initSector("B2");
	initSector("B3");
	initSector("B4");
	initSector("B5");
	initSector("B6");
	initSector("B7");

	initSector("C0");
	initSector("C1");
	initSector("C2");
	initSector("C3");
	initSector("C4");
	initSector("C5");
	initSector("C6");
	initSector("C7");

	initSector("D0");
	initSector("D1");
	initSector("D2");
	initSector("D3");
	initSector("D4");
	initSector("D5");
	initSector("D6");
	initSector("D7");

	initSector("E0");
	initSector("E1");
	initSector("E2");
	initSector("E3");
	initSector("E4");
	initSector("E5");
	initSector("E6");
	initSector("E7");

	initSector("F0");
	initSector("F1");
	initSector("F2");
	initSector("F3");
	initSector("F4");
	initSector("F5");
	initSector("F6");
	initSector("F7");

	hitCircle = new PIXI.Graphics();
}

function bindMap() {

	for (i = 0; i < map.backgrounds.length; i++) {
		scrollArea.addChild(map.backgrounds[i].sprite);
	}

	for (i = 0; i < map.planets.length; i++) {
		if (map.planets[i].neighbors == 0) {
			scrollArea.addChild(map.planets[i].sprite);
		}
	}

	for (i = 0; i < map.vortex.length; i++) {
		if (map.vortex[i].neighbors == 0) {
			scrollArea.addChild(map.vortex[i].sprite);
		}
	}

	for (i = 0; i < map.ships.length; i++) {
		if (map.ships[i].neighbors == 0) {
			scrollArea.addChild(map.ships[i].sprite);
		}
	}

	for (i = 0; i < map.groups.length; i++) {
		scrollArea.addChild(map.groups[i].sprite);
	}

	scrollArea.addChild(hitCircle);
}

function setSectorPos(key, row, column) {

	sectors[key].clear();
	sectors[key].beginFill(0x0000FF);
	sectors[key].lineStyle(1, 0x0000FF);
	sectors[key].fillAlpha = alphaSectorList[zoomIndex];
	sectorsName[key].alpha = alphaSectorNameList[zoomIndex];

	// Sector and sector name positions computation
	origin = view.projectOnScreen(-319.5 + 80*column, 240.5 - 80*row);
	end = view.projectOnScreen(-239.5 + 80*column, 160.5 - 80*row);
	pos = view.projectOnScreen(-279.5 + 80*column, 200.5 - 80*row);

	// If mouse is on sector, don't make it blue
	if (view.amouseAbsX >= origin[0] && view.amouseAbsX <= end[0]) {
		if (view.amouseAbsY >= origin[1] && view.amouseAbsY <= end[1]) {
			sectors[key].fillAlpha = 0;
			sectorsName[key].alpha = 0;
		}
	}

	sectorsName[key].position.x = pos[0];
	sectorsName[key].position.y = pos[1];
	sectors[key].drawRect(origin[0], origin[1], end[0] - origin[0], end[1] - origin[1]);
}

function animate() {
	 
	requestAnimFrame( animate );

	for (i = 0; i < map.vortex.length; i++) {
		map.vortex[i].anim();
	}

	setSectorPos("A0", 0, 0);
	setSectorPos("A1", 0, 1);
	setSectorPos("A2", 0, 2);
	setSectorPos("A3", 0, 3);
	setSectorPos("A4", 0, 4);
	setSectorPos("A5", 0, 5);
	setSectorPos("A6", 0, 6);
	setSectorPos("A7", 0, 7);

	setSectorPos("B0", 1, 0);
	setSectorPos("B1", 1, 1);
	setSectorPos("B2", 1, 2);
	setSectorPos("B3", 1, 3);
	setSectorPos("B4", 1, 4);
	setSectorPos("B5", 1, 5);
	setSectorPos("B6", 1, 6);
	setSectorPos("B7", 1, 7);

	setSectorPos("C0", 2, 0);
	setSectorPos("C1", 2, 1);
	setSectorPos("C2", 2, 2);
	setSectorPos("C3", 2, 3);
	setSectorPos("C4", 2, 4);
	setSectorPos("C5", 2, 5);
	setSectorPos("C6", 2, 6);
	setSectorPos("C7", 2, 7);

	setSectorPos("D0", 3, 0);
	setSectorPos("D1", 3, 1);
	setSectorPos("D2", 3, 2);
	setSectorPos("D3", 3, 3);
	setSectorPos("D4", 3, 4);
	setSectorPos("D5", 3, 5);
	setSectorPos("D6", 3, 6);
	setSectorPos("D7", 3, 7);

	setSectorPos("E0", 4, 0);
	setSectorPos("E1", 4, 1);
	setSectorPos("E2", 4, 2);
	setSectorPos("E3", 4, 3);
	setSectorPos("E4", 4, 4);
	setSectorPos("E5", 4, 5);
	setSectorPos("E6", 4, 6);
	setSectorPos("E7", 4, 7);

	setSectorPos("F0", 5, 0);
	setSectorPos("F1", 5, 1);
	setSectorPos("F2", 5, 2);
	setSectorPos("F3", 5, 3);
	setSectorPos("F4", 5, 4);
	setSectorPos("F5", 5, 5);
	setSectorPos("F6", 5, 6);
	setSectorPos("F7", 5, 7);

	// Draw "hit circle"
	view.selectionAlpha += view.selectionAlphaDirection * view.selectionAlphaStep;
	if (view.selectionAlpha < view.selectionAlphaMin || view.selectionAlpha > view.selectionAlphaMax) {
		view.selectionAlphaDirection *= -1;
	}

	hitCircle.clear();
	hitCircle.lineStyle(0.04, 0xFF9933, view.selectionAlpha);
	hitCircle.fillAlpha = 0;
	hitCircle.drawCircle(view.selectionX - 0.5, view.selectionY - 0.5, 0.8);

	renderer.render(stage);
}

