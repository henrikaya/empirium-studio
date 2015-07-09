$(function () {

	connectionState = 0;
	map = new Map();

	function initPositions() {

		var posNav = $('#nav').offset();
		posNav.top = 0;
		$('#nav').offset(posNav);

		var pos = 	$('#auth-container').offset();
		pos.top = 	($(window).height() - 65 + $('#nav').height() - $('#auth-container').height()) / 2;
		pos.left = 	($(window).width() - 50 - $('#auth-container').width()) / 2;		
		$('#auth-container').offset(pos);

		var posMap = 	$('#map').offset();
		posMap.top = 	0;
		posMap.left = 	0;
		$('#map').offset(posMap);

		var posDescription = $('#description').offset();
		posDescription.top = $('#nav').height() - 30;
		// TODO: replace "15" by css padding value
		posDescription.left = $(window).width() - $('#description').width() - 15;
		$('#description').offset(posDescription);
		$('#description').height($(window).height() - $('#nav').height() + 30);

		$('#description-close').height(25).width(25);
		var posDescClose = $('#description-close').offset();
		posDescClose.top = $('#nav').height() - 30 + 10;
		posDescClose.left = $(window).width() - $('#description-close').width() - 10;
		$('#description-close').offset(posDescClose);
	}

	// Init positions of elements when a user arrives on the website

	initPositions();
	initPixi();
	$('#description').hide();
	$('#loading').hide();
	$('#success').hide();
	$('#fail').hide();
	$('#map').hide();
	$('#loading').attr("src", "static/images/loading.gif");
	$('#fail').attr("src", "static/images/fail.png");
	$('#success').attr("src", "static/images/success.gif");
	$('#wallpaper').attr("src", "static/images/wallpapers/wallpaper1.jpeg");

	$(window).resize(initPositions);

	// TODO: Generate dynamically list of players
	
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
	    		var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
            		response( $.grep( liste, function( item ){
                		return matcher.test( item );
            		}) );
		}
    	});

	datasRequest = function() {

		if (connectionState == 1) {
			$.ajax({
				type: 'GET',
		    		url: 'getcyclenumber',
				contentType: "application/json; charset=utf-8",
		    		timeout: 10000,
		    		success: function(data) { getDatas(data['num']); },
		    		error: function() {
		      		alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (' + config['admin']['name'] + ' - ' + config['admin']['mail'] + ') si cela se reproduit.'); }
			});
		}
	}

    	function processAuthResponse(data) {

		if (data == "wrong password" || data =="player unknown") {
		
		 	var authContainerHeight = $('#auth-container').height();
                        var authContainerWidth = $('#auth-container').width();
                        var authContainerPos = $('#auth-container').offset();

                        var topLoading = $('#loading').offset().top;
                        var hLoading = $('#loading').height();

			function authentPartAppear() {
				$('#authent-part').show();
			}

                        $('#loading').hide();
                        $('#fail').fadeIn().fadeOut().fadeIn().fadeOut(400, authentPartAppear);

                        pos = $('#fail').offset();
                        pos.top = topLoading + (hLoading - $('#fail').height()) / 2;
                        // TODO: correct following line (all positions have to be relative...)
                        pos.left = authContainerPos.left + (authContainerWidth - $('#fail').width()) / 2 + 20;

                        $('#fail').offset(pos);
                        $('#auth-container').height(authContainerHeight);
                        $('#auth-container').offset(authContainerPos);

		}
		else if (data == "success") {
			connectionState = 1;
	
			var authContainerHeight = $('#auth-container').height();
			var authContainerWidth = $('#auth-container').width();
			var authContainerPos = $('#auth-container').offset();

			function buttonsAppear() {
				$('#map').fadeIn();
				initPositions();
			}

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
			$("#auth-container").delay(1200).fadeOut("slow", buttonsAppear);
			datasRequest();
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
		$('#authent-part').hide();
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
		      	alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (' + config['admin']['name'] + ' - ' + config['admin']['mail'] + ') si cela se reproduit.'); }
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

	// Print informations about datas (ships and planets) received

	function printData(data) {

		map.clear();

		var objs = jQuery.parseJSON(data);

		for (var i = 0, s = objs.datas.length; i < s; i++) {
    
			o = objs.datas[i];
			if (o.type == "Vaisseau") {
				var ship = new Ship(o._id.$oid, o.from, o.id, o.image, o.nom, o.owner, o.type, o.x, o.y);
				map.add(ship);
			}
			else if (o.type == "Planete") {
				var planet = new Planet(o._id.$oid, o.from, o.id, o.image, o.nom, o.owner, o.type, o.x, o.y);
				map.add(planet);
			}
			else if (o.type == "Vortex") {
				var vortex = new Vortex(o._id.$oid, o.from, o.id, o.type, o.destination, o.x, o.y);
				map.add(vortex);
			}

		}

		var background = new Background(80,80);
		map.add(background);

		console.log( map.toString() );

		initPositions();

		view.center(objs.interest.x, - objs.interest.y);

		bindMap();
	}
	
	function getDatas(cycle) {

		if (connectionState == 1) {
			$.ajax({
				type: 'GET',
		    		url: 'get/' + cycle,
				contentType: "application/json; charset=utf-8",
		    		timeout: 10000,
		    		success: function(data) { printData(data); },
		    		error: function() {
		      		alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (' + config['admin']['name'] + ' - ' + config['admin']['mail'] + ') si cela se reproduit.'); }
			});
		}
	}


	$('#map-link').click(datasRequest);

	$('#exit-link').click(function() {

		if (connectionState == 1) {
			$.ajax({
				type: 'GET',
		    		url: 'disconnection/',
		    		timeout: 10000,
		    		success: function(data) { connectionState = 0; window.location.replace(config['server']['host'] + ":" + config['server']['port']); },
		    		error: function() {
		      		alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (' + config['admin']['name'] + ' - ' + config['admin']['mail'] + ') si cela se reproduit.'); }
			});
		}
	});

	$('#description-close').click(function() {

		if (connectionState == 1) {
			$('#description').hide();
			initPositions();
		}
	});

});
