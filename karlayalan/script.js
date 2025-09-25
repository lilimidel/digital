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
