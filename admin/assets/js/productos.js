let currentPage = 1;
const limit = 10;

// Función para obtener los productos
function fetchProductos(page) {
    fetch(`http://localhost:3001/productos?pagina=${page}&limite=${limit}`)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Error al obtener productos");
        })
        .then(function (data) {
            console.log(data);
            let tableBody = document.querySelector("#miTabla tbody");
            tableBody.innerHTML = "";

            data.productos.forEach(function (item) {
                let fila = tableBody.insertRow();
                fila.insertCell().textContent = item._id;
                if (item.imagenProducto) {
                    fila.insertCell().innerHTML = `<img src="http://localhost:3001${item.imagenProducto}" alt="${item.nombreProducto}" class="img-thumbnail" width="50" />`;
                } else {
                    fila.insertCell().textContent = "Sin imagen";
                }
                
                fila.insertCell().textContent = item.nombreProducto;
                fila.insertCell().textContent = item.descripcionProducto;
                fila.insertCell().textContent = item.categoriaProducto.nombreCategoria;
                fila.insertCell().textContent = item.precioProducto;
                fila.insertCell().textContent = item.estadoProducto
                    ? "Activo"
                    : "Inactivo";

                let accionesCell = fila.insertCell();
                let linkUpdate = document.createElement("a");

                linkUpdate.href = '../pages/formproductos.html?Mode=UPD&id='+item._id;
                linkUpdate.innerHTML = '<i class="fas fa-edit"></i>';
                accionesCell.appendChild(linkUpdate);

                // botones de accion
                // Botón Editar

                let btnEditar = document.createElement("button");
                btnEditar.className = "btn btn-warning btn-sm me-2";
                btnEditar.innerHTML = '<i class="fas fa-edit"></i>';
                btnEditar.onclick = () => cargarDatosProducto(item._id);

                // Botón Eliminar
                let btnEliminar = document.createElement("button");
                btnEliminar.className = "btn btn-danger btn-sm";
                btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';
                btnEliminar.onclick = async () => {
                    if (confirm("¿Está seguro de eliminar este producto?")) {
                        try {
                            const response = await fetch(
                                `http://localhost:3001/productos/${item._id}`,
                                {
                                    method: "DELETE",
                                }
                            );

                            if (response.ok) {
                                fetchProductos(currentPage);
                            } else {
                                throw new Error("Error al eliminar el producto");
                            }
                        } catch (error) {
                            console.error("Error:", error);
                            alert("Error al eliminar el producto");
                        }
                    }
                };

                // Agregar botones a la celda de acciones
                accionesCell.appendChild(btnEditar);
                accionesCell.appendChild(btnEliminar);
            });

            mostrarPaginacion(data.paginaActual, data.totalPaginas);
        })
        .catch(function (error) {
            console.log(error);
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

// Función para crear o actualizar un producto
async function crearActualizarProducto() {
    const productId = document.getElementById("productId").value;
    const formData = new FormData();

    formData.append(
        "nombreProducto",
        document.getElementById("productName").value
    );
    formData.append(
        "descripcionProducto",
        document.getElementById("description").value
    );
    formData.append(
        "categoriaProducto",
        document.getElementById("category").value
    );
    formData.append("precioProducto", document.getElementById("price").value);
    formData.append(
        "estadoProducto",
        document.getElementById("status").value === "1"
    );

    const imageFile = document.getElementById("image").files[0];
    if (imageFile) {
        formData.append("imagen", imageFile);
    }

    try {
        const url = productId
            ? `http://localhost:3001/productos/${productId}`
            : "http://localhost:3001/productos";

        const method = productId ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            body: formData,
        });

        if (!response.ok) throw new Error("Error en la operación");

        // Cerrar modal y recargar datos
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("addProduct")
        );
        modal.hide();
        fetchProductos(currentPage);
    } catch (error) {
        console.error("Error:", error);
        alert("Error al guardar el producto");
    }
}

// Función para cargar datos de un producto en el modal
async function cargarDatosProducto(id) {
    try {
        const response = await fetch(`http://localhost:3001/productos/${id}`);
        if (!response.ok) throw new Error("Error al obtener el producto");

        const producto = await response.json();

        document.getElementById("productId").value = producto._id;
        document.getElementById("productName").value = producto.nombreProducto;
        document.getElementById("description").value = producto.descripcionProducto;
        document.getElementById("category").value = producto.categoriaProducto;
        document.getElementById("price").value = producto.precioProducto;
        document.getElementById("status").value = producto.estadoProducto
            ? "1"
            : "0";

        // Abrir el modal
        const modal = new bootstrap.Modal(document.getElementById("addProduct"));
        modal.show();
    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar el producto");
    }
}

// Función para cargar categorías en el select
async function cargarCategorias() {
    try {
        const response = await fetch("http://localhost:3001/categorias");
        if (!response.ok) throw new Error("Error al obtener categorías");

        const categorias = await response.json();
        const selectCategoria = document.getElementById("category");

        selectCategoria.innerHTML =
            '<option value="">Seleccione una categoría</option>';
        categorias.forEach((categoria) => {
            if (categoria.estadoCategoria) {
                selectCategoria.innerHTML += `
                    <option value="${categoria._id}">
                        ${categoria.nombreCategoria}
                    </option>
                `;
            }
        });
    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar las categorías");
    }
}

// Evento para cargar categorías al abrir el modal
document
    .getElementById("addProduct")
    .addEventListener("show.bs.modal", function (event) {
        cargarCategorias();

        // Si es nuevo producto, limpiar el formulario
        if (!event.relatedTarget.dataset.id) {
            document.getElementById("productForm").reset();
            document.getElementById("productId").value = "";
        }
    });
