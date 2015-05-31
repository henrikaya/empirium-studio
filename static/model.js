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

	mysprite.mousedown = function(data) {

    		var pos = data.getLocalPosition(mysprite.parent.parent);
		view.mode = 1;
		view.smouseX = Math.round(pos.x);
		view.smouseY = Math.round(pos.y);
		view.scenterX = view.acenterX;
		view.scenterY = view.acenterY;
	}

	mysprite.mousemove = function(data) {

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

	mysprite.mouseup = function(data) { view.mode = 0; }

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

	mysprite.scale.x = 0.0012;
	mysprite.scale.y = 0.0012;
	mysprite.position.x = x;
	mysprite.position.y = -y;
	mysprite.mousedown = function(data) {
		ret = "Planète " + id + " - " + name + "\n";
		ret += "MongoDB ID : " + _id + "\n";
		ret += "Propriétaire : " + owner + "\n";
		ret += "Position : " + x + "/" + y;
		alert(ret);
	}
	mysprite.interactive = true;
	mysprite.buttonMode = true;

	this.sprite = mysprite;
}

function Ship(_id, from, id, image, name, owner, type, x, y) {

    	this._id = _id;
	this.from = from;
	this.id = id;
	this.image = image;
	this.name = name;
	this.owner = owner;
	this.type = type;
	this.x = x;
	this.y = y;

	var mysprite = new PIXI.Sprite(texture_ship);

	this.toString = function() {
		ret = "Vaisseau " + this.id + " - " + this.name + "\n";
		ret += "MongoDB ID : " + this._id + "\n";
		ret += "Type : " + this.image + "\n";
		ret += "Propriétaire : " + this.owner + "\n";
		ret += "Position : " + this.x + "/" + this.y;
		return ret;
	}

	mysprite.scale.x = 0.0033;
	mysprite.scale.y = 0.0033;
	mysprite.position.x = x;
	mysprite.position.y = -y;
	mysprite.mousedown = function(data) {
		ret = "Vaisseau " + id + " - " + name + "\n";
		ret += "MongoDB ID : " + _id + "\n";
		ret += "Type : " + image + "\n";
		ret += "Propriétaire : " + owner + "\n";
		ret += "Position : " + x + "/" + y;
		alert(ret);
	}
	mysprite.interactive = true;
	mysprite.buttonMode = true;

	this.sprite = mysprite;


}

function Map() {

	this.planets = [];
	this.ships = [];
	this.backgrounds = [];

	this.add = function(elmt) {
		if (elmt instanceof Planet) {
			this.planets.push(elmt);
		}
		else if (elmt instanceof Ship) {
			this.ships.push(elmt);
		}
		else if (elmt instanceof Background) {
			this.backgrounds.push(elmt);
		}
	}

	this.clear = function() {
		while (this.planets.length) { this.planets.pop(); }
		while (this.ships.length) { this.ships.pop(); }
		while (this.backgrounds.length) { this.backgrounds.pop(); }
	}

	this.toString = function() {
		ret = "Nombre de planètes : " + this.planets.length + "\n";
		ret += "Nombre de vaisseaux : " + this.ships.length + "\n";
		return ret;
	}

}
