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