
let currentPage = 1;
const limit = 10;

function fetchBebidas(page) {
    fetch(`http://localhost:3001/bebidas?pagina=${page}&limite=${limit}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al obtener bebidas");
        return response.json();
    })
    .then(data => {
        const tableBody = document.querySelector("#miTabla tbody");
        tableBody.innerHTML = "";

        data.bebidas.forEach(item => {
            const fila = tableBody.insertRow();
            
            // ID
            const idCell = fila.insertCell();
            idCell.textContent = item._id;
            idCell.classList.add('d-none', 'd-md-table-cell');

            // Imagen
            const imagenCell = fila.insertCell();
            imagenCell.classList.add('d-none', 'd-md-table-cell');
            if (item.imagenBebida) {
                imagenCell.innerHTML = `
                    <img src="http://localhost:3001${item.imagenBebida}" 
                         alt="${item.nombreBebida}" 
                         class="img-thumbnail cursor-pointer" 
                         width="50" 
                         style="cursor: pointer;"
                         onclick="mostrarImagenAmpliada('http://localhost:3001${item.imagenBebida}', '${item.nombreBebida}')"
                    />`;
            } else {
                imagenCell.textContent = "Sin imagen";
            }

            // Nombre
            fila.insertCell().textContent = item.nombreBebida || 'Sin nombre';

            // Descripción
            const descCell = fila.insertCell();
            descCell.textContent = item.descripcionBebida || 'Sin descripción';
            descCell.classList.add('d-none', 'd-md-table-cell');

            // Categoría
            const catCell = fila.insertCell();
            catCell.textContent = item.categoriaBebida?.nombreCategoria || 'Sin categoría';
            catCell.classList.add('d-none', 'd-md-table-cell');

            // Precio
            fila.insertCell().textContent = `L. ${item.precioBebida || 0}`;

            // Estado
            const estadoCell = fila.insertCell();
            estadoCell.classList.add('d-none', 'd-md-table-cell');
            estadoCell.innerHTML = `<span class="badge ${item.estadoBebida ? 'bg-success' : 'bg-danger'} rounded-pill">
                ${item.estadoBebida ? 'Activo' : 'Inactivo'}
            </span>`;

            // Acciones
            const accionesCell = fila.insertCell();
            
            const linkUpdate = document.createElement("a");
            linkUpdate.href = `formbebidas.html?Mode=UPD&id=${item._id}`;
            linkUpdate.innerHTML = '<i class="fas fa-edit btn btn-warning btn-sm me-2"></i>';
            accionesCell.appendChild(linkUpdate);

            const linkDelete = document.createElement("a");
            linkDelete.href = `formbebidas.html?Mode=DLT&id=${item._id}`;
            linkDelete.innerHTML = '<i class="fas fa-trash-alt btn btn-danger btn-sm"></i>';
            accionesCell.appendChild(linkDelete);
        });

        mostrarPaginacion(data.paginaActual, data.totalPaginas);
    })
    .catch(error => {
        console.error("Error:", error);
        // Mostrar mensaje de error al usuario
        const tableBody = document.querySelector("#miTabla tbody");
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-danger">
                    Error al cargar las bebidas. Por favor, intente nuevamente.
                </td>
            </tr>
        `;
    });
}

function mostrarPaginacion(paginaActual, totalPaginas) {
    const paginacion = document.querySelector("#pagination");
    paginacion.innerHTML = `
        <li class="page-item ${paginaActual === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="fetchBebidas(${paginaActual - 1}); return false;">
                Anterior
            </a>
        </li>
        
        ${generarBotonesPagina(paginaActual, totalPaginas)}
        
        <li class="page-item ${paginaActual === totalPaginas ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="fetchBebidas(${paginaActual + 1}); return false;">
                Siguiente
            </a>
        </li>
    `;
}

function generarBotonesPagina(paginaActual, totalPaginas) {
    let botones = "";
    const MAX_PAGINAS = 5;

    let inicio = Math.max(1, paginaActual - Math.floor(MAX_PAGINAS / 2));
    let fin = Math.min(totalPaginas, inicio + MAX_PAGINAS - 1);

    if (fin - inicio + 1 < MAX_PAGINAS) {
        inicio = Math.max(1, fin - MAX_PAGINAS + 1);
    }

    if (inicio > 1) {
        botones += `<li class="page-item">
            <a class="page-link" href="#" onclick="fetchBebidas(1); return false;">1...</a>
        </li>`;
    }

    for (let i = inicio; i <= fin; i++) {
        botones += `
            <li class="page-item ${i === paginaActual ? "active" : ""}">
                <a class="page-link" href="#" onclick="fetchBebidas(${i}); return false;">${i}</a>
            </li>
        `;
    }

    if (fin < totalPaginas) {
        botones += `<li class="page-item">
            <a class="page-link" href="#" onclick="fetchBebidas(${totalPaginas}); return false;">...${totalPaginas}</a>
        </li>`;
    }

    return botones;
}

// Modal para imagen ampliada
document.body.insertAdjacentHTML('beforeend', `
    <div class="modal fade" id="imagenModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="imagenModalLabel">Vista previa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="" alt="" id="imagenAmpliada" class="img-fluid" style="max-height: 80vh;">
                </div>
            </div>
        </div>
    </div>
`);

function mostrarImagenAmpliada(src, alt) {
    const modal = new bootstrap.Modal(document.getElementById('imagenModal'));
    const imagenAmpliada = document.getElementById('imagenAmpliada');
    const modalTitle = document.getElementById('imagenModalLabel');
    imagenAmpliada.src = src;
    imagenAmpliada.alt = alt;
    modalTitle.textContent = alt;
    modal.show();
}

// Inicializar
window.mostrarImagenAmpliada = mostrarImagenAmpliada;
fetchBebidas(currentPage);