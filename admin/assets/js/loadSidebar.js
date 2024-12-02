
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const isHomePage = path.endsWith('home.html') || path.endsWith('admin/');
    const sidebarPath = isHomePage ? './components/sidebar.html' : '../components/sidebar.html';
    
    // Agregar skeleton loading
    const sidebarContainer = document.getElementById('sidebar-container');
    sidebarContainer.innerHTML = getSkeletonHTML();
    
    // Intentar cargar desde cache primero
    const cachedSidebar = localStorage.getItem('sidebarContent');
    if (cachedSidebar) {
        sidebarContainer.innerHTML = cachedSidebar;
        setActiveLink();
    }
    
    // Cargar contenido actualizado
    fetch(sidebarPath)
        .then(response => response.text())
        .then(data => {
            // Actualizar cache
            localStorage.setItem('sidebarContent', data);
            
            // Solo actualizar si el contenido es diferente
            if (sidebarContainer.innerHTML !== data) {
                sidebarContainer.innerHTML = data;
            }
            
            setActiveLink();
        })
        .catch(error => console.error('Error cargando el sidebar:', error));
});

function setActiveLink() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('#sidebar .nav-link');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (path === href || path.endsWith(href)) {
            link.classList.add('active');
        }
    });
}

function getSkeletonHTML() {
    return `
        <aside class="bg-primary-gray text-white d-flex flex-column p-3" id="sidebar">
            <div class="text-center mb-4">
                <div class="skeleton-circle mx-auto"></div>
                <div class="skeleton-text mt-2"></div>
            </div>
            <nav class="nav flex-column flex-grow-1 justify-content-center">
                ${Array(5).fill().map(() => `
                    <div class="skeleton-link"></div>
                `).join('')}
            </nav>
            <div class="text-center mt-auto">
                <div class="skeleton-circle-sm mx-auto mb-2"></div>
                <div class="skeleton-text"></div>
            </div>
        </aside>
    `;
}