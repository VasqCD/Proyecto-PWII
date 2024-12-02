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
                throw Error('La resouewsta no fue correcta');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            window.location.href = '/admin/home.html';
        })

        .catch(function (error) {
            console.log(error);
            contenedorError.textContent = 'Error al iniciar sesión usuario o contraseña incorrectos';
        });

});

// servicio de registro
const formRegister = document.querySelector('#registerFormSubmit');
const nombreInput = document.querySelector('#registerName');
const emailRegisterInput = document.querySelector('#registerEmail');
const passwordRegisterInput = document.querySelector('#registerPassword');
const rolInput = document.querySelector('#registerRol');
const contenedorErrorRegister = document.querySelector('#contenedor-error-register');

formRegister.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = nombreInput.value;
    const email = emailRegisterInput.value;
    const password = passwordRegisterInput.value;
    const nRol = rolInput.value;

    fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password, nRol })
    })
        .then(response => {
            if (!response.ok) {
                throw Error('La resouewsta no fue correcta');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            window.location.href = '/admin/home.html';
        })

        .catch(function (error) {
            console.log(error);
            contenedorErrorRegister.textContent = 'Error al registrar usuario';
        }
        );
});
