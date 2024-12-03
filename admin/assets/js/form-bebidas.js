
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const mode = urlParams.get('Mode');
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '../pages/login.html';
}

const form = document.querySelector('#bebidaForm');
const nameInput = document.querySelector('#name');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');
const priceInput = document.querySelector('#price');
const statusInput = document.querySelector('#status');
const imageInput = document.querySelector('#image');
const contenedorError = document.querySelector('#contenedor-error');

function cargarCategorias(callback) {
    // Primero obtener el total de páginas
    fetch('http://localhost:3001/categorias?limite=100', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener categorías');
        return response.json();
    })
    .then(data => {
        console.log('Categorías recibidas:', data);
        categoryInput.innerHTML = '<option value="">Seleccione una categoría</option>';
        
        // Filtrar categorías de bebidas
        const categoriasBebidas = data.categorias.filter(categoria => 
            categoria.tipoCategoria && 
            categoria.tipoCategoria.toUpperCase() === 'BEBIDAS'
        );

        console.log('Categorías de bebidas encontradas:', categoriasBebidas);

        categoriasBebidas.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria._id;
            option.textContent = categoria.nombreCategoria;
            categoryInput.appendChild(option);
        });

        console.log('Total opciones generadas:', 
            categoryInput.querySelectorAll('option').length - 1);

        if (typeof callback === 'function') {
            callback();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarError('Error al cargar categorías. Por favor, intente nuevamente.');
    });
}

function cargarDatosBebida() {
    if (mode === 'UPD' || mode === 'DLT') {
        fetch(`http://localhost:3001/bebidas/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener la bebida');
            return response.json();
        })
        .then(bebida => {
            cargarCategorias(() => {
                nameInput.value = bebida.nombreBebida;
                descriptionInput.value = bebida.descripcionBebida;
                priceInput.value = bebida.precioBebida;
                categoryInput.value = bebida.categoriaBebida._id;
                statusInput.value = bebida.estadoBebida ? "1" : "0";
                
                if (bebida.imagenBebida) {
                    const imagenActualDiv = document.querySelector('#imagenActual');
                    const imagenPreview = imagenActualDiv.querySelector('img');
                    imagenPreview.src = `http://localhost:3001${bebida.imagenBebida}`;
                    imagenActualDiv.classList.remove('d-none');
                    imageInput.removeAttribute('required');
                }
                
                if (mode === 'DLT') {
                    Array.from(form.elements).forEach(element => {
                        if (element.type !== 'submit') {
                            element.disabled = true;
                        }
                    });
                    const submitButton = form.querySelector('button[type="submit"]');
                    submitButton.textContent = 'Eliminar Bebida';
                    submitButton.classList.remove('btn-primary');
                    submitButton.classList.add('btn-danger');
                }
            });
        })
        .catch(error => mostrarError('Error al cargar la bebida'));
    } else {
        cargarCategorias();
    }
}

function mostrarError(mensaje) {
    contenedorError.classList.remove('d-none');
    contenedorError.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('nombreBebida', nameInput.value);
    formData.append('descripcionBebida', descriptionInput.value);
    formData.append('categoriaBebida', categoryInput.value);
    formData.append('precioBebida', priceInput.value);
    formData.append('estadoBebida', statusInput.value === "1");
    
    if (imageInput.files[0]) {
        formData.append('imagen', imageInput.files[0]);
    }

    let url = 'http://localhost:3001/bebidas';
    let metodo = 'POST';

    if (mode === 'UPD') {
        url += `/${id}`;
        metodo = 'PUT';
    } else if (mode === 'DLT') {
        url += `/${id}`;
        metodo = 'DELETE';
    }

    fetch(url, {
        method: metodo,
        headers: {
            'Authorization': `Bearer ${token}` 
        },
        body: formData 
    })
    .then(async response => {
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error al procesar la operación');
        }
        return response.json();
    })
    .then(data => {
        window.location.href = '../pages/bebidas.html';
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarError(error.message || 'Error al procesar la operación');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const titulo = document.querySelector('.card-title');
    if (mode === 'UPD') {
        titulo.innerHTML = '<i class="fas fa-edit me-2"></i>Editar Bebida';
    } else if (mode === 'DLT') {
        titulo.innerHTML = '<i class="fas fa-trash-alt me-2"></i>Eliminar Bebida';
    } else {
        titulo.innerHTML = '<i class="fas fa-glass-martini-alt me-2"></i>Nueva Bebida';
    }
    if (!tienePermiso('crear') && !tienePermiso('editar')) {
        window.location.href = '/admin/index.html';
        return;
    }
    
    cargarDatosBebida();
});