let bebidas = [];
let categorias = new Set();

// Función para cargar bebidas y categorías
async function cargarBebidas() {
    try {
        const response = await fetch('http://localhost:3001/bebidas');
        const data = await response.json();
        bebidas = data.bebidas;
        
        // Extraer categorías únicas de las bebidas
        bebidas.forEach(bebida => {
            if (bebida.categoriaBebida?.nombreCategoria) {
                categorias.add(bebida.categoriaBebida.nombreCategoria);
            }
        });
        
        renderizarCategorias();
        renderizarBebidas(bebidas);
    } catch (error) {
        console.error('Error al cargar bebidas:', error);
    }
}

// Función para renderizar botones de categorías
function renderizarCategorias() {
    const container = document.getElementById('categorias-container');
    container.innerHTML = `
        <button class="btn-estilo btn-spacing" onclick="filterBebidas('all')">
            Todos
        </button>
    `;

    categorias.forEach(categoria => {
        const claseCategoria = obtenerClaseCategoria(categoria);
        const boton = `
            <button class="btn-estilo btn-spacing" onclick="filterBebidas('${claseCategoria}')">
                ${categoria}
            </button>
        `;
        container.innerHTML += boton;
    });
}

// Función para renderizar bebidas
function renderizarBebidas(bebidas) {
    const contenedor = document.getElementById('bebidas-container');
    contenedor.innerHTML = '';

    bebidas.forEach(bebida => {
        const card = `
            <div class="custom-col">
                <div class="custom-card ${obtenerClaseCategoria(bebida.categoriaBebida.nombreCategoria)}">
                    <img src="http://localhost:3001${bebida.imagenBebida}" 
                         alt="${bebida.nombreBebida}" 
                         class="custom-img">
                    <div class="custom-body text-center">
                        <h5 class="custom-title text-dark fw-bold">${bebida.nombreBebida}</h5>
                        <p class="custom-text text-dark">${bebida.descripcionBebida}</p>
                        <span class="custom-price text-dark">L. ${bebida.precioBebida}</span>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += card;
    });
}

// Función para obtener clase CSS basada en la categoría
function obtenerClaseCategoria(categoria) {
    const categoriaLower = categoria.toLowerCase();
    const mapeoClases = {
        'bebidas calientes': 'bebidas-calientes',
        'bebidas frías': 'bebidas-frias',
        'bebidas alcohólicas': 'bebidas-alcoholicas'
    };

    return mapeoClases[categoriaLower] || categoriaLower.replace(/\s+/g, '-');
}

// Función para filtrar bebidas
function filterBebidas(category) {
    if (category === 'all') {
        renderizarBebidas(bebidas);
        return;
    }

    const bebidasFiltradas = bebidas.filter(bebida => {
        const categoriaClase = obtenerClaseCategoria(bebida.categoriaBebida.nombreCategoria);
        return categoriaClase === category;
    });

    renderizarBebidas(bebidasFiltradas);
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarBebidas();
});

window.filterBebidas = filterBebidas;