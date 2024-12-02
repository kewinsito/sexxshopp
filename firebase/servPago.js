const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51QNgmjG1BM7gBfWDQoNTVrkJLlrONbYyl1ybGqwtTH7PGDVCyScVwhZ8I6uC2rNPgBCv7zlNEubyvYdxNdQk6WDl00FOnicbMN');

// Middleware para procesar JSON
app.use(express.json());

// Ruta para procesar pagos
app.post('/procesar-pago', async (req, res) => {
    const { paymentMethodId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 5000, // Monto en centavos (por ejemplo, 5000 = 50.00)
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
        });
        res.send({ success: true });
    } catch (error) {
        res.send({ success: false, error: error.message });
    }
});

app.listen(3000, () => console.log('Servidor en ejecución en puerto 3000'));
