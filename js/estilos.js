
document.querySelector("#formBusqueda input").onkeydown = function(){
	var button = document.querySelector("#formBusqueda .button");
	button.style.background = "#F7C9F3";
	button.style.borderColor = "#110038";  
	button.style.color = "#110038";
	document.querySelector("#formBusqueda img").style.opacity = 1;
};
document.querySelector("#formBusqueda .button").onclick = function(){
	this.style.outline = 1;
}