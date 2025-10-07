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
