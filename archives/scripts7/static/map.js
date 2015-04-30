var w = window,
d = document,
e = d.documentElement,
g = d.body,
x = w.innerWidth || e.clientWidth || g.clientWidth,
y = w.innerHeight|| e.clientHeight|| g.clientHeight;
			
// Stage (backgroundColor, animate)
var stage = new PIXI.Stage(0xffffff,true);
// autoDetectRenderer (width, height, view, transparent)
var renderer = PIXI.autoDetectRenderer(x-259,y);
document.body.appendChild(renderer.view);
requestAnimFrame(animate);	
var scrollArea = new PIXI.DisplayObjectContainer();
			
scrollArea.interactive = true;
scrollArea.buttonMode = true;

var texture1 = PIXI.Texture.fromImage("static/images/planete_terre.png");
var texture2 = PIXI.Texture.fromImage("static/images/planete_bleue.png");
var texture3 = PIXI.Texture.fromImage("static/images/planete_jupiter.png");
var texture4 = PIXI.Texture.fromImage("static/images/planete_poele.png");
var texture5 = PIXI.Texture.fromImage("static/images/planete_venus.png");

terre1 = createPlanete(0, 50, 50, "Aldebaran", "Charles Le Chaleureux", "/images/planetes/16.gif");
terre2 = createPlanete(1, 250, 400, "Bételgeuse", "Startbutt", "/images/planetes/13.gif");
terre3 = createPlanete(2, 420, 280, "Antares", "Vaelin Al Sorna", "/images/planetes/25.gif");
terre4 = createPlanete(3, 580, 150, "Orion", "Yvan", "/images/planetes/1.gif");
scrollArea.addChild(terre1);
scrollArea.addChild(terre2);
scrollArea.addChild(terre3);
scrollArea.addChild(terre4);
		
stage.addChild(scrollArea);
		
function animate()
{
	requestAnimFrame(animate);
	terre1.anim();
	terre2.anim();
	terre3.anim();
	terre4.anim();
	renderer.render(stage);
}
	
function createPlanete(id, x, y, name, owner, image)
{
	var planete;
	if (image == "/images/planetes/16.gif") {
		planete = new PIXI.Sprite(texture2);
		planete.scale.x = 0.1;
		planete.scale.y = 0.1;
	}
	else if (image == "/images/planetes/13.gif") {
		planete = new PIXI.Sprite(texture3);
		planete.scale.x = 0.13;
		planete.scale.y = 0.13;
	}
	else if (image == "/images/planetes/25.gif") {
		planete = new PIXI.Sprite(texture4);
		planete.scale.x = 0.3;
		planete.scale.y = 0.3;
	}
	else if (image == "/images/planetes/1.gif") {
		planete = new PIXI.Sprite(texture5);
		planete.scale.x = 0.15;
		planete.scale.y = 0.15;
	}
	else {
		planete = new PIXI.Sprite(texture1);
		planete.scale.x = 1;
		planete.scale.y = 1;
	}

	planete.anchor.x = 0.5;
	planete.anchor.y = 0.5;
	planete.position.x = x;
	planete.position.y = y;
	planete.interactive = true;
	planete.buttonMode = true;
	planete.name = name;
	planete.owner = owner;
	planete.id = id;
	planete.image = image;
	planete.rotationValue = (Math.random() - 0.5)/50

	planete.mousedown = function(data) {
		alert(planete.name + " de " + planete.owner);
	}

	planete.anim = function() {
		planete.rotation += planete.rotationValue;
	}

	return planete;
}

window.onload = function() {

	initAutoComplete(document.getElementById('form-connexion'),document.getElementById('player'),document.getElementById('input-connexion'));

	if (document.addEventListener) {
		document.addEventListener("mousewheel", MouseWheelHandler, false);
		document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	}
	else document.attachEvent("onmousewheel", MouseWheelHandler);
	
	function MouseWheelHandler(e) {

		var e = window.event || e;
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		scrollArea.scale.x += delta*0.25;
		scrollArea.scale.y += delta*0.25;

		if (scrollArea.scale.x < 0.25) {
			scrollArea.scale.x = 0.25;
			scrollArea.scale.y = 0.25;
		}
		else if (scrollArea.scale.x > 3) {
			scrollArea.scale.x = 3;
			scrollArea.scale.y = 3;
		}

		return false;
	}

}
