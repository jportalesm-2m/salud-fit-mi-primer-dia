/* =========================================================
   ⚙️ FUNCIONAMIENTO
   Puedes editar los textos de las situaciones en el HTML.
   Este bloque controla los botones y el recorrido.
   ========================================================= */


/* =========================================
   SALUD FIT | MI PRIMER DÍA
   JavaScript principal
========================================= */


/* =========================================
   1. VARIABLES GENERALES
========================================= */

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


/* =========================================
   2. NAVEGACIÓN ENTRE PANTALLAS
========================================= */

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

  let progressIndex = screens.indexOf(id);

  // Mantener el progreso durante la retroalimentación.
  if (id === 'retro') {
    progressIndex = screens.indexOf('situacion' + lastSituation);
  }

  if (progressFill) {
    const progress = progressIndex < 0
      ? 0
      : (progressIndex / (screens.length - 1)) * 100;

    progressFill.style.width = progress + '%';
  }

  if (progressText) {
    if (id === 'inicio') {
      progressText.textContent = 'Inicio';
    } else if (id === 'final') {
      progressText.textContent = 'Completado';
    } else if (id === 'retro') {
      progressText.textContent = 'Situación ' + lastSituation;
    } else {
      progressText.textContent = 'En progreso';
    }
  }

  // Registrar las situaciones visitadas.
  if (id.startsWith('situacion')) {
    visited.add(id);
    lastSituation = Number(id.replace('situacion', '')) || 1;
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


/* =========================================
   3. SELECCIÓN DEL PERSONAJE
========================================= */

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

  actualizarImagenesPersonaje();
}


/* =========================================
   4. ACTUALIZAR IMÁGENES DEL PERSONAJE
========================================= */

function actualizarImagenesPersonaje() {
  if (!selectedCharacterName) return;

  const character = selectedCharacterName;

  // Imagen de llegada.
  const arrivalImages = {
    Alex: 'IMAGENES/LLEGADAALEX.png',
    Sam: 'IMAGENES/LLEGADASAM.png',
    Chris: 'IMAGENES/LLEGADACHRIS.png'
  };

  const arrivalImage =
    document.getElementById('arrivalCharacterImage');

  if (arrivalImage && arrivalImages[character]) {
    arrivalImage.onerror = function () {
      console.error('No se pudo cargar la imagen de llegada:', this.src);
    };

    arrivalImage.src = arrivalImages[character];
    arrivalImage.alt = character + ' llegando al gimnasio';
  }

  // Imágenes de las cuatro situaciones.
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

  const characterScenes = situationImages[character];

  if (characterScenes) {
    Object.entries(characterScenes).forEach(([screenId, imagePath]) => {
      const image = document.querySelector(
        '#' + screenId + ' .story-scene-image'
      );

      if (!image) {
        console.warn('No se encontró la imagen en:', screenId);
        return;
      }

      image.onerror = function () {
        console.error('No se pudo cargar la imagen:', imagePath);
      };

      image.src = imagePath;
      image.alt = character + ' en ' + screenId;
      image.style.display = 'block';
    });
  }

  // Imagen de la pantalla final.
  const finalImages = {
    Alex: 'IMAGENES/IMAGENDELFINALALEX.png',
    Sam: 'IMAGENES/IMAGENDELFINALSAM.png',
    Chris: 'IMAGENES/IMAGENDELFINALCHRIS.png'
  };

  const finalImage = document.getElementById('finalCharacterImage');

  if (finalImage && finalImages[character]) {
    finalImage.onerror = function () {
      console.error('No se pudo cargar la imagen final:', this.src);
    };

    finalImage.src = finalImages[character];
    finalImage.alt =
      character + ' al finalizar su experiencia en el gimnasio';
  }
}


/* =========================================
   5. CONTINUAR DESPUÉS DE ELEGIR PERSONAJE
========================================= */

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


/* =========================================
   6. INFORMACIÓN DE LAS ZONAS DEL GIMNASIO
========================================= */

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


/* =========================================
   7. MOSTRAR INFORMACIÓN DE UNA ZONA
========================================= */

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


/* =========================================
   8. RETROALIMENTACIÓN DE LAS SITUACIONES
========================================= */

const feedbackData = {
  s1a: {
    s: 1,
    icon: '💜',
    label: 'Está bien reconocer lo que sientes',
    title: 'Puedes volver a intentarlo',
    text: 'Cuando estamos en un lugar nuevo podemos sentir que las personas nos observan más de lo que realmente lo hacen. Es comprensible querer salir cuando aparece la incomodidad.',
    tip: 'Recuerda: sentir inseguridad no significa que tu cuerpo no pertenezca al gimnasio.',
    next: 'situacion2'
  },

  s1b: {
    s: 1,
    icon: '🌱',
    label: 'Una estrategia posible',
    title: 'Puedes continuar a tu ritmo',
    text: 'Puedes sentir inseguridad y aun así continuar. Si te ayuda, enfócate en una actividad sencilla y recuerda que no puedes saber qué están pensando las otras personas.',
    tip: 'Tu cuerpo también merece ocupar este espacio.',
    next: 'situacion2'
  },

  s1c: {
    s: 1,
    icon: '🫶',
    label: 'Avanzar poco a poco también cuenta',
    title: 'Puedes darte tiempo',
    text: 'Hacer una pausa y observar el lugar puede ayudarte a familiarizarte con el entorno. No necesitas apresurarte ni esperar a tener un cuerpo diferente.',
    tip: 'Puedes comenzar con pasos pequeños, cuando te sientas preparado/a.',
    next: 'situacion2'
  },

  s2a: {
    s: 2,
    icon: '💡',
    label: 'Aprender es parte del proceso',
    title: 'No tienes que saberlo todo',
    text: 'Es comprensible querer intentarlo por tu cuenta. Sin embargo, usar una máquina sin conocer su funcionamiento puede ser inseguro; pide orientación si tienes dudas.',
    tip: 'Pedir ayuda es normal y puede hacer que te sientas más preparado/a.',
    next: 'situacion3'
  },

  s2b: {
    s: 2,
    icon: '🙌',
    label: 'Pedir ayuda es una buena estrategia',
    title: 'Puedes aprender con orientación',
    text: 'Preguntar al entrenador es una manera práctica de conocer el equipo y aprender a usarlo de forma segura.',
    tip: 'Nadie tiene que conocer todas las máquinas desde el primer día.',
    next: 'situacion3'
  },

  s2c: {
    s: 2,
    icon: '🌿',
    label: 'Puedes empezar por algo conocido',
    title: 'No tienes que hacerlo todo hoy',
    text: 'Está bien elegir una actividad que ya conoces. Si más adelante quieres probar esa máquina, puedes pedir que te expliquen cómo usarla.',
    tip: 'Aprender a tu ritmo también es avanzar.',
    next: 'situacion3'
  },

  s3a: {
    s: 3,
    icon: '💜',
    label: 'Tu valor no se mide por tu apariencia',
    title: 'Tu cuerpo no necesita compararse',
    text: 'Compararte puede hacer que te fijes solo en lo que crees que te falta. La experiencia, los objetivos y las circunstancias de cada persona son diferentes.',
    tip: 'No necesitas tener el cuerpo de otra persona para comenzar tu propio proceso.',
    next: 'situacion4'
  },

  s3b: {
    s: 3,
    icon: '🌟',
    label: 'Una perspectiva amable contigo',
    title: 'Cada persona tiene su proceso',
    text: 'Recordar que cada persona tiene su propio recorrido puede ayudarte a centrarte en lo que tú necesitas y en los objetivos que son importantes para ti.',
    tip: 'Tu progreso no tiene que parecerse al de nadie más.',
    next: 'situacion4'
  },

  s3c: {
    s: 3,
    icon: '🧭',
    label: 'Encuentra lo que funciona para ti',
    title: 'No necesitas imitar a los demás',
    text: 'Los ejercicios y el nivel de esfuerzo deben ajustarse a tus capacidades y objetivos. Si tienes dudas, consulta al entrenador.',
    tip: 'Tu entrenamiento debe ser adecuado para ti, no una competencia con otra persona.',
    next: 'situacion4'
  },

  s4a: {
    s: 4,
    icon: '🫶',
    label: 'Puedes intentarlo otro día',
    title: 'Una pausa no es un fracaso',
    text: 'Si decides salir, no significa que hayas fracasado. Puedes pensar qué te hizo sentir incómodo/a y regresar cuando te sientas preparado/a.',
    tip: 'No tienes que resolver todas tus inseguridades en un solo día.',
    next: 'final'
  },

  s4b: {
    s: 4,
    icon: '💧',
    label: 'Escuchar tus necesidades importa',
    title: 'Descansar también es válido',
    text: 'Tomar una pausa puede ayudarte a recuperar la calma. Después puedes decidir si quieres continuar, sin exigirte más de lo que puedes manejar.',
    tip: 'Avanza a tu ritmo y prioriza tu bienestar.',
    next: 'final'
  },

  s4c: {
    s: 4,
    icon: '🤝',
    label: 'Buscar apoyo también es cuidarte',
    title: 'No tienes que resolverlo todo a solas',
    text: 'Puedes contarle al entrenador que te sientes incómodo/a y pedir orientación sobre cómo continuar de una manera que te haga sentir más seguro/a.',
    tip: 'Pedir apoyo es una opción válida.',
    next: 'final'
  }
};


/* =========================================
   9. MOSTRAR LA RETROALIMENTACIÓN
========================================= */

function feedback(key) {
  const data = feedbackData[key];

  if (!data) {
    console.error('No se encontró la retroalimentación:', key);
    return;
  }

  currentFeedback = data;
  lastSituation = data.s;

  const icon = document.getElementById('feedbackIcon');
  const label = document.getElementById('feedbackLabel');
  const title = document.getElementById('feedbackTitle');
  const text = document.getElementById('feedbackText');
  const tip = document.getElementById('feedbackTip');
  const nextButton = document.getElementById('feedbackNext');

  if (icon) icon.textContent = data.icon;
  if (label) label.textContent = data.label;
  if (title) title.textContent = data.title;
  if (text) text.textContent = data.text;
  if (tip) tip.textContent = data.tip;

  if (nextButton) {
    nextButton.textContent =
      data.next === 'final' ? 'Ver cierre →' : 'Continuar →';
  }

  go('retro');
}


/* =========================================
   10. CONTINUAR DESPUÉS DE LA RETROALIMENTACIÓN
========================================= */

function nextAfterFeedback() {
  if (!currentFeedback || !currentFeedback.next) {
    console.error('No se ha definido la siguiente pantalla.');
    return;
  }

  const nextScreen = currentFeedback.next;

  currentFeedback = null;

  go(nextScreen);
}


/* =========================================
   11. REINICIAR LA EXPERIENCIA
========================================= */

function restart() {
  selectedAvatar = null;
  selectedCharacterName = null;
  currentFeedback = null;
  lastSituation = 1;

  visited.clear();

  // Quitar la selección de los personajes.
  document.querySelectorAll('.choice-card').forEach(card => {
    card.classList.remove('selected');
  });

  // Desactivar el botón de continuar hasta elegir un personaje.
  const continueButton = document.getElementById('continueCharacter');

  if (continueButton) {
    continueButton.disabled = true;
    continueButton.textContent = 'Selecciona un personaje →';
  }

  const requiredMessage =
    document.getElementById('characterRequiredMessage');

  if (requiredMessage) {
    requiredMessage.textContent =
      'Debes seleccionar un personaje para continuar.';
  }

  // Restablecer la información de las zonas.
  const zoneInfo = document.getElementById('zoneInfo');

  if (zoneInfo) {
    zoneInfo.replaceChildren();

    const title = document.createElement('strong');
    title.textContent = 'Selecciona un espacio';

    const description = document.createElement('p');
    description.textContent = 'La información aparecerá aquí.';

    zoneInfo.append(title, description);
  }

  // Volver a la pantalla inicial.
  go('inicio');
}
