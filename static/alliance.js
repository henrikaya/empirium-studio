function initAllianceMenu() {

	$('#main-screen').append("<div id='alliance' class='row'></div>");

	$('#alliance').append("<div id='alliance-friends' class='col-md-12'></div>");
	$('#alliance-friends').append("<div id='alliance-friends-content' class='row'></div>");

	/*var pos1 = $('#alliance-friends').offset();
	var pos2 = $('#alliance-friends-content').offset();
	pos1.left = 0;
	pos2.left = 0;
	$('#alliance-friends').offset(pos1);
	$('#alliance-friends-contents').offset(pos2);*/

	$('#alliance').append("<div id='alliance-requests' class='col-md-12'></div>");
	$('#alliance-requests').append("<div id='alliance-requests-content' class='row'></div>");

	$('#alliance').append("<div id='alliance-all' class='col-md-12'>Seigneurs de l'Empirium</div>");
	$('#alliance-all').append("<div id='alliance-all-content' class='row'></div>");

	$('#alliance').hide();

}

function updateAllianceMenu() {

	function printFriends(data) {

		var objs = jQuery.parseJSON(data);
		var playersByRow = 6;

		// Print title
		$('#alliance-friends-content').append("<p class='col-xs-12'><center id='title-friends'>A M I S</center></p>");

		// Compute right playersByRow number
		if ($(window).width() < 768) {
			playersByRow = 2;
		}

		// Zero-padding
		var padding = playersByRow - (objs.allies.length % playersByRow);
		for (var i = 0; i < padding; i++) {
			$('#alliance-friends-content').append("<div id=padding'" + i + "' class='friend col-xs-6 col-sm-2'></div>");
		}

		// Friends
		for (var i = 0, s = objs.allies.length; i < s; i++) {
			o = objs.allies[i];
			$('#alliance-friends-content').append("<div id='" + o.id + "' class='friend col-xs-6 col-sm-2'></div>");
			$('#' + o.id).append("<div id='" + o.id + "-content' class='row'></div>");
			$('#' + o.id + '-content').append("<p class='col-xs-12'><center>" + o.name + "</center></p>");
			$('#' + o.id + '-content').append("<div class='col-xs-12'><center><img src='static/images/players/" + o.id + ".jpg' width=110px height=110px></center></div>");
			//$('#' + o.id + '-content').append("<div id='" + o.id + "-btn-group' class='btn-group col-xs-12'></div>");
			$('#' + o.id + '-content').append("<button type='button' class='btn btn-danger col-xs-12'>Ne plus etre ami</button>");
			//$('#' + o.id + '-btn-group').append("<button type='button' class='btn btn-danger col-xs-6'>Non</button>");
		}

	}

	function printFriendshipRequests(data) {

		var objs = jQuery.parseJSON(data);
		var playersByRow = 6;

		// Print title
		$('#alliance-requests-content').append("<p class='col-xs-12'><center id='title-requests'>D E M A N D E S   D ' A M I T I E</center></p>");

		// Compute right playersByRow number
		if ($(window).width() < 768) {
			playersByRow = 2;
		}

		/*// Zero-padding
		var padding = playersByRow - (objs.length % playersByRow);
		for (var i = 0; i < padding; i++) {
			$('#alliance-requests-content').append("<div id=padding'" + i + "' class='request col-xs-6 col-sm-2'></div>");
		}*/

		// Friends
		for (var i = 0, s = objs.length; i < s; i++) {
			o = objs[i];
			$('#alliance-requests-content').append("<div id='" + o.id + "' class='request col-xs-6 col-sm-2'></div>");
			$('#' + o.id).append("<div id='" + o.id + "-content' class='row'></div>");
			$('#' + o.id + '-content').append("<p class='col-xs-12'><center>" + o.name + "</center></p>");
			$('#' + o.id + '-content').append("<div class='col-xs-12'><center><img src='static/images/players/" + o.id + ".jpg' width=110px height=110px></center></div>");
			$('#' + o.id + '-content').append("<div id='" + o.id + "-btn-group' class='btn-group col-xs-12'></div>");
			$('#' + o.id + '-btn-group').append("<button type='button' class='btn btn-success col-xs-6'>Accepter</button>");
			$('#' + o.id + '-btn-group').append("<button type='button' class='btn btn-danger col-xs-6'>Refuser</button>");
		}

	}

	$.ajax({
		type: 'GET',
	 	url: 'get/friends',
		contentType: "application/json; charset=utf-8",
		timeout: 10000,
		success: function(data) { printFriends(data); },
		error: function() {
			alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (' + config['admin']['name'] + ' - ' + config['admin']['mail'] + ') si cela se reproduit.'); }
	});

	$.ajax({
		type: 'GET',
	 	url: 'get/friendshiprequests',
		contentType: "application/json; charset=utf-8",
		timeout: 10000,
		success: function(data) { printFriendshipRequests(data); },
		error: function() {
			alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (' + config['admin']['name'] + ' - ' + config['admin']['mail'] + ') si cela se reproduit.'); }
	});

}

function allianceMenu() {

	mode = "alliance";

	$('#description').fadeOut();
	$('#map').fadeOut();
	$('#alliance').fadeIn(initPositions);
}
