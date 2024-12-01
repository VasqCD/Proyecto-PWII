let currentPage = 1;
const limit = 10;

function fetchProductos(page) {
    fetch(`http://localhost:3001/productos?pagina=${page}&limite=${limit}`)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Error al obtener productos');
        })
        .then(function(data) {
            let tableBody = document.querySelector('#miTabla tbody');
            tableBody.innerHTML = '';

            data.productos.forEach(function(item) {
                let fila = tableBody.insertRow();
                fila.insertCell().textContent = item._id;
                fila.insertCell().textContent = item.nombreProducto;
                fila.insertCell().textContent = item.descripcionProducto;
                fila.insertCell().textContent = item.categoriaProducto;
                fila.insertCell().textContent = item.precioProducto;
                fila.insertCell().textContent = item.estadoProducto ? 'Activo' : 'Inactivo';

                let accionesCell = fila.insertCell();
                let linkUpdate = document.createElement('a');
                // Aquí irían los botones de acción
            });

            mostrarPaginacion(data.paginaActual, data.totalPaginas);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function mostrarPaginacion(paginaActual, totalPaginas) {
    const paginacion = document.querySelector('#pagination');
    paginacion.innerHTML = `
        <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="fetchProductos(${paginaActual - 1}); return false;">Anterior</a>
        </li>
        
        ${generarBotonesPagina(paginaActual, totalPaginas)}
        
        <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="fetchProductos(${paginaActual + 1}); return false;">Siguiente</a>
        </li>
    `;
}

function generarBotonesPagina(paginaActual, totalPaginas) {
    let botones = '';
    const MAX_PAGINAS = 5;

    let inicio = Math.max(1, paginaActual - Math.floor(MAX_PAGINAS / 2));
    let fin = Math.min(totalPaginas, inicio + MAX_PAGINAS - 1);

    if (fin - inicio + 1 < MAX_PAGINAS) {
        inicio = Math.max(1, fin - MAX_PAGINAS + 1);
    }

    if (inicio > 1) {
        botones += `<li class="page-item"><a class="page-link" href="#" onclick="fetchProductos(1); return false;">1...</a></li>`;
    }

    for (let i = inicio; i <= fin; i++) {
        botones += `
            <li class="page-item ${i === paginaActual ? 'active' : ''}">
                <a class="page-link" href="#" onclick="fetchProductos(${i}); return false;">${i}</a>
            </li>
        `;
    }

    if (fin < totalPaginas) {
        botones += `<li class="page-item"><a class="page-link" href="#" onclick="fetchProductos(${totalPaginas}); return false;">...${totalPaginas}</a></li>`;
    }

    return botones;
}

// Iniciar la carga de productos
fetchProductos(currentPage);