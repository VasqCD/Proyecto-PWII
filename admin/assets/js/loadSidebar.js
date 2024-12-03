document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const isHomePage = path.endsWith('home.html') || path.endsWith('admin/');
    const sidebarPath = isHomePage ? './components/sidebar.html' : '../components/sidebar.html';
    
    fetch(sidebarPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
            
            const links = document.querySelectorAll('#sidebar .nav-link');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (path === href || path.endsWith(href)) {
                    link.classList.add('active');
                }
            });

            // Agregar el evento de logout DESPUÉS de cargar el sidebar
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    // Eliminar el token de autenticación del localStorage
                    localStorage.removeItem('token');
                    
                    // Redirigir al usuario a la página de login
                    window.location.href = '../../../index.html';
                });
            }
        })
        .catch(error => console.error('Error cargando el sidebar:', error));
});