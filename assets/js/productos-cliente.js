// productos-cliente.js
let productos = [];
let categorias = new Set();
let currentSlide = 0;

// Función para cargar productos y categorías
async function cargarProductos() {
    try {
        let todosLosProductos = [];
        let paginaProductos = 1;
        let hayMasProductosPaginas = true;

        while (hayMasProductosPaginas) {
            const responseProductos = await fetch(`http://localhost:3001/productos?pagina=${paginaProductos}`);
            const dataProductos = await responseProductos.json();
            
            if (dataProductos.productos && dataProductos.productos.length > 0) {
                todosLosProductos = [...todosLosProductos, ...dataProductos.productos];
                paginaProductos++;
            } else {
                hayMasProductosPaginas = false;
            }
        }
        
        productos = todosLosProductos;
        categorias.clear();
        
        productos.forEach(producto => {
            if (producto?.categoriaProducto?.nombreCategoria && producto.estadoProducto) {
                    categorias.add(producto.categoriaProducto.nombreCategoria);
            }
        });
        
        renderizarCategorias();
        renderizarProductos(productos);
        initCarousel(); // Inicializar el carrusel
    } catch (error) {
        console.error('Error al cargar productos y categorías:', error);
    }
}

// Funciones del carrusel
function showSlide(n) {
    const slides = document.getElementsByClassName('carousel-slide');
    
    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;
    
    for (const slide of slides) {
        slide.style.display = 'none';
    }
    
    slides[currentSlide].style.display = 'block';
}

function nextSlide() {
    showSlide(currentSlide + 1);
    currentSlide++;
}

function prevSlide() {
    showSlide(currentSlide - 1);
    currentSlide--;
}

function initCarousel() {
    showSlide(currentSlide);
    setInterval(nextSlide, 5000); // Cambiar slide cada 5 segundos
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

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});

window.filterProducts = filterProducts;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;