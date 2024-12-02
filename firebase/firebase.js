// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHMEaDhtxixycfamuEMC64t6Uy1GA5xoo",
  authDomain: "sexshopweb-c934a.firebaseapp.com",
  projectId: "sexshopweb-c934a",
  storageBucket: "sexshopweb-c934a.firebasestorage.app",
  messagingSenderId: "604810062898",
  appId: "1:604810062898:web:f0f41ce212544c5da3a02b"
};

// Inicialización de Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginForm = document.getElementById('signin-form');
const productForm = document.getElementById('product-form');
const pushMessage = document.getElementById('pushMessage');


//registro
function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const admin = false;

  auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
          // Usuario registrado correctamente
          const user = userCredential.user;
          alert('Usuario registrado con éxito');

          // Guardar usuario en la colección 'Usuarios' usando el uid como documento
          return db.collection('Usuarios').doc(user.uid).set({
              email: email,
              admin: admin
          });
      })
      .then(() => {
          alert("Guardado con éxito");

          // Limpiar los campos de entrada
          document.getElementById('email').value = '';
          document.getElementById('password').value = '';

          // Redirigir a la página de inicio
          window.location.href = 'index.html';
      })
      .catch(error => {
          alert(error.message);
      });
}


function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
          // Usuario autenticado con éxito
          const user = userCredential.user;

          // Referencia al documento del usuario en la colección 'Usuarios'
          return db.collection('Usuarios').doc(user.uid).get();
      })
      .then(doc => {
          if (doc.exists) {
              // Obtener el valor de admin desde el documento del usuario
              const isAdmin = doc.data().admin;
              
              // Mensaje de éxito
              const pushMessage = document.getElementById('pushMessage');
              pushMessage.innerText = '¡Has iniciado sesión con éxito!';
              pushMessage.style.display = 'block';

              // Redirigir después de un breve retraso
              setTimeout(() => {
                  pushMessage.style.display = 'none';
                  if (isAdmin) {
                      window.location.href = 'PanAdmin.html';
                  } else {
                      window.location.href = 'index.html';
                  }
              }, 1000);
          } else {
              alert("No se encontró la información del usuario");
          }
      })
      .catch(error => {
          alert(error.message);
      });
}

function logout() {
  auth.signOut()
      .then(() => {
        window.location.href = 'index.html';
      })
      .catch(error => alert(error.message));
}
function añadir() {
  const UrlProduct = document.getElementById('product-image').value;
  const nameProduct = document.getElementById('product-name').value;
  const precioProduct = document.getElementById('product-price').value;
  const cantidadProductStr = document.getElementById('product-cant').value;
  const cantidadProduct = parseInt(cantidadProductStr, 10);
if(UrlProduct=="" || nameProduct=="" || precioProduct=="" || cantidadProduct==""){
    alert("todos los campos deben estar llenitos")
}else{
  db.collection('Novedades').add({ UrlProduct, nameProduct, cantidadProduct , precioProduct })
      .then(docRef => {
        alert("Guardado con éxito");
          // Limpiar los campos de entrada
          document.getElementById('product-image').value = '';
          document.getElementById('product-name').value = '';
          document.getElementById('product-cant').value = '';
          document.getElementById('product-price').value = '';
      })
      .catch(error => alert(error.message));
    }
}
function añadirToys() {
    const IDProduct = document.getElementById('product-ID').value;
    const UrlProduct = document.getElementById('product-image').value;
    const nameProduct = document.getElementById('product-name').value;
    const precioProduct = document.getElementById('product-price').value;
    const cantidadProduct = document.getElementById('product-cant').value;

    if (UrlProduct === "" || nameProduct === "" || precioProduct === "" || cantidadProduct === "" || IDProduct ==="") {
        alert("Todos los campos deben estar llenos");
    } else {
        // Usar UrlProduct como ID del documento
        db.collection('Lenceria').doc(IDProduct).set({
            UrlProduct,
            nameProduct,
            cantidadProduct,
            precioProduct
        })
        .then(() => {
            alert("Guardado con éxito");
            // Limpiar los campos de entrada
            document.getElementById('product-ID').value = '';
            document.getElementById('product-image').value = '';
            document.getElementById('product-name').value = '';
            document.getElementById('product-cant').value = '';
            document.getElementById('product-price').value = '';
        })
        .catch(error => alert(error.message));
    }
}
function cargarBorEdi(){
    window.location.href="PanBorrarEditar.html"
   
}
// Función para cargar tareas
function loadTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  db.collection('Novedades').get().then(snapshot => {
    snapshot.forEach(doc => {
        const li = document.createElement('li');
        
        // Asigna dos valores específicos
        li.textContent = `Nombre: ${doc.data().nameProduct}, Precio: ${doc.data().precioProduct}`;

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => deleteTask(doc.id);
        li.appendChild(deleteButton);

        // Botón de actualizar
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Actualizar';
        updateButton.onclick = () => updateTask(doc.id);
        li.appendChild(updateButton);

        taskList.appendChild(li);
    });
});
}
// Función para eliminar una tarea
function deleteTask(id,refC) {
    db.collection(refC).doc(id).delete()
        .then(() => {
            loadTasks(); // Carga las tareas actualizadas (opcional si vas a recargar la página)
            location.reload(); // Recarga la página
        })
        .catch(error => alert(error.message));
  }
  
  // Función para actualizar una tarea
  function updateTask(id,refC) {
    // Función para solicitar un nombre válido o permitir omitirlo
    function solicitarNombre(actualNombre) {
        let nombre;
        do {
            nombre = prompt(`Ingrese el nuevo nombre o deje vacío para conservar el actual (${actualNombre}):`);
            if (nombre === '') return actualNombre; // Si el usuario deja vacío, se conserva el valor actual
            if (!nombre || nombre.trim() === '') {
                alert("El nombre no puede estar vacío si desea cambiarlo.");
            }
        } while (!nombre || nombre.trim() === '');
        return nombre.trim();
    }

    // Función para solicitar un precio válido o permitir omitirlo
    function solicitarPrecio(actualPrecio) {
        let precio;
        do {
            precio = prompt(`Ingrese el nuevo precio o deje vacío para conservar el actual (${actualPrecio}):`);
            if (precio === '') return actualPrecio; // Si el usuario deja vacío, se conserva el valor actual
            if (!esNumeroPositivo(precio)) {
                alert("El precio debe ser un número positivo si desea cambiarlo.");
            }
        } while (!esNumeroPositivo(precio) && precio !== '');
        return parseFloat(precio);
    }

    // Función para solicitar una cantidad válida o permitir omitirla
    function solicitarCantidad(actualCantidad) {
        let cantidad;
        do {
            cantidad = prompt(`Ingrese una nueva cantidad o deje vacío para conservar la actual (${actualCantidad}):`);
            if (cantidad === '') return actualCantidad; // Si el usuario deja vacío, se conserva el valor actual
            if (!esEnteroPositivo(cantidad)) {
                alert("La cantidad debe ser un número entero positivo si desea cambiarla.");
            }
        } while (!esEnteroPositivo(cantidad) && cantidad !== '');
        return parseInt(cantidad, 10);
    }

    // Función para verificar si un valor es un número positivo
    function esNumeroPositivo(valor) {
        const numero = Number(valor);
        return !isNaN(numero) && numero > 0;
    }

    // Función para verificar si un valor es un número entero positivo
    function esEnteroPositivo(valor) {
        const numero = Number(valor);
        return Number.isInteger(numero) && numero > 0;
    }

    // Obtener los valores actuales de la base de datos
    db.collection(refC).doc(id).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();

            // Solicitar los nuevos valores, permitiendo conservar los actuales
            const newName = solicitarNombre(data.nameProduct);
            const newPrice = solicitarPrecio(data.precioProduct);
            const newCantidad = solicitarCantidad(data.cantidadProduct);

            // Actualizar en la base de datos
            db.collection(refC).doc(id).update({
                nameProduct: newName,
                precioProduct: newPrice,
                cantidadProduct: newCantidad
            })
            .then(() => {
                alert("Producto actualizado correctamente.");
                loadTasks(); // Opcional: Recargar lista de tareas
                location.reload(); // Recargar la página
            })
            .catch(error => alert(`Error al actualizar: ${error.message}`));
        } else {
            alert("No se encontró el producto.");
        }
    }).catch(error => alert(`Error al obtener los datos: ${error.message}`));
}



  
// Función para añadir o actualizar un producto en el carrito
function addProductoCarrito(productoId) {
    // Verificar si el usuario está autenticado
    const user = firebase.auth().currentUser;

    if (!user) {
        alert("Debes iniciar sesión para añadir productos al carrito.");
        return;
    }

    // Referencia al carrito del usuario autenticado en Firestore
    const carritoRef = firebase.firestore().collection('carrito').doc(user.uid).collection('productos');

    // Consultar el inventario del producto
    const colecciones = ['Toys', 'Lenceria', 'Novedades']; // Colecciones donde se almacena el inventario
    let cantidadInventario = 0;

    Promise.all(colecciones.map(coleccion =>
        firebase.firestore().collection(coleccion).doc(productoId).get()
    )).then(snapshots => {
        // Verificar en cuál colección está el producto
        snapshots.forEach(snapshot => {
            if (snapshot.exists) {
                cantidadInventario = snapshot.data().cantidadProduct;
            }
        });

        if (cantidadInventario === 0) {
            alert("El producto no está disponible en el inventario.");
            return;
        }

        // Verificar si el producto ya está en el carrito
        carritoRef.where('productoId', '==', productoId).get()
            .then((querySnapshot) => {
                let currentCantidad = 0;

                if (!querySnapshot.empty) {
                    // Si el producto ya está en el carrito, obtener la cantidad actual
                    currentCantidad = querySnapshot.docs[0].data().cantidad;
                }

                // Verificar si la cantidad total excede el inventario
                if (currentCantidad + 1 > cantidadInventario) {
                    alert(`No puedes añadir más de ${cantidadInventario} unidades al carrito.`);
                } else {
                    if (!querySnapshot.empty) {
                        // Actualizar la cantidad si ya existe en el carrito
                        const docRef = querySnapshot.docs[0].ref;

                        docRef.update({
                            cantidad: currentCantidad + 1
                        }).then(() => {
                            alert("Cantidad actualizada en el carrito");
                        }).catch((error) => {
                            console.error("Error al actualizar la cantidad en el carrito: ", error);
                        });
                    } else {
                        // Agregar el producto al carrito si no existe
                        carritoRef.add({
                            productoId: productoId,
                            cantidad: 1,
                            fechaAñadido: firebase.firestore.FieldValue.serverTimestamp()
                        }).then(() => {
                            alert("Producto añadido al carrito");
                        }).catch((error) => {
                            console.error("Error al añadir el producto al carrito: ", error);
                        });
                    }
                }
            })
            .catch((error) => {
                console.error("Error al buscar el producto en el carrito: ", error);
            });
    }).catch(error => {
        console.error("Error al consultar el inventario: ", error);
    });
}
function añadirCarritoSS(productoId) {
    // Verificar si el usuario ha iniciado sesión
    const user = firebase.auth().currentUser;

    if (!user) {
        alert("Debes iniciar sesión para añadir productos al carrito.");
        return;
    }

    // Referencia al carrito del usuario autenticado en Firestore
    const carritoRef = firebase.firestore().collection('carrito').doc(user.uid).collection('productos');

    // Colecciones donde se almacena el inventario
    const colecciones = ['Toys', 'Lenceria', 'Novedades'];
    let cantidadInventario = 0;

    // Consultar el inventario del producto
    Promise.all(colecciones.map(coleccion =>
        firebase.firestore().collection(coleccion).doc(productoId).get()
    )).then(snapshots => {
        // Buscar en qué colección está el producto y obtener su inventario
        snapshots.forEach(snapshot => {
            if (snapshot.exists) {
                cantidadInventario = snapshot.data().cantidadProduct;
            }
        });

        if (cantidadInventario === 0) {
            alert("El producto no está disponible en el inventario.");
            return;
        }

        // Verificar si el producto ya existe en el carrito del usuario
        carritoRef.where('productoId', '==', productoId).get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    // Si el producto ya está en el carrito, obtener la cantidad actual
                    const docRef = querySnapshot.docs[0].ref;
                    const currentCantidad = querySnapshot.docs[0].data().cantidad;

                    // Verificar si al aumentar la cantidad se excede el inventario
                    if (currentCantidad + 1 > cantidadInventario) {
                        alert(`No puedes añadir más de ${cantidadInventario} unidades al carrito.`);
                    } else {
                        // Actualizar la cantidad en el carrito
                        docRef.update({
                            cantidad: currentCantidad + 1
                        }).then(() => {
                            alert("Cantidad actualizada en el carrito");
                        }).catch((error) => {
                            console.error("Error al actualizar la cantidad en el carrito: ", error);
                        });
                    }
                } else {
                    // Si el producto no está en el carrito, agregarlo con cantidad inicial de 1
                    if (cantidadInventario >= 1) {
                        carritoRef.add({
                            productoId: productoId,
                            cantidad: 1,
                            fechaAñadido: firebase.firestore.FieldValue.serverTimestamp()
                        }).then(() => {
                            alert("Producto añadido al carrito");
                        }).catch((error) => {
                            alert("Error al añadir el producto al carrito: ", error);
                        });
                    } else {
                        alert("No hay suficiente inventario para añadir este producto.");
                    }
                }
            })
            .catch((error) => {
                alert("Error al buscar el producto en el carrito: ", error);
            });
    }).catch(error => {
        console.error("Error al consultar el inventario: ", error);
    });
}

// Configurar la visibilidad de los enlaces al iniciar o cerrar sesión
firebase.auth().onAuthStateChanged(user => {
    const linkIniciarSesion = document.getElementById('linkIniciarSesion');
    const linkCerrarSesion = document.getElementById('linkCerrarSesion');

    if (user) {
        // Si el usuario está autenticado, mostrar "Cerrar Sesión" y ocultar "Iniciar Sesión"
        linkIniciarSesion.style.display = 'none';
        linkCerrarSesion.style.display = 'inline';
    } else {
        // Si el usuario no está autenticado, mostrar "Iniciar Sesión" y ocultar "Cerrar Sesión"
        linkIniciarSesion.style.display = 'inline';
        linkCerrarSesion.style.display = 'none';
    }
});

// Función para cerrar sesión
function cerrarSesion() {
    firebase.auth().signOut()
        .then(() => {
            console.log("Sesión cerrada con éxito");
            // Redireccionar a la página de inicio o actualizar el estado de los enlaces si es necesario
            window.location.href = "index.html";
        })
        .catch(error => {
            console.error("Error al cerrar sesión:", error);
        });
}

function mostrarOpciones() {
    const opcion1 = document.getElementById('opcion1').checked;
    const opcion2 = document.getElementById('opcion2').checked;
    const formularioDomicilio = document.getElementById('formularioDomicilio');
    const mensajeRecoger = document.getElementById('mensajeRecoger');
    
    if (opcion1) {
        formularioDomicilio.style.display = 'block'; 
        mensajeRecoger.style.display = 'none';
    } else if (opcion2) {
        formularioDomicilio.style.display = 'none';
        mensajeRecoger.style.display = 'block';

        // este liimpiar los campos del formulario pake no se guañldenna
        document.getElementById('nombre').value = "";
        document.getElementById('direccion').value = "";
        document.getElementById('ciudad').value = "";
        document.getElementById('codigoPostal').value = "";
        document.getElementById('telefono').value = "";
        document.getElementById('email').value = "";
    } else {
        formularioDomicilio.style.display = 'none';
        mensajeRecoger.style.display = 'none';
    }
}

const taskList = document.getElementById('task-list');

// Función para cargar y mostrar productos de una colección específica
function cargarColeccion(coleccion) {
    taskList.innerHTML = ''; // Limpiar la lista antes de agregar los productos

    // Obtener los productos desde la colección seleccionada
    db.collection(coleccion).get()
        .then(snapshot => {
            if (snapshot.empty) {
                // Si no hay productos, mostrar un mensaje
                const mensaje = document.createElement('p');
                mensaje.textContent = `No hay productos en la colección "${coleccion}".`;
                taskList.appendChild(mensaje);
            } else {
                snapshot.forEach(doc => {
                    agregarProductoALista(doc); // Agregar cada producto a la lista
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar la colección:', error);
            alert('Ocurrió un error al cargar los productos.');
        });
}

// Función para Modificar o Boorrar algun producto a la listaaaaaaaaaaaaaaaaaaaa
function agregarProductoALista(doc) {
    const li = document.createElement('li');
    li.classList.add('product-item');
    li.innerHTML = `
        <span class="product-name">${doc.data().nameProduct}</span>
        <span class="product-price">Precio: $ ${doc.data().precioProduct}</span>
        <span class="product-quantity">Cantidad: ${doc.data().cantidadProduct}</span>
        <div class="buttons">
            <button class="edit-btn" onclick="updateTask('${doc.id}', '${doc.ref.parent.id}')">Actualizar</button>
            <button class="delete-btn" onclick="deleteTask('${doc.id}', '${doc.ref.parent.id}')">Eliminar</button>
        </div>
    `;
    taskList.appendChild(li);
}

// Cargar una colección por defecto al iniciar la página
document.addEventListener('DOMContentLoaded', function () {
    cargarColeccion('Toys'); //estoooooooooooooooooooooooooooooooooooooooooooooooooooo
});
