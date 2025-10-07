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

  // Mensaje debajo del formulario
  const mensaje = document.createElement("p");
  mensaje.style.color = "green";
  mensaje.style.textAlign = "center";
  mensaje.style.marginTop = "10px";
  form.parentNode.appendChild(mensaje);

  const letrasAMax = { a:1, b:2, c:3, d:4, e:5, f:6, g:7 };

  function tryParseQueryString(qs) {
    if (!qs) return null;
    try {
      const params = new URLSearchParams(qs.replace(/^\?/, ""));
      const akm = params.get("akm");
      if (akm) return akm;
      // buscar URL codificada en parámetros típicos de redirección (u, url, redirect)
      const u = params.get("u") || params.get("url") || params.get("redirect");
      if (u) {
        try {
          const decoded = decodeURIComponent(u);
          const qIdx = decoded.indexOf("?");
          if (qIdx >= 0) return tryParseQueryString(decoded.substring(qIdx));
        } catch(e){}
      }
    } catch(e){}
    return null;
  }

  function extractAkm() {
    // 1) Desde search normal
    let akm = tryParseQueryString(window.location.search);
    if (akm) return akm;

    // 2) Desde hash (#)
    if (location.hash) {
      const h = location.hash.substring(1);
      // si el hash tiene formato ?akm=...
      if (h.includes("akm=") || h.includes("?")) {
        const maybe = tryParseQueryString(h.includes("?") ? h.substring(h.indexOf("?")) : h);
        if (maybe) return maybe;
      }
      // patrones tipo #/akm/a o #akm=a
      const m = h.match(/akm[=\/]([A-Za-z0-9-_]+)/i);
      if (m) return m[1];
      try {
        const decoded = decodeURIComponent(h);
        const maybe2 = tryParseQueryString(decoded);
        if (maybe2) return maybe2;
      } catch(e){}
    }

    // 3) Buscar URL codificada dentro de location.href (ej. wrapper de Facebook/IG)
    try {
      const href = location.href;
      // buscar fragmentos codificados como https%3A%2F%2F...
      const encMatch = href.match(/https?:%2F%2F[^&'"]+/i) || href.match(/https?:\/\/[^'"]+/i);
      if (encMatch) {
        try {
          const decoded = decodeURIComponent(encMatch[0]);
          const u = new URL(decoded);
          const maybe = u.searchParams.get("akm");
          if (maybe) return maybe;
        } catch(e){}
      }
    } catch(e){}

    // 4) Intentar document.referrer (a veces el wrapper deja la URL original ahí)
    try {
      const ref = document.referrer;
      if (ref) {
        try {
          const uRef = new URL(ref);
          const maybe = uRef.searchParams.get("akm");
          if (maybe) return maybe;
          const uParam = (new URLSearchParams(uRef.search)).get("u") || null;
          if (uParam) {
            try {
              const decoded = decodeURIComponent(uParam);
              const u2 = new URL(decoded);
              const maybe2 = u2.searchParams.get("akm");
              if (maybe2) return maybe2;
            } catch(e){}
          }
        } catch(e){}
      }
    } catch(e){}

    return null;
  }

  // Obtener akm: primero intentar extraer, si existe guardarlo; si no, recuperar de localStorage
  let letra = extractAkm();
  if (letra) localStorage.setItem("akm", letra);
  else letra = localStorage.getItem("akm") || null;

  const maxInvitados = letrasAMax[letra?.toLowerCase()] || 7;

  // Aplicar el límite al select
  Array.from(select.options).forEach(option => {
    if (option.value !== "" && parseInt(option.value, 10) > maxInvitados) option.style.display = "none";
    else option.style.display = "";
  });

  // Si no se pudo obtener akm: mostrar fallback para abrir en navegador externo o ingresar manualmente
  if (!letra) {
    const fallbackBar = document.createElement("div");
    fallbackBar.style.background = "#fff7e6";
    fallbackBar.style.border = "1px solid #ffd27a";
    fallbackBar.style.padding = "10px";
    fallbackBar.style.textAlign = "center";
    fallbackBar.style.marginTop = "10px";
    fallbackBar.innerHTML = `
      <div>Si el código no aparece automáticamente en tu celular, <a id="openExternal" href="#">abre este enlace en tu navegador</a> o ingresa tu código manualmente:</div>
      <div style="margin-top:8px;">
        <input id="manualAkm" placeholder="ej: a" style="padding:6px; width:80px;" />
        <button id="applyAkm" type="button" style="padding:6px;">Aplicar</button>
      </div>
    `;
    form.parentNode.insertBefore(fallbackBar, form.nextSibling);

    document.getElementById("openExternal").addEventListener("click", (ev) => {
      ev.preventDefault();
      // intentar abrir en nueva pestaña (muchas apps abrirán en navegador externo)
      window.open(window.location.href, "_blank", "noopener,noreferrer");
      alert("Si la app interna borra parámetros, prueba abriendo este enlace en Chrome o Safari.");
    });

    document.getElementById("applyAkm").addEventListener("click", () => {
      const val = document.getElementById("manualAkm").value.trim().toLowerCase();
      if (val && letrasAMax[val]) {
        letra = val;
        localStorage.setItem("akm", letra);
        const max = letrasAMax[letra];
        Array.from(select.options).forEach(option => {
          if (option.value !== "" && parseInt(option.value,10) > max) option.style.display='none';
          else option.style.display='';
        });
        mensaje.textContent = 'Código aplicado: ' + letra;
      } else {
        alert('Código inválido. Ejemplo: a, b, c...');
      }
    });
  }

  // Mantener el input hidden sincronizado
  select.addEventListener("change", () => { hiddenInput.value = select.value; });

  // Envía (mantén tu validación original)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const asistenciaRadios = document.getElementsByName("entry.1782443328");
    let asistencia = "";
    for (let radio of asistenciaRadios) { if (radio.checked) { asistencia = radio.value; break; } }
    const telefonoPattern = /^\d{10}$/;
    if (!telefonoPattern.test(telefono)) { alert("Ingresa un número de teléfono válido de 10 dígitos."); return; }
    if (!nombre || !asistencia || !select.value) { alert("Por favor llena todos los campos requeridos antes de enviar."); return; }
    hiddenInput.value = select.value;
    const url = "https://docs.google.com/forms/u/0/d/e/1FAIpQLScq5NnC41Z2084JKUXn9FKa37_SubxvQdQ22w5XWhGvWhJ3Cw/formResponse";
    const formData = new FormData(form);
    fetch(url, { method: "POST", mode: "no-cors", body: formData })
      .then(() => { mensaje.textContent = "¡Gracias! Tu confirmación ha sido enviada."; form.reset(); })
      .catch(() => { mensaje.textContent = "Hubo un error, por favor intenta de nuevo."; });
  });
});
