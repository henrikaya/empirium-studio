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
