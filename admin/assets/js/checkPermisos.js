function checkRoles() {
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    const isAdmin = userRoles.includes('admin');
    const isGerente = userRoles.includes('gerente');
    const isUser = userRoles.includes('user');

    // Usuario normal
    if (isUser && !isGerente && !isAdmin) {
        // Deshabilitar botones de acciones CRUD
        document.querySelectorAll('.btn-accion').forEach(btn => {
            btn.classList.add('disabled');
            btn.setAttribute('disabled', 'true');
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.6';
            btn.removeAttribute('href');
        });
        
        // Ocultar botones de nuevo
        document.querySelectorAll('.btn-nuevo').forEach(btn => {
            btn.style.display = 'none';
        });
    }

    // Ocultar SOLO el enlace de usuarios para roles no admin
    const usuariosLink = document.querySelector('a[href*="/admin/pages/usuarios.html"]');
    if (!isAdmin && usuariosLink) {
        usuariosLink.closest('.nav-link')?.remove();
    }
}

// Ejecutar después de que el sidebar se cargue
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkRoles, 200); // Aumentado el timeout para asegurar que el sidebar esté cargado
});

// Observer para cambios en la tabla
const observer = new MutationObserver(() => {
    checkRoles();
});

document.addEventListener('DOMContentLoaded', () => {
    const tabla = document.querySelector('#miTabla tbody');
    if (tabla) {
        observer.observe(tabla, { childList: true, subtree: true });
    }
});

// verificaer permisos especifico
function tienePermiso(accion) {
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    
    switch(accion) {
        case 'crear':
        case 'editar':
        case 'eliminar':
            return userRoles.includes('admin') || userRoles.includes('gerente');
        case 'ver_usuarios':
            return userRoles.includes('admin');
        default:
            return false;
    }
}

document.addEventListener('DOMContentLoaded', checkRoles);