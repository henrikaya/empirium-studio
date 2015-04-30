function initGraphics() {

	var renderer = new PIXI.WebGLRenderer(1000, 1000);

	//document.body.appendChild(renderer.view);
	$('#main-screen').add(renderer.view);

}
