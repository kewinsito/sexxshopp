const signinform = document.querySelector('#signin-form');
const pushMessage = document.getElementById('pushMessage');

// Escuchamos el evento 'submit' en el formulario
signinform.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const email = signinform['loginEmail'].value
    const password = signinform['loginPassword'].value;

    try {
        // Iniciar sesión con Firebase Authentication
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        console.log(userCredentials);

        // Mensaje de éxito
        pushMessage.innerText = '¡Has iniciado sesión con éxito!';
        pushMessage.style.display = 'block';

        // Redirigir después de un breve retraso
        setTimeout(() => {
            pushMessage.style.display = 'none';
            window.location.href = 'PanAdmin.html';
        }, 2000);
    } catch (error) {
        // Manejo de errores
        const errorMessage = error.message;
        pushMessage.innerText = `Error: ${errorMessage}`;
        pushMessage.style.display = 'block';

        // Oculta el mensaje después de un breve retraso
        setTimeout(() => {
            pushMessage.style.display = 'none';
        }, 4000);
    }
});
