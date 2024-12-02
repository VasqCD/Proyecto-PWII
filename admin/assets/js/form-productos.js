// Obtener parámetros y token
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const mode = urlParams.get('Mode');
const token = localStorage.getItem('token');

// Redirección si no hay token
if (!token) {
    window.location.href = '../pages/login.html';
}

// Referencias a elementos del DOM
const form = document.querySelector('#productoForm');
const productNameInput = document.querySelector('#name');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');
const priceInput = document.querySelector('#price');
const statusInput = document.querySelector('#status');
const imageInput = document.querySelector('#image');
const contenedorError = document.querySelector('#contenedor-error');

// Función para cargar categorías
function cargarCategorias(callback) {
    fetch('http://localhost:3001/categorias', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        categoryInput.innerHTML = '<option value="">Seleccione una categoría</option>';
        data.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria._id;
            option.textContent = categoria.nombreCategoria;
            categoryInput.appendChild(option);
        });
        if (typeof callback === 'function') {
            callback();
        }
    })
    .catch(error => mostrarError('Error al cargar categorías'));
}

// Función para cargar datos del producto
function cargarDatosProducto() {
    if (mode === 'UPD' || mode === 'DLT') {
        fetch(`http://localhost:3001/productos/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener el producto');
            return response.json();
        })
        .then(producto => {
            cargarCategorias(() => {
                productNameInput.value = producto.nombreProducto;
                descriptionInput.value = producto.descripcionProducto;
                priceInput.value = producto.precioProducto;
                categoryInput.value = producto.categoriaProducto._id;
                statusInput.value = producto.estadoProducto ? "1" : "0";
                
                if (producto.imagenProducto) {
                    const imagenActualDiv = document.querySelector('#imagenActual');
                    const imagenPreview = imagenActualDiv.querySelector('img');
                    imagenPreview.src = `http://localhost:3001${producto.imagenProducto}`;
                    imagenActualDiv.classList.remove('d-none');
                    imageInput.removeAttribute('required');
                }
                
                if (mode === 'DLT') {
                    // Deshabilitar todos los campos excepto el botón submit
                    Array.from(form.elements).forEach(element => {
                        if (element.type !== 'submit') {
                            element.disabled = true;
                        }
                    });
                    
                    // Cambiar el texto y estilo del botón
                    const submitButton = form.querySelector('button[type="submit"]');
                    submitButton.textContent = 'Eliminar Producto';
                    submitButton.classList.remove('btn-primary');
                    submitButton.classList.add('btn-danger');
                }
            });
        })
        .catch(error => mostrarError('Error al cargar el producto'));
    } else {
        cargarCategorias();
    }
}

// Función para mostrar errores
function mostrarError(mensaje) {
    contenedorError.classList.remove('d-none');
    contenedorError.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

// Manejo del envío del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('nombreProducto', productNameInput.value);
    formData.append('descripcionProducto', descriptionInput.value);
    formData.append('categoriaProducto', categoryInput.value);
    formData.append('precioProducto', priceInput.value);
    formData.append('estadoProducto', statusInput.value === "1");
    
    if (imageInput.files[0]) {
        formData.append('imagen', imageInput.files[0]);
    }

    let url = 'http://localhost:3001/productos';
    let metodo = 'POST';

    if (mode === 'UPD') {
        url += `/${id}`;
        metodo = 'PUT';
    } else if (mode === 'DLT') {
        url += `/${id}`;
        metodo = 'DELETE';
    }
    // Si no hay mode, será POST por defecto

    fetch(url, {
        method: metodo,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || 'Error al procesar la operación');
            });
        }
        window.location.href = '../pages/productos.html';
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarError(error.message);
    });
});

// Inicialización al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosProducto();
});

// titulo segun el modo
document.addEventListener('DOMContentLoaded', () => {
    const titulo = document.querySelector('.card-title');
    if (mode === 'UPD') {
        titulo.innerHTML = '<i class="fas fa-edit me-2"></i>Editar Producto';
    } else if (mode === 'DLT') {
        titulo.innerHTML = '<i class="fas fa-trash-alt me-2"></i>Eliminar Producto';
    } else {
        titulo.innerHTML = '<i class="fas fa-plus me-2"></i>Nuevo Producto';
    }

    cargarDatosProducto();
});