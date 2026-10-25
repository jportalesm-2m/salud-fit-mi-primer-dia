/* =========================================================
   ⚙️ FUNCIONAMIENTO
   Puedes editar los textos de las situaciones en el HTML.
   Este bloque controla los botones y el recorrido.
   ========================================================= */

const screens = [
  'inicio',
  'personaje',
  'llegada',
  'explorar',
  'situacion1',
  'situacion2',
  'situacion3',
  'situacion4',
  'final'
];

let selectedAvatar = null;
let selectedCharacterName = null;
let currentFeedback = null;
let lastSituation = 1;
const visited = new Set();

// NAVEGACIÓN ENTRE PANTALLAS
function go(id) {
  const target = document.getElementById(id);

  if (!target) {
    console.error('No se encontró la pantalla:', id);
    return;
  }

  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  target.classList.add('active');

  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const index = screens.indexOf(id);

  if (progressFill) {
    const progress = index < 0
      ? 0
      : (index / (screens.length - 1)) * 100;

    progressFill.style.width = progress + '%';
  }

  if (progressText) {
    progressText.textContent =
      id === 'inicio'
        ? 'Inicio'
        : id === 'final'
          ? 'Completado'
          : 'En progreso';
  }

  // Registrar las situaciones visitadas
  if (id.startsWith('situacion')) {
    visited.add(id);
    lastSituation = Number(id.replace('situacion', '')) || 1;
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


// SELECCIÓN DEL PERSONAJE
function selectAvatar(button, avatar) {
  if (!button) return;

  document.querySelectorAll('.choice-card').forEach(card => {
    card.classList.remove('selected');
  });

  button.classList.add('selected');

  selectedAvatar = avatar;

  const nameElement = button.querySelector('strong');
  selectedCharacterName = nameElement
    ? nameElement.textContent.trim()
    : '';

  const continueButton = document.getElementById('continueCharacter');

  if (continueButton) {
    continueButton.disabled = false;
    continueButton.textContent =
      'Continuar con ' + selectedCharacterName + ' →';
  }

  const requiredMessage =
    document.getElementById('characterRequiredMessage');

  if (requiredMessage) {
    requiredMessage.textContent =
      'Has elegido a ' + selectedCharacterName +
      '. Ya puedes continuar.';
  }

  // IMÁGENES DE LLEGADA
  const arrivalImages = {
    Alex: 'IMAGENES/LLEGADAALEX.png',
    Sam: 'IMAGENES/LLEGADASAM.png',
    Chris: 'IMAGENES/LLEGADACHRIS.png'
  };

  const arrivalImage =
    document.getElementById('arrivalCharacterImage');

  if (arrivalImage && arrivalImages[selectedCharacterName]) {
    arrivalImage.src = arrivalImages[selectedCharacterName];
    arrivalImage.alt =
      selectedCharacterName + ' llegando al gimnasio';

    arrivalImage.onerror = function () {
      console.error(
        'No se pudo cargar la imagen de llegada:',
        this.src
      );
    };
  }

  // IMÁGENES DE LAS SITUACIONES
  const situationImages = {
    Alex: {
      situacion1: 'IMAGENES/SITUACION1ALEX.png',
      situacion2: 'IMAGENES/SITUACION2ALEX.png',
      situacion3: 'IMAGENES/SITUACION3ALEX - copia.png',
      situacion4: 'IMAGENES/SITUACION4ALEX - copia.png'
    },

    Sam: {
      situacion1: 'IMAGENES/SITUACION1SAM.png',
      situacion2: 'IMAGENES/SITUACION2SAM.png',
      situacion3: 'IMAGENES/SITUACION3SAM - copia.png',
      situacion4: 'IMAGENES/SITUACION4SAM - copia.png'
    },

    Chris: {
      situacion1: 'IMAGENES/SITUACION1CHRIS.png',
      situacion2: 'IMAGENES/SITUACION2CHRIS.png',
      situacion3: 'IMAGENES/SITUACION3CHRIS - copia.png',
      situacion4: 'IMAGENES/SITUACION4CHRIS - copia.png'
    }
  };

  const characterScenes = situationImages[selectedCharacterName];

  if (characterScenes) {
    Object.entries(characterScenes).forEach(([screenId, imagePath]) => {
      const image = document.querySelector(
        '#' + screenId + ' .story-scene-image'
      );

      if (image) {
        image.onerror = function () {
          console.error('No se pudo cargar la imagen:', imagePath);
        };

        image.src = imagePath;
        image.alt =
          selectedCharacterName + ' en ' + screenId;

        image.style.display = 'block';
      } else {
        console.warn(
          'No se encontró .story-scene-image en:',
          screenId
        );
      }
    });
  }

  // IMAGEN DE LA PANTALLA FINAL
  const finalImages = {
    Alex: 'IMAGENES/IMAGENDELFINALALEX.png',
    Sam: 'IMAGENES/IMAGENDELFINALSAM.png',
    Chris: 'IMAGENES/IMAGENDELFINALCHRIS.png'
  };

  const finalImage =
    document.getElementById('finalCharacterImage');

  if (finalImage && finalImages[selectedCharacterName]) {
    finalImage.onerror = function () {
      console.error('No se pudo cargar la imagen final:', this.src);
    };

    finalImage.src = finalImages[selectedCharacterName];
    finalImage.alt =
      selectedCharacterName +
      ' al finalizar su experiencia en el gimnasio';
  }
}


// CONTINUAR DESPUÉS DE ELEGIR PERSONAJE
function continueWithCharacter() {
  if (!selectedAvatar || !selectedCharacterName) {
    const requiredMessage =
      document.getElementById('characterRequiredMessage');

    if (requiredMessage) {
      requiredMessage.textContent =
        'Primero debes seleccionar uno de los tres personajes.';
    }

    return;
  }

  go('llegada');
}


// INFORMACIÓN DE LAS ZONAS DEL GIMNASIO
const zoneContent = {
  recepcion: [
    'Recepción',
    'Aquí puedes solicitar información, consultar tus dudas y recibir orientación del personal del gimnasio.'
  ],

  maquinas: [
    'Zona de máquinas',
    'En esta zona encontrarás máquinas para realizar ejercicios de fuerza. Si no sabes cómo utilizar alguna, puedes pedir ayuda al personal.'
  ],

  cardio: [
    'Zona de cardio',
    'Aquí puedes realizar actividades como caminar en la cinta, utilizar la bicicleta estática o entrenar en la elíptica. Elige una actividad adecuada para ti.'
  ],

  casilleros: [
    'Casilleros y SS. HH.',
    'En este espacio puedes guardar tus pertenencias y utilizar los servicios higiénicos. Si tienes dudas, puedes consultar al personal.'
  ]
};


// MOSTRAR INFORMACIÓN DE UNA ZONA
function showZone(zone) {
  const data = zoneContent[zone];
  const zoneInfo = document.getElementById('zoneInfo');

  if (!data || !zoneInfo) {
    console.error('No se encontró la zona o el elemento:', zone);
    return;
  }

  zoneInfo.replaceChildren();

  const title = document.createElement('strong');
  title.textContent = data[0];

  const description = document.createElement('p');
  description.textContent = data[1];

  zoneInfo.append(title, description);
}
