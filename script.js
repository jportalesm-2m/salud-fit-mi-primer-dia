/* =========================================================
   ⚙️ FUNCIONAMIENTO
   Puedes editar los textos de las situaciones en el HTML.
   Este bloque controla los botones y el recorrido.
   ========================================================= */
const screens = ['inicio','personaje','llegada','explorar','situacion1','situacion2','situacion3','situacion4','final'];
let selectedAvatar = null;
let selectedCharacterName = null;
let currentFeedback = null;
let lastSituation = 1;
let visited = new Set();

function go(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  const idx = screens.indexOf(id);
  document.getElementById('progressFill').style.width = (idx < 0 ? 0 : (idx/(screens.length-1))*100) + '%';
  document.getElementById('progressText').textContent =
    id === 'inicio' ? 'Inicio' : id === 'final' ? 'Completado' : 'En progreso';
  if (id === 'llegada') document.getElementById('arrivalAvatar').textContent = selectedAvatar;
  if (id === 'situacion1') document.getElementById('sceneAvatar1').textContent = selectedAvatar + ' 👀';
  if (id === 'final') document.getElementById('finalAvatar').textContent = selectedAvatar + ' 💜';
  window.scrollTo({top:0, behavior:'smooth'});
}
function selectAvatar(button, avatar) {
  document.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
  button.classList.add('selected');

  selectedAvatar = avatar;
  selectedCharacterName = button.querySelector('strong').textContent.trim();

  const continueButton = document.getElementById('continueCharacter');
  continueButton.disabled = false;
  continueButton.textContent = 'Continuar con ' + selectedCharacterName + ' →';

  document.getElementById('characterRequiredMessage').textContent =
    'Has elegido a ' + selectedCharacterName + '. Ya puedes continuar.';

  // Actualizar la imagen de llegada según el personaje elegido
  const arrivalImage = document.getElementById('arrivalCharacterImage');

  const arrivalImages = {
    Alex: 'IMAGENES/LLEGADAALEX.png',
    Sam: 'IMAGENES/LLEGADASAM.png',
    Chris: 'IMAGENES/LLEGADACHRIS.png'
 };

  if (arrivalImage && arrivalImages[selectedCharacterName]) {
    arrivalImage.src = arrivalImages[selectedCharacterName];
    arrivalImage.alt = selectedCharacterName + ' llegando al gimnasio';
  }

  // Actualizar las imágenes de las cuatro situaciones
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
        `#${screenId} .story-scene-image`
      );

      if (image) {
        image.src = imagePath;
        image.alt = selectedCharacterName + ' en ' + screenId;

        // Mostrar la imagen y comprobar si se carga correctamente
        image.style.display = 'block';

        image.onerror = function () {
          console.error('No se pudo cargar la imagen:', imagePath);
        };
      } else {
        console.warn(
          'No se encontró una imagen con la clase .story-scene-image en:',
          screenId
        );
      }
  // Actualizar la imagen final según el personaje elegido
  const finalImage = document.getElementById('finalCharacterImage');

  const finalImages = {
    Alex: 'IMAGENES/IMAGENDELFINALALEX.png',
    Sam: 'IMAGENES/IMAGENDELFINALSAM.png',
    Chris: 'IMAGENES/IMAGENDELFINALCHRIS.png'
  };

  if (finalImage && finalImages[selectedCharacterName]) {
    finalImage.src = finalImages[selectedCharacterName];
    finalImage.alt =
      selectedCharacterName + ' al finalizar su experiencia en el gimnasio';
  }

    });
  }
  } // Cierra selectAvatar()

function continueWithCharacter() {
  if (!selectedAvatar || !selectedCharacterName) {
    document.getElementById('characterRequiredMessage').textContent =
      'Primero debes seleccionar uno de los tres personajes.';
    return;
  }

  go('llegada');
}

function continueWithCharacter() {
  if (!selectedAvatar || !selectedCharacterName) {
    document.getElementById('characterRequiredMessage').textContent = 'Primero debes seleccionar uno de los tres personajes.';
    return;
  }
  go('llegada');
}

const zoneContent = {
  recepcion: ['Recepción','Aquí puedes preguntar sobre horarios, normas del gimnasio o pedir orientación.'],
  maquinas: ['Zona de máquinas','Encontrarás equipos diferentes. No necesitas saber utilizarlos todos desde el primer día; puedes pedir ayuda.'],
  cardio: ['Zona de cardio','Aquí puede haber caminadoras, bicicletas y otros equipos para moverte a tu propio ritmo.'],
  casilleros y SS. HH.: ['Casilleros y SS. HH.','Este espacio sirve para guardar tus pertenencias y utilizar los servicios higiénicos. Si tienes dudas, puedes consultar al personal.']
};
function showZone(zone) {
  const data = zoneContent[zone];
  document.getElementById('zoneInfo').innerHTML = '<strong>' + data[0] + '</strong><p>' + data[1] + '</p>';
}

const feedbackData = {
  s1a: {s:1, icon:'💜', label:'Está bien reconocer lo que sientes', title:'Puedes volver a intentarlo', text:'Cuando estamos en un lugar nuevo podemos sentir que las personas nos observan más de lo que realmente lo hacen. Es comprensible querer salir cuando aparece la incomodidad.', tip:'Recuerda: sentir inseguridad no significa que tu cuerpo no pertenezca al gimnasio.', next:'situacion2'},
  s1b: {s:1, icon:'🌱', label:'Una estrategia posible', title:'Puedes continuar a tu ritmo', text:'Puedes sentir inseguridad y aun así continuar. Si te ayuda, enfócate en una actividad sencilla y recuerda que no puedes saber qué están pensando las otras personas.', tip:'Tu cuerpo también merece ocupar este espacio.', next:'situacion2'},
  s1c: {s:1, icon:'🫶', label:'Avanzar poco a poco también cuenta', title:'Puedes darte tiempo', text:'Hacer una pausa y observar el lugar puede ayudarte a familiarizarte con el entorno. No necesitas apresurarte ni esperar a tener un cuerpo diferente.', tip:'Puedes comenzar con pasos pequeños, cuando te sientas preparado/a.', next:'situacion2'},
  s2a: {s:2, icon:'💡', label:'Aprender es parte del proceso', title:'No tienes que saberlo todo', text:'Es comprensible querer intentarlo por tu cuenta. Sin embargo, usar una máquina sin conocer su funcionamiento puede ser inseguro; pide orientación si tienes dudas.', tip:'Pedir ayuda es normal y puede hacer que te sientas más preparado/a.', next:'situacion3'},
  s2b: {s:2, icon:'🙌', label:'Pedir ayuda es una buena estrategia', title:'Puedes aprender con orientación', text:'Preguntar al entrenador es una manera práctica de conocer el equipo y aprender a usarlo de forma segura.', tip:'Nadie tiene que conocer todas las máquinas desde el primer día.', next:'situacion3'},
  s2c: {s:2, icon:'🌿', label:'Puedes empezar por algo conocido', title:'No tienes que hacerlo todo hoy', text:'Está bien elegir una actividad que ya conoces. Si más adelante quieres probar esa máquina, puedes pedir que te expliquen cómo usarla.', tip:'Aprender a tu ritmo también es avanzar.', next:'situacion3'},
  s3a: {s:3, icon:'💜', label:'Tu valor no se mide por tu apariencia', title:'Tu cuerpo no necesita compararse', text:'Compararte puede hacer que te fijes solo en lo que crees que te falta. La experiencia, los objetivos y las circunstancias de cada persona son diferentes.', tip:'No necesitas tener el cuerpo de otra persona para comenzar tu propio proceso.', next:'situacion4'},
  s3b: {s:3, icon:'🌟', label:'Una perspectiva amable contigo', title:'Cada persona tiene su proceso', text:'Recordar que cada persona tiene su propio recorrido puede ayudarte a centrarte en lo que tú necesitas y en los objetivos que son importantes para ti.', tip:'Tu progreso no tiene que parecerse al de nadie más.', next:'situacion4'},
  s3c: {s:3, icon:'🧭', label:'Encuentra lo que funciona para ti', title:'No necesitas imitar a los demás', text:'Los ejercicios y el nivel de esfuerzo deben ajustarse a tus capacidades y objetivos. Si tienes dudas, consulta al entrenador.', tip:'Tu entrenamiento debe ser adecuado para ti, no una competencia con otra persona.', next:'situacion4'},
  s4a: {s:4, icon:'🫶', label:'Puedes intentarlo otro día', title:'Una pausa no es un fracaso', text:'Si decides salir, no significa que hayas fracasado. Puedes pensar qué te hizo sentir incómodo/a y regresar cuando te sientas preparado/a.', tip:'No tienes que resolver todas tus inseguridades en un solo día.', next:'final'},
  s4b: {s:4, icon:'💧', label:'Escuchar tus necesidades importa', title:'Descansar también es válido', text:'Tomar una pausa puede ayudarte a recuperar la calma. Después puedes decidir si quieres continuar, sin exigirte más de lo que puedes manejar.', tip:'Avanza a tu ritmo y prioriza tu bienestar.', next:'final'},
  s4c: {s:4, icon:'🤝', label:'Buscar apoyo también es cuidarte', title:'No tienes que resolverlo todo a solas', text:'Puedes contarle al entrenador que te sientes incómodo/a y pedir orientación sobre cómo continuar de una manera que te haga sentir más seguro/a.', tip:'Pedir apoyo es una opción válida.', next:'final'}
};

function feedback(key) {
  currentFeedback = feedbackData[key];
  lastSituation = currentFeedback.s;
  document.getElementById('feedbackIcon').textContent = currentFeedback.icon;
  document.getElementById('feedbackLabel').textContent = currentFeedback.label;
  document.getElementById('feedbackTitle').textContent = currentFeedback.title;
  document.getElementById('feedbackText').textContent = currentFeedback.text;
  document.getElementById('feedbackTip').textContent = currentFeedback.tip;
  document.getElementById('feedbackNext').textContent = currentFeedback.next === 'final' ? 'Ver cierre →' : 'Continuar →';
  go('retro');
}
function nextAfterFeedback() {
  if (currentFeedback) go(currentFeedback.next);
}
function restart() {
  selectedAvatar = null;
  selectedCharacterName = null;
  currentFeedback = null;
  document.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
  const continueButton = document.getElementById('continueCharacter');
  if (continueButton) {
    continueButton.disabled = true;
    continueButton.textContent = 'Selecciona un personaje →';
  }
  const message = document.getElementById('characterRequiredMessage');
  if (message) message.textContent = 'Debes seleccionar un personaje para continuar.';
  go('inicio');
}
const arrivalCharacterImages = {
  Alex: "IMAGENES/LLEGADAALEX.png",
  Sam: "IMAGENES/LLEGADASAM.png",
  Chris: "IMAGENES/LLEGADACHRIS.png"
};

function updateArrivalCharacterImage(character) {
  const image = document.getElementById("arrivalCharacterImage");
  const selectedImage = arrivalCharacterImages[character];

  if (image && selectedImage) {
    image.src = selectedImage;
    image.alt = character + " llegando al gimnasio";
  }
}
