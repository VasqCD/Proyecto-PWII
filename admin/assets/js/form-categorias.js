
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const mode = urlParams.get('Mode');
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '../pages/login.html';
}

const form = document.querySelector('#categoriaForm');
const nameInput = document.querySelector('#name');
const descriptionInput = document.querySelector('#description');
const typeInput = document.querySelector('#type');
const statusInput = document.querySelector('#status');
const contenedorError = document.querySelector('#contenedor-error');

function cargarDatosCategoria() {
    if (mode === 'UPD' || mode === 'DLT') {
        fetch(`http://localhost:3001/categorias/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener la categoría');
            return response.json();
        })
        .then(categoria => {
            nameInput.value = categoria.nombreCategoria;
            descriptionInput.value = categoria.descripcionCategoria;
            typeInput.value = categoria.tipoCategoria;
            statusInput.value = categoria.estadoCategoria ? "1" : "0";
            
            if (mode === 'DLT') {
                Array.from(form.elements).forEach(element => {
                    if (element.type !== 'submit') {
                        element.disabled = true;
                    }
                });
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.textContent = 'Eliminar Categoría';
                submitButton.classList.remove('btn-primary');
                submitButton.classList.add('btn-danger');
            }
        })
        .catch(error => mostrarError('Error al cargar la categoría'));
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
    
    const data = {
        nombreCategoria: nameInput.value,
        descripcionCategoria: descriptionInput.value,
        tipoCategoria: typeInput.value,
        estadoCategoria: statusInput.value === "1"
    };

    let url = 'http://localhost:3001/categorias';
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al procesar la operación');
        window.location.href = '../pages/categorias.html';
    })
    .catch(error => mostrarError(error.message));
});

document.addEventListener('DOMContentLoaded', () => {
    const titulo = document.querySelector('.card-title');
    if (mode === 'UPD') {
        titulo.innerHTML = '<i class="fas fa-edit me-2"></i>Editar Categoría';
    } else if (mode === 'DLT') {
        titulo.innerHTML = '<i class="fas fa-trash-alt me-2"></i>Eliminar Categoría';
    } else {
        titulo.innerHTML = '<i class="fas fa-folder-plus me-2"></i>Nueva Categoría';
    }
    
    cargarDatosCategoria();
});