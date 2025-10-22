// scripts.js

// Scroll hacia detalles
document.getElementById('scroll-btn').addEventListener('click', () => {
  document.getElementById('details').scrollIntoView({ behavior: 'smooth' });
});

// RSVP
document.getElementById('rsvp-btn').addEventListener('click', function() {
  document.getElementById('rsvp-response').classList.remove('hidden');
  this.disabled = true;
  this.textContent = 'Confirmado';
});

// Música
const music = document.getElementById('wedding-music');
document.body.addEventListener('click', () => {
  music.play().catch(() => {});
});

// Libro de firmas de ejemplo
const guestbook = document.getElementById('guestbook-entries');
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

// Carrusel
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
let index = 0;

function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

nextBtn.addEventListener('click', () => {
  index = (index + 1) % slides.length;
  updateCarousel();
});

prevBtn.addEventListener('click', () => {
  index = (index - 1 + slides.length) % slides.length;
  updateCarousel();
});

// Obtener el parámetro 'id' desde la URL (por ejemplo: ?id=3)
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// Leer el JSON público desde GitHub
fetch("https://raw.githubusercontent.com/lilimidel/digital/main/naylayale/invitados.json")
  .then(res => {
    if (!res.ok) throw new Error("No se pudo leer el JSON");
    return res.json();
  })
  .then(data => {
    // Buscar el invitado por ID
    const invitado = data.find(item => item.id == id);

    if (invitado) {
      document.getElementById("nombre").textContent = invitado.nombre;
      document.getElementById("personas").textContent = invitado.personas;
    } else {
      document.getElementById("nombre").textContent = "Invitado no encontrado";
      document.getElementById("personas").textContent = "-";
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById("nombre").textContent = "Error al cargar datos";
    document.getElementById("personas").textContent = "-";
  });