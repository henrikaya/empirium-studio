var map;
var mapNeedToBeUpdated;
var connectionState;
var mode;
var stage;
var renderer;
var texture_planete;
var texture_ship;
var texture_vortex;
var texture_background;
var textures;

var playersList;

var scrollArea;
var sectors;
var sectorsName;
var view;

var zoomIndex;
var zoomList = [0.8,1.1,1.5,1.9,2.5,3.2,4,4.8,6,7.5,10,12,15,17.5,20,25,30,35,40,45,50,57,65,74,85,97,115]
var alphaSectorList = [0.4, 0.4, 0.4, 0.35, 0.3, 0.25, 0.2, 0.2, 0.2, 0.15, 0.1, 0.1, 0.1, 0.05, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
var alphaSectorNameList = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.8, 0.65, 0.5, 0.35, 0.2, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

function initPositions() {

	$('#main-screen').width($(window).width());

	var posNav = $('#nav').offset();
	posNav.top = 0;
	$('#nav').offset(posNav);

	var pos = $('#auth-container').offset();
	pos.top = ($(window).height() - 65 + $('#nav').height() - $('#auth-container').height()) / 2;
	pos.left = ($(window).width() - 50 - $('#auth-container').width()) / 2;
	$('#auth-container').offset(pos);

	var posMap = $('#map').offset();
	posMap.top = $('#nav').height() - 30;
	posMap.left = 0;
	$('#map').offset(posMap);

}
