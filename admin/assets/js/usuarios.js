// usuarios.js
let currentPage = 1;
const limit = 10;

function fetchUsuarios(page) {
    fetch(`http://localhost:3001/usuarios?pagina=${page}&limite=${limit}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener usuarios");
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector("#miTabla tbody");
            tableBody.innerHTML = "";

            data.usuarios.forEach(item => {
                const fila = tableBody.insertRow();

                // ID
                fila.insertCell().textContent = item._id;

                // Nombre
                fila.insertCell().textContent = item.nombre;

                // Email
                fila.insertCell().textContent = item.email;

                // Rol
                const rolCell = fila.insertCell();
                rolCell.textContent = item.nRol?.map(rol => rol.nombre).join(', ') || 'Sin rol';

                // Acciones
                const accionesCell = fila.insertCell();

                const linkUpdate = document.createElement("a");
                linkUpdate.href = `formusuarios.html?Mode=UPD&id=${item._id}`;
                linkUpdate.innerHTML = '<i class="fas fa-edit btn btn-warning btn-sm me-2"></i>';
                accionesCell.appendChild(linkUpdate);

                const linkDelete = document.createElement("a");
                linkDelete.href = `formusuarios.html?Mode=DLT&id=${item._id}`;
                linkDelete.innerHTML = '<i class="fas fa-trash-alt btn btn-danger btn-sm"></i>';
                accionesCell.appendChild(linkDelete);
            });

            mostrarPaginacion(data.paginaActual, data.totalPaginas);
        })
        .catch(error => {
            console.error("Error:", error);
            const tableBody = document.querySelector("#miTabla tbody");
            tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    Error al cargar los usuarios. Por favor, intente nuevamente.
                </td>
            </tr>
        `;
        });
}

// funcion para generar los botones de paginacion
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
            <a class="page-link" href="#" onclick="fetchUsuarios(1); return false;">1...</a>
        </li>`;
    }

    for (let i = inicio; i <= fin; i++) {
        botones += `
            <li class="page-item ${i === paginaActual ? "active" : ""}">
                <a class="page-link" href="#" onclick="fetchUsuarios(${i}); return false;">${i}</a>
            </li>
        `;
    }

    if (fin < totalPaginas) {
        botones += `<li class="page-item">
            <a class="page-link" href="#" onclick="fetchUsuarios(${totalPaginas}); return false;">...${totalPaginas}</a>
        </li>`;
    }

    return botones;
}

function mostrarPaginacion(paginaActual, totalPaginas) {
    const paginacion = document.querySelector("#pagination");
    paginacion.innerHTML = `
        <li class="page-item ${paginaActual === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="fetchUsuarios(${paginaActual - 1}); return false;">Anterior</a>
        </li>
        ${generarBotonesPagina(paginaActual, totalPaginas)}
        <li class="page-item ${paginaActual === totalPaginas ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="fetchUsuarios(${paginaActual + 1}); return false;">Siguiente</a>
        </li>
    `;
}

// Inicializar
fetchUsuarios(currentPage);