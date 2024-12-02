function register() {
    const pushMessage = document.getElementById('pushMessage');
    pushMessage.style.display = 'block';

    setTimeout(() => {
        pushMessage.style.display = 'none';
        window.location.href = 'index.html'; // Redirigir a la página de inicio
    }, 2000);
}

function toggleLogin() {
    document.getElementById('loginForm').style.display = 'block'; // Mostrar formulario de inicio de sesión
    document.querySelector('.auth-box h2').innerText = 'Registro'; // Cambiar el título del registro
}

function toggleRegister() {
    document.getElementById('loginForm').style.display = 'none'; // Ocultar formulario de inicio de sesión
    document.querySelector('.auth-box h2').innerText = 'Iniciar Sesión'; // Cambiar el título de inicio de sesión
}

