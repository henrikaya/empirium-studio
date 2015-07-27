var map;
var connectionState;
var stage;
var renderer;
var texture_planete;
var texture_ship;
var texture_vortex;
var texture_background;

var textures;

var scrollArea;
var sectors;
var sectorsName;
var view;

var zoomIndex;
var zoomList = [0.8,1.5,2.5,4,6,10,15,20,30,40,50,65,85,115]
var alphaSectorList = [0.5, 0.5, 0.4, 0.3, 0.3, 0.2, 0.2, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
var alphaSectorNameList = [1.0, 1.0, 1.0, 1.0, 1.0, 0.8, 0.5, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

function initPositions() {

	$('#main-screen').width($(window).width());

	var posNav = $('#nav').offset();
	posNav.top = 0;
	$('#nav').offset(posNav);

	var pos = 	$('#auth-container').offset();
	pos.top = 	($(window).height() - 65 + $('#nav').height() - $('#auth-container').height()) / 2;
	pos.left = 	($(window).width() - 50 - $('#auth-container').width()) / 2;		
	$('#auth-container').offset(pos);

	var posMap = 	$('#map').offset();
	posMap.top = 	$('#nav').height() - 30;
	posMap.left = 	0;
	$('#map').offset(posMap);

	var posDescription = $('#description').offset();
	posDescription.top = $('#nav').height();
	// TODO: replace "15" by css padding value
	posDescription.left = $(window).width() - $('#description').width() - 15;
	$('#description').offset(posDescription);
	$('#description').height($(window).height() - $('#nav').height());

	$('#description-close').height(25).width(25);
	var posDescClose = $('#description-close').offset();
	posDescClose.top = $('#nav').height() + 10;
	posDescClose.left = $(window).width() - $('#description-close').width() - 10;
	$('#description-close').offset(posDescClose);
}
