function cleanModels() {

	$('#description-section4-content').remove();
	$('#description-section4-container').append("<div id='description-section4-content'></div>");
}

function addOwner(name, id) {

	$('#description-section4-content').append("<div id='description-section4-owner-" + id + "' class='description-section4-owner'></div>");
	$('#description-section4-owner-' + id).append("<center><img id='description-section4-img-owner-" + id + "' class='description-section4-img-owner'/></center>");
	$('#description-section4-img-owner-' + id).attr("src","static/images/players/" + id + ".jpg");
	$('#description-section4-owner-' + id).append("<p class='description-section4-owner-name'>" + name + "</p>");

}

function addModel(model, quantity, image) {

	model_div = model;
	model_div = model_div.split(" ").join("");
	model_div = model_div.split("'").join("");
	model_div = model_div.split("(").join("");
	model_div = model_div.split(")").join("");

	$('#description-section4-content').append("<div id='description-section4-" + model_div + "' class='description-section4-line'></div>");
	$('#description-section4-content').append("<div style='clear:both;'></div>");
	$('#description-section4-' + model_div).append("<img id='description-section4-img-" + model_div + "' class='description-section4-img'/>");

	var path = "static/images/ship.png"
	if (image in textures) {
		path = "static/images/ships/" + image;
	}
	if (model == "Planete") {
		path = "static/images/planete_bleue.png";
	}
	$('#description-section4-img-' + model_div).attr("src", path);

	$('#description-section4-' + model_div).append("<p id='description-section4-model-" + model_div + "' class='description-section4-model'></p>");
	$('#description-section4-' + model_div).append("<p id='description-section4-quantity-" + model_div + "' class='description-section4-quantity'></p>");
	$('#description-section4-model-' + model_div).text(model);
	$('#description-section4-quantity-' + model_div).text(quantity);
}

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

function Planet(_id, from, id, image, name, owner, owner_id, type, x, y, neighbors) {

    	this._id = _id;
	this.from = from;
	this.id = id;
	this.image = image;
	this.name = name;
	this.owner = owner;
	this.owner_id = owner_id;
	this.type = type;
	this.x = x;
	this.y = y;
	this.neighbors = parseInt(neighbors);

	var mysprite = new PIXI.Sprite(texture_planete);

	this.toString = function() {
		ret = "Planète " + this.id + " - " + this.name + "\n";
		ret += "MongoDB ID : " + this._id + "\n";
		ret += "Propriétaire : " + this.owner_id + "\n";
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

		if (name != '' && name != "\n") {
			$('#description-title').text(name);
		}
		else {
			$('#description-title').text("<Sans nom>");
		}
		$('#description-subtitle').text("Planète " + id);
		$('#description-subtitle').show();
		$('#title-description-section1').text("Coordonnées :");
		$('#title-description-section1').show();
		$('#description-section1').text(x + " / " + y);
		$('#description-section1').show();
		$('#title-description-section3').text("Propriétaire :");
		$('#title-description-section3').show();
		$('#description-section3').text(owner);
		$('#description-section3').show();
		$('#description-section3-image').attr("src", "static/images/players/" + owner_id + ".jpg");
		$('#title-description-section2').hide();
		$('#description-section2').hide();
		$('#description-section2-image').hide();
		$('#description-image').attr("src","static/images/planete_bleue.png");
		$('#description-image').show();
		$('#description-section3-image').show();
		cleanModels();
		$('#description').show();

		//TODO: replace these 10 lines by a call to initPositions()
		var posDescription = $('#description').offset();
		posDescription.top = $('#nav').height() + 20;
		posDescription.left = $(window).width() - $('#description').width() - 20;
		$('#description').offset(posDescription);
		$('#description').height($(window).height() - $('#nav').height() - 40);

		// Defines "hit circle"
		view.selectionX = this.position.x;
		view.selectionY = this.position.y;
	}
	mysprite.interactive = true;
	mysprite.buttonMode = true;

	this.sprite = mysprite;
}

function Ship(_id, from, id, image, name, owner, owner_id, type, model, x, y, neighbors) {

    	this._id = _id;
	this.from = from;
	this.id = id;
	this.name = name;
	this.image = "";
	this.owner = owner;
	this.owner_id = owner_id;
	this.type = type;
	this.model = model;
	this.x = x;
	this.y = y;
	this.neighbors = parseInt(neighbors);

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
		$('#description-subtitle').show();
		$('#title-description-section1').text("Modèle :");
		$('#title-description-section1').show();
		$('#description-section1').text(model);
		$('#description-section1').show();
		$('#title-description-section2').text("Coordonnées :");
		$('#title-description-section2').show();
		$('#description-section2').text(x + " / " + y);
		$('#description-section2').show();
		$('#title-description-section2').show();
		$('#description-section2').show();
		$('#title-description-section3').text("Propriétaire :");
		$('#title-description-section3').show();
		$('#description-section3').text(owner);
		$('#description-section3').show();
		$('#description-section3-image').attr("src", "static/images/players/" + owner_id + ".jpg");
		$('#description-section3-image').show();
		cleanModels();

		if (image in textures) {
			path = "static/images/ships/" + image;
			$('#description-image').attr("src",path);
			$('#description-image').show();
		}
		else {
			$('#description-image').attr("src","static/images/ship.png");
			$('#description-image').show();
		}

		$('#description').show();

		//TODO: replace these 10 lines by a call to initPositions()
		var posDescription = $('#description').offset();
		posDescription.top = $('#nav').height() + 20;
		posDescription.left = $(window).width() - $('#description').width() - 20;
		$('#description').offset(posDescription);
		$('#description').height($(window).height() - $('#nav').height() - 40);

		// Defines "hit circle"
		view.selectionX = this.position.x;
		view.selectionY = this.position.y;
	}
	mysprite.interactive = true;
	mysprite.buttonMode = true;

	this.sprite = mysprite;


}

function Vortex(_id, from, id, type, destination, x, y, neighbors) {

    	this._id = _id;
	this.from = from;
	this.id = id;
	this.type = type;
	this.destination = destination;
	this.x = x;
	this.y = y;
	this.neighbors = parseInt(neighbors);

	var mysprite = new PIXI.Sprite(texture_vortex);

	mysprite.anchor.x = 0.5;
	mysprite.anchor.y = 0.5;
	mysprite.scale.x = 0.0025;
	mysprite.scale.y = 0.0025;
	mysprite.position.x = x;
	mysprite.position.y = -y;
	mysprite.mousedown = mysprite.tap = function(data) {
		$('#description-title').text("Vortex " + id);
		$('#description-subtitle').text(destination);
		$('#title-description-section1').text("Coordonnées :");
		$('#description-section1').text(x + " / " + y);
		$('#title-description-section2').text("");
		$('#description-section2').text("");
		$('#title-description-section3').text("");
		$('#description-section3').text("");
		$('#description-section3-image').hide();
		$('#description-image').attr("src","static/images/vortex.png");
		$('#description-image').show();
		cleanModels();
		$('#description').show();

		//TODO: replace these lines by a call to initPositions()
		var posDescription = $('#description').offset();
		posDescription.top = $('#nav').height() + 20;
		posDescription.left = $(window).width() - $('#description').width() - 20;
		$('#description').offset(posDescription);
		$('#description').height($(window).height() - $('#nav').height() - 40);

		// Defines "hit circle"
		view.selectionX = this.position.x;
		view.selectionY = this.position.y;
	}
	mysprite.interactive = true;
	mysprite.buttonMode = true;

	this.sprite = mysprite;

	this.anim = function() {
		this.sprite.rotation -= 0.01;
	}
}

function Group(from, x, y, quantity, composition) {

	this.from = from;
	this.quantity = quantity;
	this.x = x;
	this.y = y;

	var mysprite;
	if (quantity < 10) {
		mysprite = new PIXI.Sprite(textures_groups[quantity.toString()]);
	}
	else if (quantity < 20) {
		mysprite = new PIXI.Sprite(textures_groups["1X"]);
	}
	else if (quantity < 30) {
		mysprite = new PIXI.Sprite(textures_groups["2X"]);
	}
	else if (quantity < 40) {
		mysprite = new PIXI.Sprite(textures_groups["3X"]);
	}
	else if (quantity < 50) {
		mysprite = new PIXI.Sprite(textures_groups["4X"]);
	}
	else if (quantity < 60) {
		mysprite = new PIXI.Sprite(textures_groups["5X"]);
	}
	else if (quantity < 70) {
		mysprite = new PIXI.Sprite(textures_groups["6X"]);
	}
	else if (quantity < 80) {
		mysprite = new PIXI.Sprite(textures_groups["7X"]);
	}
	else if (quantity < 90) {
		mysprite = new PIXI.Sprite(textures_groups["8X"]);
	}
	else if (quantity < 100) {
		mysprite = new PIXI.Sprite(textures_groups["9X"]);
	}
	else if (quantity < 200) {
		mysprite = new PIXI.Sprite(textures_groups["1XX"]);
	}
	else if (quantity < 300) {
		mysprite = new PIXI.Sprite(textures_groups["2XX"]);
	}
	else if (quantity < 400) {
		mysprite = new PIXI.Sprite(textures_groups["3XX"]);
	}
	else {
		mysprite = new PIXI.Sprite(textures_groups["4XX"]);
	}

	mysprite.anchor.x = 0.5;
	mysprite.anchor.y = 0.5;
	mysprite.scale.x = 0.01;
	mysprite.scale.y = 0.01;
	mysprite.position.x = x;
	mysprite.position.y = -y;

	mysprite.mousedown = mysprite.tap = function(data) {

		$('#description-title').text(quantity + " éléments");
		$('#description-subtitle').text("Coordonnées : " + x + " / " + y);
		$('#title-description-section1').hide();
		$('#description-section1').hide();
		$('#title-description-section2').hide();
		$('#description-section2').hide();
		$('#title-description-section3').hide();
		$('#description-section3').hide();
		$('#description-section3-image').hide();
		$('#description-image').hide();
		$('#description').show();

		cleanModels();
		
		for (var i = 0, s = composition.length; i < s; i++) {
			el = composition[i];
			addOwner(el.name, el.id);
			for (var j = 0, t = el.elements.length; j < t; j++) {
				mod = el.elements[j];
				addModel(mod.model, mod.quantity, mod.image);
			}
			$('#description-section4-content').append("<center><div class='description-section4-border'></div></center>");
		}

		//TODO: replace these lines by a call to initPositions()
		var posDescription = $('#description').offset();
		posDescription.top = $('#nav').height() + 20;
		posDescription.left = $(window).width() - $('#description').width() - 20;
		$('#description').offset(posDescription);
		$('#description').height($(window).height() - $('#nav').height() - 40);

		// Defines "hit circle"
		view.selectionX = this.position.x;
		view.selectionY = this.position.y;
	}

	mysprite.interactive = true;
	mysprite.buttonMode = true;

	this.sprite = mysprite;
}

function Map() {

	this.planets = [];
	this.ships = [];
	this.vortex = [];
	this.groups = [];
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
		else if (elmt instanceof Group) {
			this.groups.push(elmt);
		}
		else if (elmt instanceof Background) {
			this.backgrounds.push(elmt);
		}
	}

	this.clear = function() {
		while (this.planets.length) { this.planets.pop(); }
		while (this.ships.length) { this.ships.pop(); }
		while (this.vortex.length) { this.vortex.pop(); }
		while (this.groups.length) { this.groups.pop(); }
		while (this.backgrounds.length) { this.backgrounds.pop(); }
	}

	this.toString = function() {
		ret = "Nombre de planètes : " + this.planets.length + "\n";
		ret += "Nombre de vaisseaux : " + this.ships.length + "\n";
		ret += "Nombre de vortex : " + this.vortex.length + "\n";
		ret += "Nombre de groupes : " + this.groups.length + "\n";
		return ret;
	}

}
