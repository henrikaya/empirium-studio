$(function () {

    connectionState = 0;
    mode = "connection";

    map = new Map();
    mapNeedToBeUpdated = false;

    // Init positions of elements when a user arrives on the website

    initPositions();
    initPixi();
    initAllianceMenu();
    $('#description').hide();

    // Init loading, success and fail images
    $('#images-loading').append("<img id='loading' src='static/images/loading.gif'>");
    $('#images-loading').append("<img id='success' src='static/images/success.gif'>");
    $('#images-loading').append("<img id='fail' src='static/images/fail.gif'>");
    $('#loading').hide();
    $('#success').hide();
    $('#fail').hide();

    $('#map').hide();
    $('#loading').attr("src", "static/images/loading.gif");
    $('#fail').attr("src", "static/images/fail.png");
    $('#success').attr("src", "static/images/success.gif");
    $('#wallpaper').attr("src", "static/images/wallpapers/wallpaper1.jpeg");

    $(window).resize(initPositions);

    $('#player').autocomplete({
        source: function(request, response) {
            var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
            response( $.grep( playersList, function( item ){
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
            mode = "map";
            updateAllianceMenu();
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
                var ship = new Ship(o._id.$oid, o.from, o.id, o.image, o.nom, o.owner, o.owner_id, o.type, o.model, o.x, o.y);
                map.add(ship);
            }
            else if (o.type == "Planete") {
                var planet = new Planet(o._id.$oid, o.from, o.id, o.image, o.nom, o.owner, o.owner_id, o.type, o.x, o.y);
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

        if (mode == "alliance") {
            $('#alliance').hide();
            $('#map').show();
            mode = "map";
        }

        initPositions();

        zoomIndex = 21;
        scrollArea.scale.x = zoomList[zoomIndex];
        scrollArea.scale.y = zoomList[zoomIndex];

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


    $('#map-link').click( function () {
        if (connectionState == 1 && mode == "alliance") {

            $('#alliance').fadeOut();
            $('#map').fadeIn();
            mode = "map";

            if (mapNeedToBeUpdated == true) {
                datasRequest();
                mapNeedToBeUpdated = false;
            }

            initPositions();
        }
    });

    $('#alliance-link').click( function () { if (connectionState == 1) { allianceMenu(); } } );

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

    initPositions();
});
