document.addEventListener('DOMContentLoaded', function () {
    // Cargar el menú
    fetch('/components/menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu-container').innerHTML = data;

            // Marcar el enlace activo
            const currentPage = window.location.pathname;
            const links = document.querySelectorAll('.nav-link');
            links.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });
        });

    // Cargar el footer
    fetch('/components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        });
});