document.addEventListener("DOMContentLoaded", function() {
    let currentIndex = 0;
    const slides = document.querySelectorAll(".carousel-slide");

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = (i === index) ? "block" : "none";
        });
    }

    window.nextSlide = function() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    };

    window.prevSlide = function() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    };

    // mostrar primer foto
    showSlide(currentIndex);

    // para que avance cada 5 segundos
    setInterval(nextSlide, 5000);
});

//filrar productos por categoria 
function filterProducts(category) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

window.onload = function() {
    setTimeout(function() {
        alert("¡Promoción del mes! 10% de descuento en todos los pedidos mayores a L.500.");
    }, 4000);
};