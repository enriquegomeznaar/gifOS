const api_key= "iKhZFHfv2l7eWGP4Y79Ny12J2nwhGgmX";

// Llamado fetch para los gifs sugeridos
const endPointSugeridos = 'https://api.giphy.com/v1/gifs/random?api_key=' + api_key + '&tag=&rating=G';
const sugestedContainer = document.querySelector('#sugestedContainer');

if (sugestedContainer != null) {
	for (let i = 1; i <= 4; i++) {
		fetch(endPointSugeridos)
			.then(function (response) {
				return response.json();
			})
			.then(function (info) {
				let gifInfo = {
					url: info.data.images.fixed_height_downsampled.url,
					title: info.data.title,
					id: info.data.id
				};
				
				sugestedContainer.innerHTML += `
				<div class="gif-box">
				<h4 class="gif-box-title"># ${gifInfo.title.trim() ? gifInfo.title : 'Gif sin título'} </h4>
				<div class="gif-box-image">
					<img src="${gifInfo.url}" alt="un gif sugerido">
					<a href="https://giphy.com/gifs/${gifInfo.id}" class="gif-box-link">Ver más..</a>
				</div>
				<button class="favorite-icon" data-id="${gifInfo.id}"><i class="fas fa-star"></i></button>
			</div>
				`;

				const botones = document.querySelectorAll('#sugestedContainer .favorite-icon');

				botones.forEach(function (unBoton) {
					unBoton.addEventListener('click', function () {
						let idsEnFavoritos = localStorage.getItem('favoritos');
						if ( !idsEnFavoritos ) {
							localStorage.setItem('favoritos', JSON.stringify([this.dataset.id]));
						} else {
							idsEnFavoritos = JSON.parse(idsEnFavoritos);
							if (!idsEnFavoritos.includes(this.dataset.id)) {
								idsEnFavoritos.push(this.dataset.id);
								localStorage.setItem('favoritos', JSON.stringify(idsEnFavoritos));
							}
						}
					})
				})
			});
	}
}


// Llamado fetch para los gifs trending
const endPointTrending = 'https://api.giphy.com/v1/gifs/trending?api_key=' + api_key + '&limit=16&rating=G';
const trendingContainer = document.querySelector('#trendingContainer');

if (trendingContainer != null) {
	fetch(endPointTrending)
		.then(function (response) {
			return response.json();
		})
		.then(function (info) {
			let arrayDeGifs = info.data;

			for (let i = 0; i < arrayDeGifs.length; i++) {
				trendingContainer.innerHTML += `
				<div class="gif-box">
					<h4 class="gif-box-title"> ${arrayDeGifs[i].title.trim() ? arrayDeGifs[i].title : 'Gif sin título'} </h4>
					<div class="gif-box-image">
						<img src="${arrayDeGifs[i].images.fixed_height_downsampled.url}" alt="un gif sugerido">
					</div>
					<button class="favorite-icon" data-id="${arrayDeGifs[i].id}"><i class="fas fa-star"></i></button>
				</div>
			`;
			}

			const botones = document.querySelectorAll('#trendingContainer .favorite-icon');
			botones.forEach(function (unBoton) {
				unBoton.addEventListener('click', function () {
					let idsEnFavoritos = localStorage.getItem('favoritos');
					if (!idsEnFavoritos) {
						localStorage.setItem('favoritos', JSON.stringify([this.dataset.id]));
					} else {
						idsEnFavoritos = JSON.parse(idsEnFavoritos);
						if (!idsEnFavoritos.includes(this.dataset.id)) {
							idsEnFavoritos.push(this.dataset.id);
							localStorage.setItem('favoritos', JSON.stringify(idsEnFavoritos));
						}
					}
				})
			})
		});
}

// Formulario de búsqueda
const formularioBusqueda = document.querySelector('#formBusqueda');

const buscarGifs = function (e) {
	e.preventDefault(); // Para evitar que el formulario recarge la página
	let campoDeBusqueda = document.querySelector('#campoDeBusqueda');
	
	// Llamado a la api
	const endPointBuscar = 'https://api.giphy.com/v1/gifs/search?api_key=' + api_key + '&limit=12&offset=0&rating=G&lang=en&q=' + campoDeBusqueda.value;

	// limpiar el campo
	campoDeBusqueda.value = '';

	// Capturar el div resultadoBusqueda
	const divResultadoBusqueda = document.querySelector('#resultadosBusqueda');
	
	// Capturar el div resultsContainer
	const resultsContainer = document.querySelector('#resultsContainer');

	fetch(endPointBuscar)
		.then(function (response) {
			return response.json();
		})
		.then(function (info) {
			let arrayDeGifs = info.data;

			divResultadoBusqueda.style.display = 'block';
			resultsContainer.innerHTML = '';

			for (let i = 0; i < arrayDeGifs.length; i++) {	
				resultsContainer.innerHTML += `
				<div class="gif-box">
					<h4 class="gif-box-title"> ${arrayDeGifs[i].title.trim() ? arrayDeGifs[i].title : 'Gif sin título'} </h4>
					<div class="gif-box-image">
						<img src="${arrayDeGifs[i].images.fixed_height_downsampled.url}" alt="un gif sugerido">
					</div>
				</div>
			`;
			}
		})
var relatedTag = 'https://api.giphy.com/v1/trending/searches?api_key='+api_key ;

var tag_buttons = "";
var tagTaken = [];

	fetch(relatedTag).then(function (response){
			return response.json();
		})
		.then(function (info) {
			let arrayDeTags = info.data;
			
		for (let i = 0; i < 3; i++ ){
			
			var randomTag = arrayDeTags[Math.floor(Math.random() * 20)];

			
			while (tagTaken.indexOf(randomTag) != -1) {
				
				randomTag = arrayDeTags[Math.floor(Math.random() * 20)];
				
			}
			tagTaken[i] = randomTag;
			
				tag_buttons += "<button class='tag'><a onclick='searchTag(\""+randomTag+"\")'>#"+randomTag+"</a></button>";
				
		}
		document.getElementById("listaTagRelacionados").innerHTML = tag_buttons;
		
	})
}

function searchTag(tag){
	
	document.getElementById("campoDeBusqueda").value = tag;

	document.querySelector(".button").click();

	document.getElementById("listaTagRelacionados").innerHTML = "";
}



formularioBusqueda.onsubmit = buscarGifs;



// Cambio de tema de CSS
document.querySelector(".link-button").onclick = function(){
	if (document.querySelector(".nav li .dropdown").classList.contains("dropped")) {
		document.querySelector(".nav li .dropdown").style.display = "none";
		document.querySelector(".nav li .dropdown").classList.remove("dropped");
	}
	else{
		document.querySelector(".nav li .dropdown").style.display = "block";
		document.querySelector(".nav li .dropdown").classList.add("dropped");
		
	}
};

const dayThemeButton = document.querySelector('#dayTheme');
const nightThemeButton = document.querySelector('#nightTheme');
const mainCss = document.querySelector('#mainCSS');
var logoImg = document.querySelector(".logo-png");

dayThemeButton.addEventListener('click', function () {
	mainCss.setAttribute('href', 'css/styles.css');
	logoImg.src = "gifOS_UI/assets/logo.png";

	document.querySelector(".button").style.color = "#B4B4B4";
	document.querySelector(".button").style.backgroundColor = "#E6E6E6";
	document.querySelector(".link-create").style.color = "#000";
	document.querySelector(".link-button").style.color = "#000";
	document.querySelector(".mis-gifos-text").style.color = "#000";

});

nightThemeButton.addEventListener('click', function () {
	mainCss.setAttribute('href', 'css/night-styles.css')


	document.querySelector(".button").style.backgroundColor = "#EE3EFE";
	document.querySelector(".button").style.color = "#FFF";

	document.querySelector(".link-create").style.color = "#FFF";
	document.querySelector(".link-button").style.color = "#FFF";
	document.querySelector(".mis-gifos-text").style.color = "#FFF";



	
	var positionText = logoImg.src.indexOf("/gifOS_UI/");
	var srcImg = logoImg.src.substring(positionText+1);
	1111
	if (srcImg === "gifOS_UI/assets/logo.png" ) {
		logoImg.src = "gifOS_UI/assets/gifOF_logo_dark.png"
	}
		else {
		}
	
});


// Favoritos
const favoritesContainer = document.querySelector('#favoritesContainer');

if (favoritesContainer != null) {
	// 'https://api.giphy.com/v1/gifs/' + idDelGif + '?api_key=' + api_key;
	const idsEnLocal = JSON.parse(localStorage.getItem('favoritos'));
	
	if (idsEnLocal != null) {
		for (let i = 0; i < idsEnLocal.length; i++) {
			let endPoint = `https://api.giphy.com/v1/gifs/${idsEnLocal[i]}?api_key=${api_key}`;
			fetch(endPoint)
				.then(function (response) {
					return response.json();
				})
				.then(function (info) {
					console.log(info);
					
					let infoDelGif = info.data;

					favoritesContainer.innerHTML += `
					<div class="gif-box">
						<h4 class="gif-box-title"> ${infoDelGif.title.trim() ? infoDelGif.title : 'Gif sin título'} </h4>
						<div class="gif-box-image">
							<img src="${infoDelGif.images.fixed_height_downsampled.url}" alt="un gif sugerido">
						</div>
					</div>
				`;
				})
		}
	} else {
		favoritesContainer.innerHTML = '<h2>No has agregado favoritos</h2>';
	}
}