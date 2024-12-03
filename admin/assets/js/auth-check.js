(function() {
    const token = localStorage.getItem('token');
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    const publicPaths = ['/login.html']; // Removida la ruta /admin/pages/login.html
    const adminPaths = ['/admin/pages/usuarios.html'];
    const currentPath = window.location.pathname;

    // Redirigir a admin si ya está logueado y está en login
    if (token && publicPaths.some(path => currentPath.includes(path))) {
        window.location.href = '/admin/index.html';
        return;
    }

    // Redirigir a login si no hay token y no es ruta pública
    if (!token && !publicPaths.some(path => currentPath.includes(path))) {
        window.location.href = '/login.html'; // Actualizada la ruta de redirección
        return;
    }

    // Verificar acceso a rutas de admin
    if (adminPaths.some(path => currentPath.includes(path)) && !userRoles.includes('admin')) {
        window.location.href = '/admin/index.html';
        return;
    }
})();