$(function () {

	var connectionState = 0;
	var map = new Map();

	function initPositions() {

		$('#icon-map').height($(window).height()/4);
		$('#icon-alliance').height($(window).height()/4);
		$('#icon-stats').height($(window).height()/4);
		$('#icon-exit').height($(window).height()/4);

		var posIconMap = $('#icon-map').offset();
		var posIconAlliance = $('#icon-alliance').offset();
		var posIconStats = $('#icon-stats').offset();
		var posIconExit = $('#icon-exit').offset();
		posIconMap.left = 0;
		posIconAlliance.left = 0;
		posIconStats.left = 0;
		posIconExit.left = 0;		
		$('#icon-map').offset(posIconMap);
		$('#icon-alliance').offset(posIconAlliance);
		$('#icon-stats').offset(posIconStats);
		$('#icon-exit').offset(posIconExit);

		var pos = $('#auth-container').offset();
		pos.top = ($(window).height() - $('#auth-container').height()) / 2;
		pos.left = ($(window).width() - $('#auth-container').width()) / 2;		
		$('#auth-container').offset(pos);

		var posLoading = $('#loading').offset();
		posLoading.top = ($(window).height() - $('#loading').height()) / 2;
		posLoading.left = ($(window).width() - $('#loading').width()) / 2;
		$('#loading').offset(posLoading);

		var posMap = $('#map').offset();
		posMap.top = 0;
		posMap.left = $('#icon-map').width();
		$('#map').offset(posMap);
	}

	initPositions();
	initPixi();
	$('#loading').hide();
	$('#map').hide();

	$(window).resize(initPositions);
	
	var cache = [];
	
    	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/map-light.svg";
    	cache.push(cacheImage);
	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/map-normal.svg";
    	cache.push(cacheImage);
	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/map-grey.svg";
    	cache.push(cacheImage);

	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/alliance2-light.svg";
    	cache.push(cacheImage);
	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/alliance2-normal.svg";
    	cache.push(cacheImage);
	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/alliance2-grey.svg";
    	cache.push(cacheImage);

	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/stats2-light.svg";
    	cache.push(cacheImage);
	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/stats2-normal.svg";
    	cache.push(cacheImage);
	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/stats2-grey.svg";
    	cache.push(cacheImage);

	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/exit2-light.svg";
    	cache.push(cacheImage);
	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/exit2-normal.svg";
    	cache.push(cacheImage);
	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/exit2-grey.svg";
    	cache.push(cacheImage);

	$('#icon-map').height($(window).height()/4);
	$('#icon-alliance').height($(window).height()/4);
	$('#icon-stats').height($(window).height()/4)
	$('#icon-exit').height($(window).height()/4)
	
	$("#icon-map").mouseover(function(){
        	if (connectionState > 0)
			$(this).attr("src", "static/images/map-light.svg");
    	}).mouseout(function(){
        	if (connectionState > 0)
			$(this).attr("src", "static/images/map-normal.svg");
    	});
	
	$("#icon-alliance").mouseover(function(){
		if (connectionState > 0)
        		$(this).attr("src", "static/images/alliance2-light.svg");
    	}).mouseout(function(){
		if (connectionState > 0)
        		$(this).attr("src", "static/images/alliance2-normal.svg");
    	});
	
	$("#icon-stats").mouseover(function(){
		if (connectionState > 0)
        		$(this).attr("src", "static/images/stats2-light.svg");
    	}).mouseout(function(){
		if (connectionState > 0)
        		$(this).attr("src", "static/images/stats2-normal.svg");
    	});
	
	$("#icon-exit").mouseover(function(){
		if (connectionState > 0)
        		$(this).attr("src", "static/images/exit2-light.svg");
    	}).mouseout(function(){
		if (connectionState > 0)
        		$(this).attr("src", "static/images/exit2-normal.svg");
    	});
	
    	var liste = [
		"Aotearoa",
		"Arduina",
		"Arn Psuul",
		"Arngeir",
		"Azzboy",
		"Baal",
		"Barmak",
		"Bloody",
		"Bolos",
		"Charles Le Chaleureux",
		"Compans",
		"Cornélius Jol",
		"Coucoudu13",
		"Dall Piedor",
		"Duilwenn",
		"Ebola",
		"Elghinn Solen",
		"Exo Dit Le Beau",
		"Faëinkar",
		"Fatne",
		"Faust",
		"Finrod Vanimedlë",
		"Général Sheppard",
		"Giblar Marcassi",
		"Gozkrân Uhk Trakka",
		"Graylion",
		"Gregotep",
		"GuyBrush",
		"Junko Jul",
		"Kaniche",
		"Katherine Talkesh",
		"Kroyneur",
		"L'Archiviste",
		"Le Rédacteur",
		"Loky",
		"Nathaniel",
		"Nausica",
		"Padov",
		"Powi",
		"Pryrates",
		"Reporters Codex",
		"Sequoisa",
		"ShinAnubis",
		"Starbutt",
		"T800",
		"Test Webmaster",
		"Tetsuda Owen",
		"Thor",
		"Torehn Karma",
		"Tycroche",
		"Vaelin Al Sorna",
		"Vallala",
		"Vezalo",
		"Visaris",
		"Warum",
		"Yordvalik",
		"Yvan"
	];

    	$('#player').autocomplete({
        	source: function(request, response) {
	    		//var results = $.ui.autocomplete.filter(liste, request.term);
	    		//response(results.slice(0, 5));

	    		var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
            		response( $.grep( liste, function( item ){
                		return matcher.test( item );
            		}) );
		}
    	});

    	function processAuthResponse(data) {

        	if (data == "player unknown") {
			alert("ah, connais pas!");
			$('#loading').hide();
			$('#auth-container').show();
			initPositions();
			$('#icon-map:hover').css('cursor', 'normal');
		}
		else if (data == "wrong password") {
			alert("ah non!!");
			$('#loading').hide();
			$('#auth-container').show();
			initPositions();
			$('#icon-map:hover').css('cursor', 'normal');
		}
		else if (data == "success") {
			connectionState = 1;

			$('#loading').hide();
			initPositions();
			$('#icon-map').attr("src", "static/images/map-normal.svg");
			$('#icon-alliance').attr("src", "static/images/alliance2-normal.svg");
			$('#icon-stats').attr("src", "static/images/stats2-normal.svg");
			$('#icon-exit').attr("src", "static/images/exit2-normal.svg");
			$('#icon-map:hover').css('cursor', 'pointer');
			$('#icon-alliance:hover').css('cursor', 'pointer');
			$('#icon-stats:hover').css('cursor', 'pointer');
			$('#icon-exit:hover').css('cursor', 'pointer');

			$('#map').show();
			initPositions();
		}
		else {
			alert("Reponse du serveur inconnue : \"" + data + "\". Vous pouvez reessayer ou contacter un administrateur (L.G) si cela se reproduit.");
			$('#loading').hide();
			$('#auth-container').show();
			initPositions();
			$('#icon-map:hover').css('cursor', 'normal');
		}

    	}

    	function connect() {

		$('#auth-container').hide();
		$('#loading').show();
		initPositions();
	
	        var mydata = "name=" + $('#player').val() + "&pass=" + MD5($('#password').val());
	
	        $.ajax({
	        	type: 'POST',
            		url: 'connection',
	    		data: mydata,
            		timeout: 3000,
            		success: function(data) { processAuthResponse(data); },
            		error: function() {
              		alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (L.G) si cela se reproduit.'); }
        	});    

    	}
	
    	$('#button-connection').click(function() {
        	connect();
    	});

    	$('#password').keypress(function(e) {
        	if (e.which == 13) {
			connect();
		}
    	});

	function printData(data) {

		map.clear();

		var objs = jQuery.parseJSON(data);

		for (var i = 0, s = objs.length; i < s; i++) {
    
			o = objs[i];
			if (o.type == "Vaisseau") {
				var ship = new Ship(o._id.$oid, o.from, o.id, o.image, o.nom, o.owner, o.type, o.x, o.y);
				map.add(ship);
			}
			else if (o.type == "Planete") {
				var planet = new Planet(o._id.$oid, o.from, o.id, o.image, o.nom, o.owner, o.type, o.x, o.y);
				map.add(planet);
			}

		}

		alert( map.toString() );

		$('#map').show();
		initPositions();

	}

	$('#icon-map').click(function() {

		if (connectionState == 1) {
			$.ajax({
				type: 'GET',
		    		url: 'get/535',
				contentType: "application/json; charset=utf-8",
		    		timeout: 3000,
		    		success: function(data) { printData(data); },
		    		error: function() {
		      		alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (L.G) si cela se reproduit.'); }
			});
		}
	});
	
});
