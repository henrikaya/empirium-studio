function Background(x, y) {

	this.x = x;
	this.y = y;

	var mysprite = new PIXI.Sprite(texture_background);

	mysprite.scale.x = x;
	mysprite.scale.y = y;
	mysprite.position.x = -x*9/2;
	mysprite.position.y = -y*9/2;
	mysprite.interactive = true;
	mysprite.buttonMode = false;

	mysprite.mousedown = mysprite.touchstart = function(data) {

    		var pos = data.getLocalPosition(mysprite.parent.parent);
		view.mode = 1;
		view.smouseX = Math.round(pos.x);
		view.smouseY = Math.round(pos.y);
		view.scenterX = view.acenterX;
		view.scenterY = view.acenterY;
	}

	mysprite.mousemove = mysprite.touchmove = function(data) {

		var pos = data.getLocalPosition(mysprite.parent.parent);
		var posMap = data.getLocalPosition(mysprite.parent);

		view.amouseAbsX = pos.x;
		view.amouseAbsY = pos.y
		view.amouseX = posMap.x;
		view.amouseY = posMap.y;

    		if (view.mode == 1) {

			var pos = data.getLocalPosition(mysprite.parent.parent);
			var deltaX = view.smouseX - Math.round(pos.x);
			var deltaY = view.smouseY - Math.round(pos.y);

			centerX = view.scenterX + deltaX / scrollArea.scale.x;
			centerY = view.scenterY + deltaY / scrollArea.scale.y;

			// If needed we move window
			if (deltaX != 0 || deltaY != 0) {
				view.center(centerX, centerY);
				view.smouseX = Math.round(pos.x);
				view.smouseY = Math.round(pos.y);
				view.scenterX = view.acenterX;
				view.scenterY = view.acenterY;
			}
		}
	}

	mysprite.mouseup = mysprite.mouseupoutside = function(data) { view.mode = 0; }

	this.sprite = mysprite;

}

function Planet(_id, from, id, image, name, owner, type, x, y) {

    	this._id = _id;
	this.from = from;
	this.id = id;
	this.image = image;
	this.name = name;
	this.owner = owner;
	this.type = type;
	this.x = x;
	this.y = y;

	var mysprite = new PIXI.Sprite(texture_planete);

	this.toString = function() {
		ret = "Planète " + this.id + " - " + this.name + "\n";
		ret += "MongoDB ID : " + this._id + "\n";
		ret += "Propriétaire : " + this.owner + "\n";
		ret += "Position : " + this.x + "/" + this.y;

		return ret;
	}

	mysprite.anchor.x = 0.5;
	mysprite.anchor.y = 0.5;
	mysprite.scale.x = 0.0011;
	mysprite.scale.y = 0.0011;
	mysprite.position.x = x;
	mysprite.position.y = -y;
	mysprite.mousedown = mysprite.tap = function(data) {

		console.log(window.event);
		if (name != '' && name != "\n") {
			$('#description-title').text(name);
		}
		else {
			$('#description-title').text("<Sans nom>");
		}
		$('#description-subtitle').text("Planète " + id);
		$('#description-section1').text("Localisation : " + x + "/" + y);
		$('#description-section2').text("Propriétaire : " + owner);
		$('#description-section3').text("");
		$('#description-image').attr("src","static/images/planete_bleue.png");
		$('#description').show();

		//TODO: replace these 10 lines by a call to initPositions()
		var posDescription = $('#description').offset();
		posDescription.top = $('#nav').height();
		posDescription.left = $(window).width() - $('#description').width() - 15;
		$('#description').offset(posDescription);
		$('#description').height($(window).height() - $('#nav').height());

		$('#description-close').height(25).width(25);
		var posDescClose = $('#description-close').offset();
		posDescClose.top = $('#nav').height() + 10;
		posDescClose.left = $(window).width() - $('#description-close').width() - 10;
		$('#description-close').offset(posDescClose);

	}
	mysprite.interactive = true;
	mysprite.buttonMode = true;

	this.sprite = mysprite;
}

function Ship(_id, from, id, image, name, owner, type, model, x, y) {

    	this._id = _id;
	this.from = from;
	this.id = id;
	this.name = name;
	this.image = "";
	this.owner = owner;
	this.type = type;
	this.model = model;
	this.x = x;
	this.y = y;

	array_images = image.split("/")

	if (array_images.length >= 4) {
		image = array_images[3];
	}

	this.image = image;

	var mysprite;
	if (this.image in textures) {
		mysprite = new PIXI.Sprite(textures[this.image]);
		mysprite.scale.x = 0.005;
		mysprite.scale.y = 0.005;
	}
	else {
		mysprite = new PIXI.Sprite(texture_ship);
		mysprite.scale.x = 0.0033;
		mysprite.scale.y = 0.0033;
	}

	this.toString = function() {
		ret = "Vaisseau " + this.id + " - " + this.name + "\n";
		ret += "MongoDB ID : " + this._id + "\n";
		ret += "Type : " + this.image + "\n";
		ret += "Propriétaire : " + this.owner + "\n";
		ret += "Position : " + this.x + "/" + this.y;
		return ret;
	}

	mysprite.anchor.x = 0.5;
	mysprite.anchor.y = 0.5;
	mysprite.position.x = x;
	mysprite.position.y = -y;
	mysprite.mousedown = mysprite.tap = function(data) {
		if (name != '' && name != "\n") {
			$('#description-title').text(name);
		}
		else {
			$('#description-title').text("<Sans nom>");
		}
		$('#description-subtitle').text("Vaisseau " + id);
		$('#description-section1').text(model);
		$('#description-section2').text("Localisation : " + x + "/" + y);
		$('#description-section3').text("Propriétaire : " + owner);

		if (image in textures) {
			path = "static/images/ships/" + image;
			$('#description-image').attr("src",path);
		}
		else {
			$('#description-image').attr("src","static/images/ship.png");
		}


		$('#description').show();

		//TODO: replace these 10 lines by a call to initPositions()
		var posDescription = $('#description').offset();
		posDescription.top = $('#nav').height();
		posDescription.left = $(window).width() - $('#description').width() - 15;
		$('#description').offset(posDescription);
		$('#description').height($(window).height() - $('#nav').height());

		$('#description-close').height(25).width(25);
		var posDescClose = $('#description-close').offset();
		posDescClose.top = $('#nav').height() + 10;
		posDescClose.left = $(window).width() - $('#description-close').width() - 10;
		$('#description-close').offset(posDescClose);

	}
	mysprite.interactive = true;
	mysprite.buttonMode = true;

	this.sprite = mysprite;


}

function Vortex(_id, from, id, type, destination, x, y) {

    	this._id = _id;
	this.from = from;
	this.id = id;
	this.type = type;
	this.destination = destination;
	this.x = x;
	this.y = y;

	var mysprite = new PIXI.Sprite(texture_vortex);

	this.toString = function() {
		ret = "Vortex " + this.id + " - " + this.name + "\n";
		ret += "MongoDB ID : " + this._id + "\n";
		ret += "Destination : " + this.destination + "\n";
		ret += "Position : " + this.x + "/" + this.y;

		return ret;
	}

	mysprite.anchor.x = 0.5;
	mysprite.anchor.y = 0.5;
	mysprite.scale.x = 0.0025;
	mysprite.scale.y = 0.0025;
	mysprite.position.x = x;
	mysprite.position.y = -y;
	mysprite.mousedown = mysprite.tap = function(data) {
		$('#description-title').text("Vortex " + id);
		$('#description-subtitle').text("Destination : " + destination);
		$('#description-section1').text("Localisation : " + x + "/" + y);
		$('#description-section2').text("");
		$('#description-section3').text("");
		$('#description-image').attr("src","static/images/vortex.png");
		$('#description').show();

		//TODO: replace these 10 lines by a call to initPositions()
		var posDescription = $('#description').offset();
		posDescription.top = $('#nav').height();
		posDescription.left = $(window).width() - $('#description').width() - 15;
		$('#description').offset(posDescription);
		$('#description').height($(window).height() - $('#nav').height());

		$('#description-close').height(25).width(25);
		var posDescClose = $('#description-close').offset();
		posDescClose.top = $('#nav').height() + 10;
		posDescClose.left = $(window).width() - $('#description-close').width() - 10;
		$('#description-close').offset(posDescClose);

	}
	mysprite.interactive = true;
	mysprite.buttonMode = true;

	this.sprite = mysprite;

	this.anim = function() {
		this.sprite.rotation -= 0.01;
	}
}

function Map() {

	this.planets = [];
	this.ships = [];
	this.vortex = [];
	this.backgrounds = [];

	this.add = function(elmt) {
		if (elmt instanceof Planet) {
			this.planets.push(elmt);
		}
		else if (elmt instanceof Ship) {
			this.ships.push(elmt);
		}
		else if (elmt instanceof Vortex) {
			this.vortex.push(elmt);
		}
		else if (elmt instanceof Background) {
			this.backgrounds.push(elmt);
		}
	}

	this.clear = function() {
		while (this.planets.length) { this.planets.pop(); }
		while (this.ships.length) { this.ships.pop(); }
		while (this.vortex.length) { this.vortex.pop(); }
		while (this.backgrounds.length) { this.backgrounds.pop(); }
	}

	this.toString = function() {
		ret = "Nombre de planètes : " + this.planets.length + "\n";
		ret += "Nombre de vaisseaux : " + this.ships.length + "\n";
		ret += "Nombre de vortex : " + this.vortex.length + "\n";
		return ret;
	}

}
