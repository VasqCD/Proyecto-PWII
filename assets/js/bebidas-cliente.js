let bebidas = [];
let categorias = new Set();

// Función para cargar bebidas y categorías
async function cargarBebidas() {
    try {
        // Obtener todas las bebidas con paginación
        let todasLasBebidas = [];
        let paginaBebidas = 1;
        let hayMasBebidasPaginas = true;

        while (hayMasBebidasPaginas) {
            const responseBebidas = await fetch(`http://localhost:3001/bebidas?pagina=${paginaBebidas}`);
            const dataBebidas = await responseBebidas.json();
            
            if (dataBebidas.bebidas && dataBebidas.bebidas.length > 0) {
                todasLasBebidas = [...todasLasBebidas, ...dataBebidas.bebidas];
                paginaBebidas++;
            } else {
                hayMasBebidasPaginas = false;
            }
        }
        
        bebidas = todasLasBebidas; // Actualizar variable global de bebidas

        // Obtener todas las categorías con paginación
        let todasLasCategorias = [];
        let paginaCategorias = 1;
        let hayMasCategoriasPaginas = true;

        while (hayMasCategoriasPaginas) {
            const responseCategorias = await fetch(`http://localhost:3001/categorias?pagina=${paginaCategorias}`);
            const dataCategorias = await responseCategorias.json();
            
            if (dataCategorias.categorias && dataCategorias.categorias.length > 0) {
                todasLasCategorias = [...todasLasCategorias, ...dataCategorias.categorias];
                paginaCategorias++;
            } else {
                hayMasCategoriasPaginas = false;
            }
        }

        categorias.clear();
        
        // Filtrar solo categorías de bebidas
        todasLasCategorias.forEach(categoria => {
            if (categoria.tipoCategoria === 'BEBIDAS' && categoria.estadoCategoria) {
                categorias.add(categoria.nombreCategoria);
            }
        });
        
        console.log('Bebidas cargadas:', bebidas.length); // Debug
        console.log('Categorías cargadas:', [...categorias]); // Debug
        
        renderizarCategorias();
        renderizarBebidas(bebidas);
    } catch (error) {
        console.error('Error al cargar bebidas y categorías:', error);
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
            <div class="custom-card ${obtenerClaseCategoria(bebida.categoriaBebida.nombreCategoria)}">
                <img src="http://localhost:3001${bebida.imagenBebida}" 
                     alt="${bebida.nombreBebida}" 
                     class="custom-img">
                <div class="custom-body">
                    <h5 class="custom-title">${bebida.nombreBebida}</h5>
                    <p class="custom-text">${bebida.descripcionBebida}</p>
                    <span class="custom-price">L. ${bebida.precioBebida}</span>
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
        'bebidas alcohólicas': 'bebidas-alcoholicas',
        'bebidas sin alcohol': 'bebidas-sin-alcohol',
        'bebidas gaseosas': 'bebidas-gaseosas',
        'bebidas naturales': 'bebidas-naturales',
        'cafés': 'cafes',
        'tés': 'tes',
        'smoothies': 'smoothies',
        'jugos': 'jugos',
        'cocteles': 'cocteles'
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