// --- Script para el Conteo Regresivo (fuera del DOMContentLoaded) ---
const DATE_TARGET = new Date('12/19/2025 18:00:00'); // <--- CAMBIA ESTA FECHA

function updateCountdown() {
    const now = new Date();
    const duration = DATE_TARGET - now;

    // Si la boda ya pasó, muestra ceros
    if (duration < 0) {
        document.getElementById("days").textContent = "0";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        return;
    }

    const d = Math.floor(duration / (1000 * 60 * 60 * 24));
    const h = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const m = Math.floor((duration / (1000 * 60)) % 60);
    const s = Math.floor((duration / 1000) % 60);

    // Asegúrate de que los elementos existan antes de intentar actualizar su contenido
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl && hoursEl && minutesEl && secondsEl) {
        daysEl.textContent = d;
        hoursEl.textContent = h.toString().padStart(2, '0');
        minutesEl.textContent = m.toString().padStart(2, '0');
        secondsEl.textContent = s.toString().padStart(2, '0');
    }
}

// Actualiza el contador cada segundo
setInterval(updateCountdown, 1000);

// Llama a la función una vez para que se muestre de inmediato
updateCountdown();

// --------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // --- Script para el desplazamiento suave ---
    const scrollButton = document.getElementById('scroll-button');
    if (scrollButton) {
        scrollButton.addEventListener('click', function(event) {
            event.preventDefault();
            document.getElementById('nuestra-historia').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // --- Script para el reproductor de audio con pulsación ---
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
            if (isPaused) {
                playButton.appendChild(playIcon);
            } else {
                playButton.appendChild(pauseIcon);
            }
        }

        // Inicializa el ícono del botón
        updateButtonIcon(true);

        // Agrega la clase 'pulsing' cuando se reproduce
        audio.addEventListener('play', () => {
            floatingPlayer.classList.add('pulsing');
            updateButtonIcon(false);
        });

        // Remueve la clase 'pulsing' cuando se pausa o termina
        audio.addEventListener('pause', () => {
            floatingPlayer.classList.remove('pulsing');
            updateButtonIcon(true);
        });

        audio.addEventListener('ended', () => {
            floatingPlayer.classList.remove('pulsing');
            updateButtonIcon(true);
        });

        // Controla la reproducción al hacer clic en el botón
        playButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        });
        
    }
});
const card = document.getElementById("card");

// Toggle con click (para móviles)
card.addEventListener("click", () => {
  card.classList.toggle("clicked");
});

// En PC: quitar el volteo al salir el mouse
card.addEventListener("mouseleave", () => {
  if (window.matchMedia("(hover: hover)").matches) {
    card.classList.remove("clicked");
  }
});


(function(){
  const wrapper = document.getElementById('countdownWrapper');
  if (!wrapper) return;

  const speed = 0.35; 
  let ticking = false;

  function updateBackground(){
    const rect = wrapper.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const offset = Math.round(-rect.top * speed);
      wrapper.style.setProperty('--bg-pos', `${offset}px`);
    }
    ticking = false;
  }

  function onScrollOrResize(){
    if (!ticking) {
      window.requestAnimationFrame(updateBackground);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
  updateBackground();
})();
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".rsvp-form");
  const select = document.getElementById("acompanantes");
  const hiddenInput = document.getElementById("acompanantesHidden");

  // Diccionario: letra -> cantidad máxima
  const letrasAMax = { a:1, b:2, c:3, d:4, e:5, f:6, g:7 };

  // Leer parámetro akm de la URL
  function getAkmFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("akm");
  }

  // Obtener akm (URL > localStorage)
  let akm = getAkmFromUrl();
  if (akm) {
    localStorage.setItem("akm", akm.toLowerCase());
  } else {
    akm = localStorage.getItem("akm");
  }

  // Si hay un código válido, ajustar el máximo
  let maxInvitados = 7;
  if (akm && letrasAMax[akm.toLowerCase()]) {
    maxInvitados = letrasAMax[akm.toLowerCase()];
  }

  // Mostrar/ocultar opciones del select según el límite
  Array.from(select.options).forEach(option => {
    if (option.value !== "" && parseInt(option.value, 10) > maxInvitados) {
      option.style.display = "none";
    } else {
      option.style.display = "";
    }
  });

  // Sincronizar campo oculto
  select.addEventListener("change", () => {
    hiddenInput.value = select.value;
  });

  // Enviar formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const asistenciaRadios = document.getElementsByName("entry.1782443328");

    let asistencia = "";
    for (let radio of asistenciaRadios) {
      if (radio.checked) asistencia = radio.value;
    }

    if (!nombre || !telefono || !asistencia || !select.value) {
      alert("Por favor llena todos los campos antes de enviar.");
      return;
    }

    const telefonoPattern = /^\d{10}$/;
    if (!telefonoPattern.test(telefono)) {
      alert("Ingresa un número de teléfono válido de 10 dígitos.");
      return;
    }

    hiddenInput.value = select.value;

    const url = "https://docs.google.com/forms/u/0/d/e/1FAIpQLScq5NnC41Z2084JKUXn9FKa37_SubxvQdQ22w5XWhGvWhJ3Cw/formResponse";
    const formData = new FormData(form);
    fetch(url, { method: "POST", mode: "no-cors", body: formData })
      .then(() => {
        alert("¡Gracias! Tu confirmación ha sido enviada.");
        form.reset();
      })
      .catch(() => {
        alert("Hubo un error, por favor intenta de nuevo.");
      });
  });
});
