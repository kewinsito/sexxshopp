// Configuración del carrusel automático
let currentIndex = 1;
const totalSlides = 3;

function autoSlide() {
    currentIndex++;
    if (currentIndex > totalSlides) {
        currentIndex = 1;
    }
    document.getElementById('slide-' + currentIndex).checked = true;
}

// Cambiar de imagen cada 3 segundos
setInterval(autoSlide, 3000);

document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los enlaces de navegación
    const links = document.querySelectorAll('.nav-link');
  
    // Agregar el evento de clic a cada enlace
    links.forEach(link => {
      link.addEventListener('click', function() {
        // Eliminar la clase 'active' de todos los enlaces
        links.forEach(link => link.classList.remove('active'));
        // Añadir la clase 'active' al enlace clickeado
        this.classList.add('active');
      });
    });
  });