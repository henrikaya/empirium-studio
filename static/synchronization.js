var synchro_progression = new ProgressBar.Circle('#synchro-loading', {
    color: '#FCB03C',
    strokeWidth: 2,
    trailWidth: 1,
    duration: 1500,
    text: {
        value: '0'
    },
    step: function(state, bar) {
        bar.setText((bar.value() * 100).toFixed(0));
    }
});

update_synchro_data = function (data, id_request) {
        var obj = jQuery.parseJSON(data);
	var progression = obj.analyze / 3;
	progression += obj.base / 3;
	progression += obj.groups / 3;

	synchro_progression.animate(progression);

	$('#synchro-analyze-text').text("Analyse des radars " + Math.round(obj.analyze * 100) + "%");
	$('#synchro-base-text').text("Mise en base " + Math.round(obj.base * 100) + "%");
	$('#synchro-groups-text').text("Optimisation de la base " + Math.round(obj.groups * 100) + "%");

	if (progression >= 1.0) {
		$('#synchro-loading').hide();
		$('#synchro-finished').show();
	}

	if (progression < 1.0) {
		get_synchro_data(id_request);
	}
}

get_synchro_data = function (id_request) {
            	$.ajax({
                	type: 'GET',
                	url: 'request/getupdatestatus/' + id_request,
                	contentType: "application/json; charset=utf-8",
                	timeout: 10000,
                	success: function(data) { update_synchro_data(data, id_request); },
                	error: function() {
                	    alert('Erreur : probleme disponibilite serveur. Vous pouvez reessayer ou contacter un administrateur (' + config['admin']['name'] + ' - ' + config['admin']['mail'] + ') si cela se reproduit.'); }
            	});
}

synchro_main = function (id_request) {
		$('#main-screen').hide();
		$('#synchro-finished').hide();
		$('#synchro').show();
		get_synchro_data(id_request);
}

