let productosData = [];

async function obtenerProductos(pagina = 1) {
    try {
        const response = await fetch(`http://localhost:3001/productos?pagina=${pagina}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        productosData = data.productos; // Guardar productos en variable global
        mostrarProductos(data.productos);
        mostrarPaginacion(data.paginaActual, data.totalPaginas);

    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

function mostrarProductos(productos) {
    if (!Array.isArray(productos)) {
        console.error('Los productos no son un array:', productos);
        return;
    }

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
        tbody.innerHTML += `
            <tr style="cursor: pointer;">
                <td class="d-none d-md-table-cell">${producto._id}</td>
                <td class="d-none d-md-table-cell">
                    ${producto.imagenProducto ? `<img src="${producto.imagenProducto}" width="50">` : 'Sin imagen'}
                </td>
                <td onclick="mostrarDetalle('${producto._id}')">${producto.nombreProducto}</td>
                <td class="d-none d-md-table-cell">${producto.descripcionProducto}</td>
                <td>$${producto.precioProducto}</td>
                <td class="d-none d-md-table-cell">
                    ${producto.estadoProducto ? 'Activo' : 'Inactivo'}
                </td>
                <td>
                    <a href="productos-formulario.html?id=${producto._id}" class="btn btn-warning btn-sm">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button onclick="eliminarProducto('${producto._id}')" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Función para mostrar el modal con detalles
function mostrarDetalle(productoId) {
    const producto = productosData.find(p => p._id === productoId); // Usar productosData
    if (!producto) return;

    const modalBody = document.getElementById('detalleProductoBody');
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-12 text-center mb-3">
                ${producto.imagenProducto ? 
                    `<img src="${producto.imagenProducto}" class="img-fluid" style="max-height: 200px;">` : 
                    'Sin imagen'}
            </div>
            <div class="col-12">
                <p><strong>ID:</strong> ${producto._id}</p>
                <p><strong>Nombre:</strong> ${producto.nombreProducto}</p>
                <p><strong>Descripción:</strong> ${producto.descripcionProducto}</p>
                <p><strong>Precio:</strong> $${producto.precioProducto}</p>
                <p><strong>Estado:</strong> ${producto.estadoProducto ? 'Activo' : 'Inactivo'}</p>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('detalleProductoModal'));
    modal.show();
}

function mostrarPaginacion(paginaActual, totalPaginas) {
    const paginacionUl = document.getElementById('paginacion');
    paginacionUl.innerHTML = '';

    // Botón Anterior
    paginacionUl.innerHTML += `
        <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="obtenerProductos(${paginaActual - 1})">Anterior</a>
        </li>
    `;

    // Números de página
    for(let i = 1; i <= totalPaginas; i++) {
        paginacionUl.innerHTML += `
            <li class="page-item ${i === paginaActual ? 'active' : ''}">
                <a class="page-link" href="#" onclick="obtenerProductos(${i})">${i}</a>
            </li>
        `;
    }

    // Botón Siguiente
    paginacionUl.innerHTML += `
        <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="obtenerProductos(${paginaActual + 1})">Siguiente</a>
        </li>
    `;
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', obtenerProductos);