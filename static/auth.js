$(function () {

	var connectionState = 0;
	var map = new Map();

	function initPositions() {

		$('#icon-map').height($(window).height()/12);
		$('#icon-alliance').height($(window).height()/12);
		$('#icon-technology').height($(window).height()/12);
		$('#icon-stats').height($(window).height()/12);
		$('#icon-exit').height($(window).height()/12);

		var posIconMap = $('#icon-map').offset();
		var posIconAlliance = $('#icon-alliance').offset();
		var posIconTechnology = $('#icon-technology').offset();
		var posIconStats = $('#icon-stats').offset();
		var posIconExit = $('#icon-exit').offset();
		posIconMap.left = 30;
		posIconAlliance.left = 30 + $('#icon-map').width() + 20;
		posIconTechnology.left = 30 + 2 * ($('#icon-map').width() + 20);
		posIconStats.left = 30 + 3 * ($('#icon-map').width() + 20);
		posIconExit.left = 30 + 4 * ($('#icon-map').width() + 20);		
		posIconMap.top = 30;
		posIconAlliance.top = 30;
		posIconTechnology.top = 30;
		posIconStats.top = 30;
		posIconExit.top = 30;

		$('#icon-map').offset(posIconMap);
		$('#icon-alliance').offset(posIconAlliance);
		$('#icon-technology').offset(posIconTechnology);
		$('#icon-stats').offset(posIconStats);
		$('#icon-exit').offset(posIconExit);

		var pos = $('#auth-container').offset();
		pos.top = ($(window).height() - $('#auth-container').height()) / 2;
		pos.left = ($(window).width() - $('#auth-container').width()) / 2;		
		$('#auth-container').offset(pos);

		var posMap = $('#map').offset();
		posMap.top = 0;
		posMap.left = 0;
		$('#map').offset(posMap);
	}

	$('#icon-map').hide();
	$('#icon-alliance').hide();
	$('#icon-technology').hide();
	$('#icon-stats').hide();
	$('#icon-exit').hide();
	initPositions();
	initPixi();
	$('#loading').hide();
	$('#success').hide();
	$('#fail').hide();
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
    	cacheImage.src = "static/images/technology-light.svg";
    	cache.push(cacheImage);
	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/technology-normal.svg";
    	cache.push(cacheImage);
	var cacheImage = document.createElement('img');
    	cacheImage.src = "static/images/technology-grey.svg";
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

	$("#icon-technology").mouseover(function(){
		if (connectionState > 0)
        		$(this).attr("src", "static/images/technology-light.svg");
    	}).mouseout(function(){
		if (connectionState > 0)
        		$(this).attr("src", "static/images/technology-normal.svg");
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

		if (data == "wrong password" || data =="player unknown") {
		
		 	var authContainerHeight = $('#auth-container').height();
                        var authContainerWidth = $('#auth-container').width();
                        var authContainerPos = $('#auth-container').offset();

                        var topLoading = $('#loading').offset().top;
                        var hLoading = $('#loading').height();
                        $('#loading').hide();
                        $('#fail').fadeIn().fadeOut().fadeIn().fadeOut();
                        pos = $('#fail').offset();
                        // TODO: correct following line (all positions have to be relative...)
                        pos.top = topLoading + (hLoading - $('#fail').height()) / 2;
                        pos.left = authContainerPos.left + (authContainerWidth - $('#fail').width()) / 2 + 20;
                        $('#fail').offset(pos);
                        $('#auth-container').height(authContainerHeight);
                        $('#auth-container').offset(authContainerPos);

			$('#fail').delay(1800).hide(0);
			$('#player').delay(1800).show(0);
			$('#player').delay(1800).focus(0);
			$('#password').delay(1800).show(0);
			$('#button-connection').delay(1800).show(0);
		}
		else if (data == "success") {
			connectionState = 1;
	
			var authContainerHeight = $('#auth-container').height();
			var authContainerWidth = $('#auth-container').width();
			var authContainerPos = $('#auth-container').offset();
			
			$('#icon-map').fadeIn("slow");
			$('#icon-alliance').fadeIn("slow");
			$('#icon-technology').fadeIn("slow");
			$('#icon-stats').fadeIn("slow");
			$('#icon-exit').fadeIn("slow");
			initPositions();

			var topLoading = $('#loading').offset().top;
			var hLoading = $('#loading').height();
			$('#loading').hide();
			$('#success').show();
			pos = $('#success').offset();
			pos.top = topLoading + (hLoading - $('#success').height()) / 2;
			// TODO: correct following line (all positions have to be relative...)
			pos.left = authContainerPos.left + (authContainerWidth - $('#success').width()) / 2 + 20;
			$('#success').offset(pos);
			$('#auth-container').height(authContainerHeight);
			$('#auth-container').offset(authContainerPos);
			$("#auth-container").delay(1200).fadeOut("slow", function() { initPositions(); });

			$('#map').show();
			initPositions();
		}
		else {
			alert("Reponse du serveur inconnue : \"" + data + "\". Vous pouvez reessayer ou contacter un administrateur (L.G) si cela se reproduit.");
			$('#loading').hide();
			$('#auth-container').show();
			initPositions();
		}

    	}

    	function connect() {

		var authContainerHeight = $('#auth-container').height();
		var authContainerWidth = $('#auth-container').width();
		var authContainerLeft = $('#auth-container').offset().left;
		var topPButton = $('#player').offset().top;
		var topCButton = $('#button-connection').offset().top;
		var hCButton = $('#button-connection').height();
		$('#player').hide();
		$('#password').hide();
		$('#button-connection').hide();
		$('#loading').show();
		pos = $('#loading').offset();
		pos.top = (topPButton + topCButton + hCButton - $('#loading').height()) / 2;
		// TODO: correct following line (all positions have to be relative...)
		pos.left = authContainerLeft + (authContainerWidth - $('#loading').width()) / 2 + 20;
		$('#loading').offset(pos);
		$('#auth-container').height(authContainerHeight);	

	        var mydata = "name=" + $('#player').val() + "&pass=" + MD5($('#password').val());
	
	        $.ajax({
	        	type: 'POST',
            		url: 'connection',
	    		data: mydata,
            		timeout: 10000,
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
		    		timeout: 10000,
		    		success: function(data) { printData(data); },
		    		error: function() {
		      		alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (L.G) si cela se reproduit.'); }
			});
		}
	});
	
});
