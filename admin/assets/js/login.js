

function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');

    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
    loginMessage.style.display = loginMessage.style.display === 'none' ? 'block' : 'none';
    registerMessage.style.display = registerMessage.style.display === 'none' ? 'block' : 'none';
}
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    

    if (token && window.location.pathname.includes('login.html')) {
        window.location.href = '/admin/index.html';
    }
});

// servicio de login 
const form = document.querySelector('#loginFormSubmit');
const emailInput = document.querySelector('#loginEmail');
const passwordInput = document.querySelector('#loginPassword');
const contenedorError = document.querySelector('#contenedor-error');

form.addEventListener('submit', e => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    fetch('http://localhost:3001/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw Error('La respuesta no fue correcta');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.nombre);
        localStorage.setItem('userRoles', JSON.stringify(data.user.roles));
        window.location.href = '/admin/index.html';
    })
    .catch(function (error) {
        console.log(error);
        contenedorError.textContent = 'Error al iniciar sesión usuario o contraseña incorrectos';
    });

});

// servicio de registro
const formRegister = document.querySelector('#registerFormSubmit');
const nombreInput = document.querySelector('#registerNombre'); // Corregido el ID
const emailRegisterInput = document.querySelector('#registerEmail');
const passwordRegisterInput = document.querySelector('#registerPassword');
const contenedorErrorRegister = document.querySelector('#contenedor-error-register');

formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Limpiar mensaje de error previo
    contenedorErrorRegister.innerHTML = '';
    
    const nombre = nombreInput.value;
    const email = emailRegisterInput.value;
    const password = passwordRegisterInput.value;

    try {
        const response = await fetch('http://localhost:3001/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al registrar usuario');
        }

        // Si el registro es exitoso
        localStorage.setItem('token', data.token);
        alert('Usuario registrado exitosamente');
        window.location.href = '/admin/index.html';

    } catch (error) {
        console.error('Error:', error);
        contenedorErrorRegister.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${error.message}
            </div>
        `;
    }
});
