// Configurar Stripe con tu clave pública
const stripe = Stripe('pk_test_51QNgmjG1BM7gBfWDvgRtDu04BVamVU0AFb0VFULY6H5ozp9inoUjGTAm03HIfELW79jX5I1D7XD7ZZNStIUB2G0500GMWK4ujz');
const elements = stripe.elements();

// Crear el elemento de tarjeta
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Manejar el envío del formulario
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
    });

    if (error) {
        // Mostrar error en la interfaz
        document.getElementById('payment-result').innerText = error.message;
    } else {
        // Enviar el paymentMethod.id al servidor para procesar el pago
        fetch('/procesar-pago', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('payment-result').innerText = 'Pago exitoso';
            } else {
                document.getElementById('payment-result').innerText = 'Error al procesar el pago';
            }
        });
    }
});
