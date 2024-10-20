Toastify({
    text: "Hola! Este sitio web a sido desarrollado por Christian Vasquez", // mensaje
    duration: 10000, // duración en milisegundos
    newWindow: true, // abrirá un link en nueva ventana si es que añades un enlace

    gravity: "bottom", // "top" o "bottom"
    position: "left", // "left", "center" o "right"
    stopOnFocus: true, // Mantiene el toast si pasa el mouse encima
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)", // colores de fondo
    },
  }).showToast();
  