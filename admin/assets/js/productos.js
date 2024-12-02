let currentPage = 1;
const limit = 10;

// Función para obtener los productos
function fetchProductos(page) {
    fetch(`http://localhost:3001/productos?pagina=${page}&limite=${limit}`)
        .then(function (response) {
            if (!response.ok) throw new Error("Error al obtener productos");
            return response.json();
        })
        .then(function (data) {
            console.log(data); // Mantener para debug
            let tableBody = document.querySelector("#miTabla tbody");
            tableBody.innerHTML = "";

            data.productos.forEach(function (item) {
                let fila = tableBody.insertRow();

                // Celdas de datos
                fila.insertCell().textContent = item._id;
                if (item.imagenProducto) {
                    const imagenCell = fila.insertCell();
                    imagenCell.innerHTML = `
                        <img src="http://localhost:3001${item.imagenProducto}" 
                             alt="${item.nombreProducto}" 
                             class="img-thumbnail cursor-pointer" 
                             width="50" 
                             style="cursor: pointer;"
                             onclick="mostrarImagenAmpliada('http://localhost:3001${item.imagenProducto}', '${item.nombreProducto}')"
                        />`;
                } else {
                    fila.insertCell().textContent = "Sin imagen";
                }
                fila.insertCell().textContent = item.nombreProducto;
                fila.insertCell().textContent = item.descripcionProducto;

                const catCell = fila.insertCell();
                catCell.textContent =
                    item.categoriaProducto?.nombreCategoria || "Sin categoría";
                fila.insertCell().textContent = item.precioProducto;
                let estadoCell = fila.insertCell();
                estadoCell.innerHTML = `<span class="badge ${item.estadoProducto ? "bg-success" : "bg-danger"
                    } rounded-pill">
                    ${item.estadoProducto ? "Activo" : "Inactivo"}
                </span>`;

                // Celda de acciones
                let accionesCell = fila.insertCell();

                // Botón Editar
                let linkUpdate = document.createElement("a");
                linkUpdate.href = `../pages/formproductos.html?Mode=UPD&id=${item._id}`;
                linkUpdate.innerHTML =
                    '<i class="fas fa-edit btn btn-warning btn-sm me-2"></i>';
                accionesCell.appendChild(linkUpdate);

                // Botón Eliminar
                let linkDelete = document.createElement("a");
                linkDelete.href = `../pages/formproductos.html?Mode=DLT&id=${item._id}`;
                linkDelete.innerHTML =
                    '<i class="fas fa-trash-alt btn btn-danger btn-sm"></i>';
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

// Función para mostrar la paginación
function mostrarPaginacion(paginaActual, totalPaginas) {
    const paginacion = document.querySelector("#pagination");
    paginacion.innerHTML = `
        <li class="page-item ${paginaActual === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="fetchProductos(${paginaActual - 1
        }); return false;">Anterior</a>
        </li>
        
        ${generarBotonesPagina(paginaActual, totalPaginas)}
        
        <li class="page-item ${paginaActual === totalPaginas ? "disabled" : ""
        }">
            <a class="page-link" href="#" onclick="fetchProductos(${paginaActual + 1
        }); return false;">Siguiente</a>
        </li>
    `;
}

// Función para generar los botones de la paginación
function generarBotonesPagina(paginaActual, totalPaginas) {
    let botones = "";
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
            <li class="page-item ${i === paginaActual ? "active" : ""}">
                <a class="page-link" href="#" onclick="fetchProductos(${i}); return false;">${i}</a>
            </li>
        `;
    }

    if (fin < totalPaginas) {
        botones += `<li class="page-item"><a class="page-link" href="#" onclick="fetchProductos(${totalPaginas}); return false;">...${totalPaginas}</a></li>`;
    }

    return botones;
}

// Obtener los productos
fetchProductos(currentPage);

document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="modal fade" id="imagenModal" tabindex="-1" aria-labelledby="imagenModalLabel" aria-hidden="true">
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
`
);

function mostrarImagenAmpliada(src, alt) {
    const modal = new bootstrap.Modal(document.getElementById("imagenModal"));
    const imagenAmpliada = document.getElementById("imagenAmpliada");
    const modalTitle = document.getElementById("imagenModalLabel");

    imagenAmpliada.src = src;
    imagenAmpliada.alt = alt;
    modalTitle.textContent = alt;

    modal.show();
}

window.mostrarImagenAmpliada = mostrarImagenAmpliada;
