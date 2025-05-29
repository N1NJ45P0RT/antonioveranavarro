import { showToast } from './toast.js';

function contacto(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        showToast('Por favor, escribe un correo real para poder responderte.');
        document.getElementById('email').focus();
        return;
    }

    fetch('/antonioveranavarro/src/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
    })
    .then(res => res.json())
    .then(data => {
        if (data.ok) {
            showToast('¡Email enviado!');
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
        } else {
            showToast('Error al enviar el email');
        }
    })
    .catch(() => showToast('Error al enviar el email'));
}

const correoInput = document.getElementById('email');
// Eliminar la visualización del mensaje al cargar la página
correoInput.setCustomValidity('');
correoInput.addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Mostrar el mensaje desde la primera letra
    if (correoInput.value.length === 0 || !emailRegex.test(correoInput.value)) {
        correoInput.setCustomValidity('Por favor, escribe un correo real para poder responderte.');
        if (correoInput.value.length > 0) {
            correoInput.reportValidity();
        }
    } else {
        correoInput.setCustomValidity('');
    }
});
// Forzar mostrar el mensaje al escribir la primera letra
correoInput.addEventListener('invalid', function() {
    correoInput.reportValidity();
});

//CONTROLADOR DEL FORMULARIO//
const nodemailer = require('nodemailer');
require('dotenv').config();

const EMAIL_TO = process.env.EMAIL_TO;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASS
    }
});

const sendMail = async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Faltan campos' });
    }
    try {
        //Mandar email a mi
        await transporter.sendMail({
            from: EMAIL_FROM,
            to: EMAIL_TO,
            subject: `Mensaje de ${nombre}`,
            text: `Nombre: ${nombre}\nCorreo: ${correo}\nMensaje: ${mensaje}`
        });

        //Mandar email al usuario
        await transporter.sendMail({
            from: EMAIL_FROM,
            to: email,
            subject: 'Tu mensaje ha sido recibido',
            html: `
                <p>Hola ${name},</p>
                <p>Gracias por tu mensaje. He recibido tu email y te responderé lo antes posible.</p><br>
                <p><em><strong>Este es un mensaje automático, por favor no respondas a este correo.</strong></em></p>
                <p>Antonio Vera Navarro</p>
            `
        });
        res.json({ ok: true });
    } catch (e) {
        console.error('Error al enviar el emial:', e);
        res.status(500).json({ error: 'Error enviando el email', detalles: e.message });
    }
};