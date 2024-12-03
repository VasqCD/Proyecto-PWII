// Modificar loadComponents.js
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

            // Verificar autenticación y mostrar botones correspondientes
            const token = localStorage.getItem('token');
            const btnRegister = document.querySelector('.btn-auth.register');
            const btnDashboard = document.querySelector('.btn-auth.dashboard');

            if (token) {
                btnRegister.classList.add('d-none');
                btnDashboard.classList.remove('d-none');
                // Actualizar href del botón dashboard
                btnDashboard.href = '/admin/index.html';
            } else {
                btnRegister.classList.remove('d-none');
                btnDashboard.classList.add('d-none');
            }
        });

    // Cargar el footer
    fetch('/components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        });
});