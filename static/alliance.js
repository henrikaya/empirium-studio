function initAllianceMenu() {

	$('#main-screen').append("<div id='alliance' class='row'></div>");

	$('#alliance').append("<div id='alliance-friends' class='col-md-4'></div>");
	$('#alliance-friends').append("<p id='title-alliance-friends'><center style='font-size:24px;'>AMIS</center></p>");
	$('#alliance-friends').append("<div id='alliance-friends-content' style='height:" + ($(window).height() - $('#nav').height() - 60) + "px; line-height:3em; overflow:auto; padding:5px;'></div>");

	$('#alliance').append("<div id='alliance-requests' class='col-md-4'></div>");
	$('#alliance-requests').append("<p id='title-alliance-requests'><center style='font-size:24px;'>DEMANDES D'AMITIE</center></p>");
	$('#alliance-requests').append("<div id='alliance-requests-content' style='height:" + ($(window).height() - $('#nav').height() - 60) + "px; line-height:3em; overflow:auto; padding:5px;'></div>");

	$('#alliance').append("<div id='alliance-all' class='col-md-4'></div>");
	$('#alliance-all').append("<p id='title-alliance-all'><center style='font-size:24px;'>SEIGNEURS DE L'EMPIRIUM</center></p>");
	$('#alliance-all').append("<div id='alliance-all-content' style='height:" + ($(window).height() - $('#nav').height() - 60) + "px; line-height:3em; overflow:auto; padding:5px;'></div>");

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

        	// Clear friends
	    	$('#alliance-friends-content').remove();
		$('#alliance-friends').append("<div id='alliance-friends-content' style='height:" + ($(window).height() - $('#nav').height() - 60) + "px; line-height:3em; overflow:auto; padding:5px;'></div>");

		if (objs.allies.length <= 0) {
			$('#alliance-friends-content').append("<div id='alliance-friends-empty'></div>");
			$('#alliance-friends-empty').append("<center>Aucun ami</center>");
		}

		// Friends
		for (var i = 0, s = objs.allies.length; i < s; i++) {
			o = objs.allies[i];
			$('#alliance-friends-content').append("<div id='" + o.id + "'></div>");
			$('#' + o.id).append("<img src='static/images/players/" + o.id + ".jpg' width=42px height=42px style='float:left;'>");
			$('#' + o.id).append(o.name);
			$('#' + o.id).append("<button type='button' onclick='cancelFriendship(\"" + o.name + "\")' class='btn btn-default' style='float:right;'>Ne plus etre ami</button>");
		}

}

function printFriendshipRequests(data) {

		var objs = jQuery.parseJSON(data);

        	// Clear requests
	    	$('#alliance-requests-content').remove();
		$('#alliance-requests').append("<div id='alliance-requests-content' style='height:" + ($(window).height() - $('#nav').height() - 60) + "px; line-height:3em; overflow:auto; padding:5px;'></div>");

		if (objs.length <= 0) {
			$('#alliance-requests-content').append("<div id='alliance-requests-empty'></div>");
			$('#alliance-requests-empty').append("<center>Aucune demande</center>");
		}

		// Requests
		for (var i = 0, s = objs.length; i < s; i++) {
			o = objs[i];
			$('#alliance-requests-content').append("<div id='" + o.id + "'></div>");
			$('#' + o.id).append("<img src='static/images/players/" + o.id + ".jpg' width=42px height=42px style='float:left;'>");
			$('#' + o.id).append(o.name);
			$('#' + o.id).append("<div id='" + o.id + "-btn-group' class='btn-group' style='float:right;'></div>");
			$('#' + o.id + '-btn-group').append("<button type='button' onclick='askFriendship(\"" + o.name + "\")' class='btn btn-warning'>Accepter</button>");
			$('#' + o.id + '-btn-group').append("<button type='button' onclick='cancelFriendshipRequest(\"" + o.name + "\")' class='btn btn-default'>Refuser</button>");
		}
        
}

function printExternalPlayers(data) {

		var objs = jQuery.parseJSON(data);

        	// Clear external players
	    	$('#alliance-all-content').remove();
		$('#alliance-all').append("<div id='alliance-all-content' style='height:" + ($(window).height() - $('#nav').height() - 60) + "px; line-height:3em; overflow:auto; padding:5px;'></div>");

		// External players
		for (var i = 0, s = objs.players.length; i < s; i++) {
			o = objs.players[i];
			$('#alliance-all-content').append("<div id='" + o.id + "'></div>");
			$('#' + o.id).append("<img src='static/images/players/" + o.id + ".jpg' width=42px height=42px style='float:left;'>");
			$('#' + o.id).append(o.name);
			if (o.requested == "no") {
				$('#' + o.id).append("<button type='button' onclick='askFriendship(\"" + o.name + "\")' class='btn btn-warning' style='float:right;'>Demander</button>");
			}
			else {
				$('#' + o.id).append("<button type='button' class='btn btn-default' style='float:right;'>Demande deja envoyee</button>");
			}
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
