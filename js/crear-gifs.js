// Cambio de tema de CSS
const dayThemeButton = document.querySelector('#dayTheme');
const nightThemeButton = document.querySelector('#nightTheme');
const mainCss = document.querySelector('#mainCSS');

dayThemeButton.addEventListener('click', function () {
	mainCss.setAttribute('href', 'css/styles.css')
});

nightThemeButton.addEventListener('click', function () {
	mainCss.setAttribute('href', 'css/night-styles.css')
});

// Contenedores
const video = document.querySelector('#video');
const videoContent = document.querySelector('.video-content');
const videoCaptura = document.querySelector('.video-captura');
const gifPreview = document.querySelector('.gif-preview');

// Botones
const btnRec = document.querySelector('.video-rec');
const btnCaptura = document.querySelector('.boton-video-captura');
const btnDetenerCaptura = document.querySelector('#stopRecord');
const btnRepetir = document.querySelector('#repetir');
const btnSubir = document.querySelector('#subir');

// Paso 1 - Comenzar
btnRec.addEventListener('click', function () {
	videoContent.style.display = 'none';
	getStreamAndRecord();
})

btnRepetir.addEventListener('click', function () {
	gifPreview.style.display = 'none';
	videoContent.style.display = 'block';
	btnCaptura.style.display = 'inline-block';
	btnDetenerCaptura.style.display = 'none';
})


// Función para capturar webcam
function getStreamAndRecord() {
	navigator.mediaDevices.getUserMedia({
		audio: false,
		video: {
			height: { max: 480 }
		}
	})
	.then(function (stream) {
		// Contenedor
		videoCaptura.style.display = 'block';
		
		// Video
		video.srcObject = stream; 
		video.play();

		// Grabación
		const recorder = RecordRTC(stream, {
			type: 'gif',
			frameRate: 1,
			quality: 10,
			width: 360,
			hidden: 240
		});

		btnCaptura.addEventListener('click', function () {
			this.style.display = 'none';
			btnDetenerCaptura.style.display = 'inline-block';
			// Comenzar a grabar
			recorder.startRecording();
		})

		btnDetenerCaptura.addEventListener('click', function () {
			// Detener captura de la webcam
			stream.getTracks().forEach(function (track) {
				track.stop();
			});

			recorder.stopRecording(function () {
				videoCaptura.style.display = 'none';
				gifPreview.style.display = 'block';

				// Grabación en GIF
				let blob = recorder.getBlob();

				// URL para la imagen
				let gifURL = URL.createObjectURL(blob);	

				// Seteando el atributo SRC de la imagen con la URL del gif creado
				let img = gifPreview.querySelector('img');
				img.setAttribute('src', gifURL);

				// Subir el GIF
				let form = new FormData();
				form.append('file', blob, 'myGif.gif');
				
				btnSubir.addEventListener('click', function () {
					// Imagen de cargando
					img.setAttribute('src', 'images/cargando.gif');

					// Pedido a la API por POST
					fetch('https://upload.giphy.com/v1/gifs?api_key=iKhZFHfv2l7eWGP4Y79Ny12J2nwhGgmX', {
						method: 'POST',
						body: form
					})
						.then(function (respuesta) {
							return respuesta.json();
						})
						.then(function (datos) {
							console.log(datos);
							let status = datos.meta.status;
							if (status === 200) {
								let ver = confirm('Se subió el GIF correctamente. ¿Quieres verlo?');
								
								// Guardar el ID del GIF en localStorage
								let idsEnFavoritos = localStorage.getItem('favoritos');
								if (!idsEnFavoritos) {
									localStorage.setItem('favoritos', JSON.stringify([datos.data.id]));
								} else {
									idsEnFavoritos = JSON.parse(idsEnFavoritos);
									idsEnFavoritos.push(datos.data.id);
									localStorage.setItem('favoritos', JSON.stringify(idsEnFavoritos));
								}

								if(ver) {
									location.href = 'mis-gifos.html'
								} else {
									location.href = 'index.html';
								}
							}
						});
				})
			});
		})
	})
}

