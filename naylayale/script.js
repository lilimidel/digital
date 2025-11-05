document.addEventListener('DOMContentLoaded', () => {

  // ===== Scroll hacia detalles (si existe el botón) =====
  const scrollBtn = document.getElementById('scroll-btn');
  if(scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      const details = document.getElementById('details');
      if(details) details.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===== RSVP =====
  const rsvpBtn = document.getElementById('rsvp-btn');
  if(rsvpBtn) {
    rsvpBtn.addEventListener('click', () => {
      const response = document.getElementById('rsvp-response');
      if(response) response.classList.remove('hidden');
      rsvpBtn.disabled = true;
      rsvpBtn.textContent = 'Confirmado';
    });
  }

  // ===== Música =====
const audio = document.getElementById('wedding-song');
const floatingPlayer = document.getElementById('floating-music-player');
const playButton = document.getElementById('play-pause-button');

if (audio && playButton && floatingPlayer) {
  const playIcon = document.createElement('i');
  playIcon.classList.add('fas', 'fa-play');
  const pauseIcon = document.createElement('i');
  pauseIcon.classList.add('fas', 'fa-pause');

  function updateButtonIcon(isPaused) {
    playButton.innerHTML = '';
    playButton.appendChild(isPaused ? playIcon : pauseIcon);
  }

  updateButtonIcon(true);

  audio.addEventListener('play', () => {
    floatingPlayer.classList.add('pulsing');
    updateButtonIcon(false);
  });

  audio.addEventListener('pause', () => {
    floatingPlayer.classList.remove('pulsing');
    updateButtonIcon(true);
  });

  playButton.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(err => console.log('⚠️ Error al reproducir:', err));
    } else {
      audio.pause();
    }
  });
}


  // ===== Libro de firmas =====
  const guestbook = document.getElementById('guestbook-entries');
  if(guestbook) {
    const sampleEntries = [
      { nombre: 'Ana', mensaje: '¡Felicidades pareja hermosa!' },
      { nombre: 'Luis', mensaje: 'Les deseo lo mejor en esta nueva etapa.' }
    ];
    sampleEntries.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerHTML = `<strong>${entry.nombre}:</strong> ${entry.mensaje}`;
      guestbook.appendChild(div);
    });
  }

  // ===== Carrusel =====
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const indicatorsContainer = document.querySelector('.carousel-indicators');
let index = 0;
let autoplayInterval;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  indicatorsContainer.appendChild(dot);
  dot.addEventListener('click', () => goToSlide(i, true)); // true = pausa autoplay
});

const indicators = Array.from(indicatorsContainer.children);

function updateSlides() {
  slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  indicators.forEach((dot, i) => dot.classList.toggle('active', i === index));
}

function goToSlide(newIndex, stopAuto = false) {
  index = newIndex;
  updateSlides();
  if (stopAuto) resetAutoplay();
}

function nextSlide() {
  index = (index + 1) % slides.length;
  updateSlides();
}

function prevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  updateSlides();
}

/* ===== Autoplay ===== */
function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 2000); // cada 2 segundos
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

/* ===== Control táctil ===== */
let startX = 0;
let isDragging = false;
const threshold = 30;

slides.forEach(slide => {
  slide.addEventListener('mousedown', startDrag);
  slide.addEventListener('touchstart', startDrag);
  slide.addEventListener('mousemove', moveDrag);
  slide.addEventListener('touchmove', moveDrag);
  slide.addEventListener('mouseup', endDrag);
  slide.addEventListener('mouseleave', endDrag);
  slide.addEventListener('touchend', endDrag);
});

function startDrag(e) {
  isDragging = true;
  startX = e.pageX || e.touches[0].pageX;
  clearInterval(autoplayInterval); // pausa mientras arrastra
}

function moveDrag(e) {
  if (!isDragging) return;
  const currentX = e.pageX || e.touches[0].pageX;
  const diff = currentX - startX;

  if (diff < -threshold) { nextSlide(); isDragging = false; resetAutoplay(); }
  else if (diff > threshold) { prevSlide(); isDragging = false; resetAutoplay(); }
}

function endDrag() { isDragging = false; }

/* Inicializar */
updateSlides();
startAutoplay();

//inicio frase boda
 window.addEventListener("load", function() {
    const texto = `Dos caminos se unen, dos almas se encuentran, y comienza una nueva historia de amor. Queremos compartir contigo este día tan especial.`;

    const elemento = document.getElementById("fraseBoda");
    let i = 0;
    let escribiendo = false;

    function escribir() {
      if (i < texto.length) {
        const caracter = texto[i] === "\n" ? "<br>" : texto[i];
        elemento.innerHTML += caracter;
        i++;
        setTimeout(escribir, 45);
      } else {
        elemento.style.setProperty("animation", "none"); // opcional: detiene cursor
      }
    }

    // Observador para iniciar cuando el elemento esté visible
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !escribiendo) {
          escribiendo = true;
          escribir();
        }
      });
    }, { threshold: 0.2 }); // empieza al estar 20% visible

    observer.observe(elemento);
  });
//fin frase boda

//inicio titulo animado
window.addEventListener('load', () => {
    // Selecciona todos los elementos que quieras animar con scroll
    const targets = Array.from(document.querySelectorAll('.animate-on-scroll'));

    if (targets.length === 0) return;

    // Opciones del observer: rootMargin adelanta/atrasa la activación
    const options = {
      root: null, // si tu elemento está dentro de un contenedor con scroll, sustituye null por ese elemento (ver nota abajo)
      rootMargin: '0px 0px -10% 0px', // activa un poco antes de que esté totalmente centrado
      threshold: 0.15 // con 15% visible empezará la animación
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // desactivamos la observación para que no vuelva a dispararse
        }
      });
    }, options);

    // Observa cada elemento y además dispara la animación si ya está en pantalla
    targets.forEach(el => {
      // seguridad: si el elemento ya tiene visible (por algún motivo), lo ponemos visible
      if (isElementInViewport(el)) {
        el.classList.add('visible');
        return;
      }
      observer.observe(el);
    });

    // Helper: detecta si ya está visible en el viewport (fallback)
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right > 0
      );
    }

    // DEBUG opcion (descomenta si quieres probar)
    // console.log('Animables detectadas:', targets.length);
  });
//fin titulo animado

/*nombres animados*/
 window.addEventListener("load", function() {
    const elementos = document.querySelectorAll(
      ".nombres-container .nombre, .nombre-novio, .simbolo, .texto-bendicion, .padres"
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible-scroll"); // entra
        } else {
          entry.target.classList.remove("visible-scroll"); // sale y se reinicia
        }
      });
    }, { threshold: 0.2 });

    elementos.forEach(el => observer.observe(el));
  });
/*fin nombres animados*/

  // ===== Lectura de invitado desde JSON =====
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  fetch("https://raw.githubusercontent.com/lilimidel/data-updates/main/naylayale/invitados.json")
  .then(res => res.json())
  .then(data => {
    const invitado = data.find(item => item.id == id);
    const nombreEl = document.getElementById("nombre");
    const personasEl = document.getElementById("personas");

    if (invitado) {
      if(nombreEl) nombreEl.textContent = invitado.nombre;
      if(personasEl) personasEl.textContent = invitado.personas;

      // Ajustar máximo de acompañantes basado en pases
      const select = document.getElementById("acompanantes");
      const hiddenInput = document.getElementById("acompanantesHidden");
      const maxInvitados = parseInt(invitado.personas) || 1;

      // Limpiar opciones previas y crear solo hasta max
      select.innerHTML = "";
      for (let i = 1; i <= maxInvitados; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
      }
      hiddenInput.value = select.value;

      // Actualizar hidden cuando cambie
      select.addEventListener("change", () => {
        hiddenInput.value = select.value;
      });

    } else {
      if(nombreEl) nombreEl.textContent = "Invitado no encontrado";
      if(personasEl) personasEl.textContent = "-";
    }
  })
  .catch(err => {
    console.error(err);
    const nombreEl = document.getElementById("nombre");
    const personasEl = document.getElementById("personas");
    if(nombreEl) nombreEl.textContent = "Error al cargar datos";
    if(personasEl) personasEl.textContent = "-";
  });


  // ===== Contador regresivo =====
  const DATE_TARGET = new Date('2025-12-13T18:00:00');
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    if(!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const now = new Date();
    const duration = DATE_TARGET - now;

    if(duration <= 0) {
      daysEl.textContent = "0";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const d = Math.floor(duration / (1000*60*60*24));
    const h = Math.floor((duration / (1000*60*60)) % 24);
    const m = Math.floor((duration / (1000*60)) % 60);
    const s = Math.floor((duration / 1000) % 60);

    daysEl.textContent = d;
    hoursEl.textContent = h.toString().padStart(2,'0');
    minutesEl.textContent = m.toString().padStart(2,'0');
    secondsEl.textContent = s.toString().padStart(2,'0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

});


//inicio intinerario
const items = document.querySelectorAll('.timeline-item');

function checkTimelineItems() {
  const triggerBottom = window.innerHeight * 0.85;

  items.forEach(item => {
    const itemTop = item.getBoundingClientRect().top;

    if(itemTop < triggerBottom) {
      item.classList.add('active');
    }
  });
}

window.addEventListener('scroll', checkTimelineItems);
window.addEventListener('load', checkTimelineItems);

//fin intinerario

//reservaciones 


//fin reservaciones


// Activar animación al hacer scroll
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".galeria-item");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));
});
//FIN ANIMACION AL HACER SCROLL