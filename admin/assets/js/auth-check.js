
(function() {
    const token = localStorage.getItem('token');
    const publicPaths = ['/admin/pages/login.html'];
    const currentPath = window.location.pathname;

    // Si no hay token y no estamos en una ruta pública
    if (!token && !publicPaths.includes(currentPath)) {
        // Redirigir a la página de login
        window.location.href = '/admin/pages/login.html';
    }
})();