function initAllianceMenu() {

	$('#main-screen').append("<div id='alliance' class='row'></div>");

	$('#alliance').append("<div id='alliance-friends' class='col-md-4'></div>");
	$('#alliance-friends').append("<div id='alliance-friends-content' class='row'></div>");

	$('#alliance').append("<div id='alliance-requests' class='col-md-4'></div>");
	$('#alliance-requests').append("<div id='alliance-requests-content' class='row'></div>");

	$('#alliance').append("<div id='alliance-all' class='col-md-4'></div>");
	$('#alliance-all').append("<div id='alliance-all-content' class='row'></div>");

	$('#alliance').hide();

}

function askFriendship(player) {
	$.ajax({
		type: 'GET',
		url: 'request/friendship/{"to":"' + player + '"}',
		contentType: "application/json; charset=utf-8",
		timeout: 10000,
		success: function(data) { updateAllianceMenu(); map.clear(); mapNeedToBeUpdated = true; },
		error: function() {
			alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (' + config['admin']['name'] + ' - ' + config['admin']['mail'] + ') si cela se reproduit.'); }
	});
}

function cancelFriendship(player) {
	$.ajax({
		type: 'GET',
		url: 'request/cancelfriendship/{"to":"' + player + '"}',
		contentType: "application/json; charset=utf-8",
		timeout: 10000,
		success: function(data) { updateAllianceMenu(); map.clear(); mapNeedToBeUpdated = true; },
		error: function() {
			alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (' + config['admin']['name'] + ' - ' + config['admin']['mail'] + ') si cela se reproduit.'); }
	});
}

function cancelFriendshipRequest(player) {
	$.ajax({
		type: 'GET',
		url: 'request/cancelfriendshiprequest/{"to":"' + player + '"}',
		contentType: "application/json; charset=utf-8",
		timeout: 10000,
		success: function(data) { updateAllianceMenu(); },
		error: function() {
			alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (' + config['admin']['name'] + ' - ' + config['admin']['mail'] + ') si cela se reproduit.'); }
	});
}


function printFriends(data) {

		var objs = jQuery.parseJSON(data);
		var playersByRow = 6;

        // Clear friends
	    $('#alliance-friends-content').remove();
	    $('#alliance-friends').append("<div id='alliance-friends-content' class='row'></div>");

        // Print title
		$('#alliance-friends-content').append("<p class='col-xs-12'><center id='title-friends'>A M I S</center></p>");

		// Compute right playersByRow number
		if ($(window).width() < 768) {
			playersByRow = 2;
		}

		// Zero-padding
		var padding = playersByRow - (objs.allies.length % playersByRow);
		for (var i = 0; i < padding; i++) {
			$('#alliance-friends-content').append("<div id=padding'" + i + "' class='friend col-xs-6 col-sm-6'></div>");
		}

		// Friends
		for (var i = 0, s = objs.allies.length; i < s; i++) {
			o = objs.allies[i];
			$('#alliance-friends-content').append("<div id='" + o.id + "' class='friend col-xs-6 col-sm-6'></div>");
			$('#' + o.id).append("<div id='" + o.id + "-content' class='row'></div>");
			$('#' + o.id + '-content').append("<p class='col-xs-12'><center>" + o.name + "</center></p>");
			$('#' + o.id + '-content').append("<div class='col-xs-12'><center><img src='static/images/players/" + o.id + ".jpg' width=110px height=110px></center></div>");
			$('#' + o.id + '-content').append("<button type='button' onclick='cancelFriendship(\"" + o.name + "\")' class='btn btn-danger col-xs-12'>Ne plus etre ami</button>");
		}

}

function printFriendshipRequests(data) {

		var objs = jQuery.parseJSON(data);
		var playersByRow = 6;

        // Clear requests
	    $('#alliance-requests-content').remove();
	    $('#alliance-requests').append("<div id='alliance-requests-content' class='row'></div>");

		// Print title
		$('#alliance-requests-content').append("<p class='col-xs-12'><center id='title-requests'>D E M A N D E S   D ' A M I T I E</center></p>");

		// Compute right playersByRow number
		if ($(window).width() < 768) {
			playersByRow = 2;
		}

		// Requests
		for (var i = 0, s = objs.length; i < s; i++) {
			o = objs[i];
			$('#alliance-requests-content').append("<div id='" + o.id + "' class='request col-xs-6 col-sm-6'></div>");
			$('#' + o.id).append("<div id='" + o.id + "-content' class='row'></div>");
			$('#' + o.id + '-content').append("<p class='col-xs-12'><center>" + o.name + "</center></p>");
			$('#' + o.id + '-content').append("<div class='col-xs-12'><center><img src='static/images/players/" + o.id + ".jpg' width=110px height=110px></center></div>");
			$('#' + o.id + '-content').append("<div id='" + o.id + "-btn-group' class='btn-group col-xs-12'></div>");
			$('#' + o.id + '-btn-group').append("<button type='button' onclick='askFriendship(\"" + o.name + "\")' class='btn btn-success col-xs-6'>Accepter</button>");
			$('#' + o.id + '-btn-group').append("<button type='button' onclick='cancelFriendshipRequest(\"" + o.name + "\")' class='btn btn-danger col-xs-6'>Refuser</button>");
		}
}

function printExternalPlayers(data) {

		var objs = jQuery.parseJSON(data);
		var playersByRow = 6;

        // Clear external players
	    $('#alliance-all-content').remove();
	    $('#alliance-all').append("<div id='alliance-all-content' class='row'></div>");

		// Print title
		$('#alliance-all-content').append("<p class='col-xs-12'><center id='title-all'>S E I G N E U R S D E L ' E M P I R I U M</center></p>");

		// Compute right playersByRow number
		if ($(window).width() < 768) {
			playersByRow = 2;
		}

		// Requests
		for (var i = 0, s = objs.players.length; i < s; i++) {
			o = objs.players[i];
			$('#alliance-all-content').append("<div id='" + o.id + "' class='all col-xs-6 col-sm-6'></div>");
			$('#' + o.id).append("<div id='" + o.id + "-content' class='row'></div>");
			$('#' + o.id + '-content').append("<p class='col-xs-12'><center>" + o.name + "</center></p>");
			$('#' + o.id + '-content').append("<div class='col-xs-12'><center><img src='static/images/players/" + o.id + ".jpg' width=110px height=110px></center></div>");
			$('#' + o.id + '-content').append("<button type='button' onclick='askFriendship(\"" + o.name + "\")' class='btn btn-success col-xs-12'>Demander</button>");
		}
}

function updateFriends() {
	$.ajax({
		type: 'GET',
		url: 'get/friends',
		contentType: "application/json; charset=utf-8",
		timeout: 10000,
		success: function(data) { printFriends(data); },
		error: function() {
			alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (' + config['admin']['name'] + ' - ' + config['admin']['mail'] + ') si cela se reproduit.'); }
	});
}

function updateFriendshipRequests() {
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

function updateExternalPlayers() {
	$.ajax({
		type: 'GET',
		url: 'get/externalplayers',
		contentType: "application/json; charset=utf-8",
		timeout: 10000,
		success: function(data) { printExternalPlayers(data); },
		error: function() {
			alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (' + config['admin']['name'] + ' - ' + config['admin']['mail'] + ') si cela se reproduit.'); }
	});
}

function updateAllianceMenu() {

    updateFriends();
    updateFriendshipRequests();
    updateExternalPlayers();
    initPositions();
}

function allianceMenu() {

	mode = "alliance";

	$('#description').fadeOut();
	$('#map').fadeOut();
	$('#alliance').fadeIn(initPositions);
}
