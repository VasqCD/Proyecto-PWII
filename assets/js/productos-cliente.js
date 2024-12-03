let productos = [];
let categorias = new Set();

// Función para cargar productos y categorías
async function cargarProductos() {
    try {
        const response = await fetch('http://localhost:3001/productos');
        const data = await response.json();
        productos = data.productos;
        
        // Extraer categorías únicas de los productos
        productos.forEach(producto => {
            if (producto.categoriaProducto?.nombreCategoria) {
                categorias.add(producto.categoriaProducto.nombreCategoria);
            }
        });
        
        renderizarCategorias();
        renderizarProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Función para renderizar botones de categorías
function renderizarCategorias() {
    const container = document.getElementById('categorias-container');
    container.innerHTML = `
        <button class="btn-estilo btn-spacing" onclick="filterProducts('all')">
            Todos
        </button>
    `;

    categorias.forEach(categoria => {
        const claseCategoria = obtenerClaseCategoria(categoria);
        const boton = `
            <button class="btn-estilo btn-spacing" onclick="filterProducts('${claseCategoria}')">
                ${categoria}
            </button>
        `;
        container.innerHTML += boton;
    });
}

// Función para renderizar productos
function renderizarProductos(productos) {
    const contenedor = document.getElementById('productos-container');
    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const card = `
            <div class="card ${obtenerClaseCategoria(producto.categoriaProducto.nombreCategoria)}">
                <img src="http://localhost:3001${producto.imagenProducto}" 
                     alt="${producto.nombreProducto}" />
                <div class="card-content">
                    <h3>${producto.nombreProducto}</h3>
                    <p>${producto.descripcionProducto}</p>
                    <div class="rating">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                    </div>
                    <span class="price">L. ${producto.precioProducto}</span>
                    <button class="btn-estilo">Comprar ahora</button>
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
        'platos principales': 'platos-principales',
        'entradas': 'entradas',
        'postres': 'postres'
    };

    return mapeoClases[categoriaLower] || categoriaLower.replace(/\s+/g, '-');
}

// Función para filtrar productos
function filterProducts(category) {
    if (category === 'all') {
        renderizarProductos(productos);
        return;
    }

    const productosFiltrados = productos.filter(producto => {
        const categoriaClase = obtenerClaseCategoria(producto.categoriaProducto.nombreCategoria);
        return categoriaClase === category;
    });

    renderizarProductos(productosFiltrados);
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});


window.filterProducts = filterProducts;