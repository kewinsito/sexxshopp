function updateCantidad(uid, docId, nuevaCantidad, productoId) {
    // Verificar que el valor sea válido
    const cantidad = parseInt(nuevaCantidad, 10);
    if (isNaN(cantidad) || cantidad < 1) {
        console.error("Cantidad no válida:", nuevaCantidad);
        return;
    }

    const colecciones = ['Toys', 'Lenceria', 'Novedades'];

    colecciones.forEach(coleccion => {
        db.collection(coleccion).doc(productoId).get().then(doc => {
            if (doc.exists) {
                const cantidadDB = doc.data().cantidadProduct;

                // Obtener el elemento del input
                const productCantElement = document.getElementById('cantidadProductoos');
                if (productCantElement) {
                    // Validar en tiempo real si la cantidad excede el inventario
                    productCantElement.addEventListener('input', (event) => {
                        const valor = parseInt(event.target.value, 10);

                        if (isNaN(valor) || valor > cantidadDB) {
                            // Si excede el inventario, restablecer al máximo permitido
                            event.target.value = cantidadDB;
                            alert(`No puedes pedir más de ${cantidadDB} unidades.`);
                        }
                    });

                    // Si la cantidad está dentro del rango permitido, actualizar en la base de datos
                    if (cantidad <= cantidadDB) {
                        db.collection('carrito').doc(uid).collection('productos').doc(docId).update({
                            cantidad: cantidad
                        }).then(() => {
                            console.log("Cantidad actualizada exitosamente:", cantidad);
                            // Opcional: Actualizar el subtotal dinámicamente si es necesario
                            updateSubtotal();
                        }).catch(error => {
                            console.error("Error al actualizar la cantidad:", error);
                        });
                    } else {
                        console.warn(`La cantidad solicitada (${cantidad}) excede el inventario disponible (${cantidadDB}).`);
                    }
                }
            }
        }).catch(error => {
            console.error("Error al consultar el inventario:", error);
        });
    });
}

function updateSubtotal() {
    let subtotal = 0;
    document.querySelectorAll('.quantity-input').forEach(input => {
        const row = input.closest('tr');
        const price = parseFloat(row.querySelector('.price').dataset.price);
        const quantity = parseInt(input.value, 10);
        const totalCell = row.querySelector('.total');

        // Calcular el nuevo total por producto
        const total = price * quantity;
        totalCell.textContent = total.toLocaleString();

        // Sumar al subtotal
        subtotal += total;
    });

    // Actualizar el subtotal en el DOM
    document.getElementById('subtotal').textContent = subtotal.toLocaleString();
}

function mostrarCarrito(uid) {
    const tableBody = document.getElementById('carrito');
    tableBody.innerHTML = ''; // Limpiar carrito antes de actualizar
    let subtotal = 0; // Inicializar el subtotal

    db.collection('carrito').doc(uid).collection('productos').get().then(snapshot => {
        const productoPromises = [];

        snapshot.forEach(doc => {
            const productoId = doc.data().productoId;
            const cantidad = doc.data().cantidad;
            const quitar = doc.id;
            const colecciones = ['Toys', 'Lenceria', 'Novedades'];

            colecciones.forEach(coleccion => {
                // Agregar cada consulta a un array de promesas
                productoPromises.push(
                    db.collection(coleccion).doc(productoId).get().then(productoDoc => {
                        if (productoDoc.exists) {
                            const producto = productoDoc.data();
                            const tr = document.createElement('tr');
                            
                            // Calcular el subtotal del producto actual
                            const precioTotalProducto = producto.precioProduct * (cantidad || 1);
                            subtotal += precioTotalProducto;

                            tr.innerHTML = `
                                <td>
                                    <img src="${producto.UrlProduct}" alt="${producto.nameProduct}" style="width: 100px; height: auto; border-radius: 9px;">
                                </td>
                                <td>
                                    <div class="product-name">${producto.nameProduct}</div>
                                    <div><span class="remove-link" onclick="quitarDelCarrito('${uid}', '${quitar}')">Quitar</span></div>
                                </td>
                                <td>$<span class="price" data-price="${producto.precioProduct}">${producto.precioProduct.toLocaleString()}</span></td>
                                <td>
                                    <input type="number" 
                                           id="cantidadProductoos"
                                           class="quantity-input" 
                                           value="${cantidad || 1}" 
                                           min="1" 
                                           onchange="updateCantidad('${uid}', '${quitar}', this.value,'${productoId}'); updateSubtotal();">
                                </td>
                                <td>$<span class="total">${precioTotalProducto.toLocaleString()}</span></td>
                            `;

                            tableBody.appendChild(tr);
                        }
                    }).catch(error => {
                        console.error("Error al obtener detalles del producto:", error);
                    })
                );
            });
        });

        // Esperar a que todas las promesas de productos se resuelvan
        Promise.all(productoPromises).then(() => {
            // Actualizar el subtotal en el DOM después de cargar todos los productos
            document.getElementById('subtotal').innerText = `${subtotal.toLocaleString()}`;
        });
    }).catch(error => {
        console.error("Error al cargar el carrito:", error);
    });
}


function quitarDelCarrito(uid, quitar) {
    db.collection('carrito').doc(uid).collection('productos').doc(quitar).delete().then(() => {
        alert('Producto eliminado del carrito');
        mostrarCarrito(uid); // Recargar carrito
    }).catch(error => {
        alert("Error al eliminar producto:", error);
    });
}
function irPagar() {
    const subtotalElement = document.getElementById('subtotal');
    const subtotal = subtotalElement.textContent; // Convierte el valor del subtotal a entero
    //if (isNaN(subtotal)) {
      //  alert('El subtotal no es un número válido');
        //return;
    //}
    window.location.href = `Pago.html?total=${subtotal.toLocaleString()}`;
}
