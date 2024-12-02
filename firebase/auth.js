
  auth.onAuthStateChanged(user => {
    if (!user && window.location.pathname !== '/index.html') {
        // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
        window.location.href = 'index.html';
    } else if (user) {
        // Si el usuario está autenticado, verificar si es administrador
        db.collection('Usuarios').doc(user.uid).get()
            .then(doc => {
                if (doc.exists && doc.data().admin) {
                    // Si es administrador y está en la página de inicio de sesión, redirigir a PanAdmin.html
                    if (window.location.pathname === '/index.html') {
                        window.location.href = 'PanAdmin.html';
                    }
                } else {
                    // Si no es administrador, redirigir a index.html si intenta acceder a la página de administración
                    if (window.location.pathname !== '/index.html') {
                        window.location.href = 'index.html';
                    }
                }
            })
            .catch(error => {
                console.error("Error al verificar el rol de administrador: ", error);
                // En caso de error, redirigir a la página de inicio de sesión como medida de seguridad
                window.location.href = 'index.html';
            });
    }
});