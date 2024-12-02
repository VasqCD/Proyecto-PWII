
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const mode = urlParams.get('Mode');
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '../pages/login.html';
}

const form = document.querySelector('#usuarioForm');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const rolInput = document.querySelector('#rol');
const contenedorError = document.querySelector('#contenedor-error');

function cargarRoles() {
    fetch('http://localhost:3001/roles', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(roles => {
        rolInput.innerHTML = '<option value="">Seleccione un rol</option>';
        roles.forEach(rol => {
            const option = document.createElement('option');
            option.value = rol._id;
            option.textContent = rol.nombre;
            rolInput.appendChild(option);
        });
    })
    .catch(error => mostrarError('Error al cargar roles'));
}

// funcion para cargar datos del usuario
function cargarDatosUsuario() {
    if (mode === 'UPD' || mode === 'DLT') {
        fetch(`http://localhost:3001/usuarios/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener el usuario');
            return response.json();
        })
        .then(usuario => {
            nameInput.value = usuario.nombre;
            emailInput.value = usuario.email;
            if (usuario.nRol && usuario.nRol.length > 0) {
                rolInput.value = usuario.nRol[0]._id;
            }
            
            if (mode === 'DLT') {
                Array.from(form.elements).forEach(element => {
                    if (element.type !== 'submit') {
                        element.disabled = true;
                    }
                });
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.textContent = 'Eliminar Usuario';
                submitButton.classList.remove('btn-primary');
                submitButton.classList.add('btn-danger');
            }

            if (mode === 'UPD') {
                passwordInput.removeAttribute('required');
            }
        })
        .catch(error => mostrarError('Error al cargar el usuario'));
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
    
    let url, metodo, datos;

    if (mode === 'UPD') {
        url = `http://localhost:3001/usuarios/${id}`;
        metodo = 'PUT';
        datos = {
            nombre: nameInput.value,
            email: emailInput.value,
            nRol: [rolInput.value]
        };
        // Agregar password solo si se proporciona uno nuevo
        if (passwordInput.value) {
            datos.password = passwordInput.value;
        }
    } else if (mode === 'DLT') {
        url = `http://localhost:3001/usuarios/${id}`;
        metodo = 'DELETE';
    } else {
        // Para crear nuevo usuario
        url = 'http://localhost:3001/signup';
        metodo = 'POST';
        datos = {
            nombre: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            nRol: rolInput.value // Enviar solo el ID del rol
        };
    }

    fetch(url, {
        method: metodo,
        headers: {
            'Authorization': mode ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || data || 'Error al procesar la operación');
        }
        return data;
    })
    .then(data => {
        window.location.href = '../pages/usuarios.html';
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarError(error.message);
    });
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const titulo = document.querySelector('.card-title');
    if (mode === 'UPD') {
        titulo.innerHTML = '<i class="fas fa-user-edit me-2"></i>Editar Usuario';
    } else if (mode === 'DLT') {
        titulo.innerHTML = '<i class="fas fa-user-minus me-2"></i>Eliminar Usuario';
    } else {
        titulo.innerHTML = '<i class="fas fa-user-plus me-2"></i>Nuevo Usuario';
    }
    
    cargarRoles();
    cargarDatosUsuario();
});