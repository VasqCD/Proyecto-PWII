
let currentPage = 1;
const limit = 10;

function fetchCategorias(page) {
    fetch(`http://localhost:3001/categorias?pagina=${page}&limite=${limit}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al obtener categorías");
        return response.json();
    })
    .then(data => {
        const tableBody = document.querySelector("#miTabla tbody");
        tableBody.innerHTML = "";

        data.forEach(item => {
            const fila = tableBody.insertRow();
            
            fila.insertCell().textContent = item._id;
            fila.insertCell().textContent = item.nombreCategoria;
            fila.insertCell().textContent = item.descripcionCategoria;
            fila.insertCell().textContent = item.tipoCategoria;
            
            let estadoCell = fila.insertCell();
            estadoCell.innerHTML = `<span class="badge ${item.estadoCategoria ? 'bg-success' : 'bg-danger'} rounded-pill">
                ${item.estadoCategoria ? 'Activo' : 'Inactivo'}
            </span>`;

            let accionesCell = fila.insertCell();
            
            let linkUpdate = document.createElement("a");
            linkUpdate.href = `formcategorias.html?Mode=UPD&id=${item._id}`;
            linkUpdate.innerHTML = '<i class="fas fa-edit btn btn-warning btn-sm me-2"></i>';
            accionesCell.appendChild(linkUpdate);

            let linkDelete = document.createElement("a");
            linkDelete.href = `formcategorias.html?Mode=DLT&id=${item._id}`;
            linkDelete.innerHTML = '<i class="fas fa-trash-alt btn btn-danger btn-sm"></i>';
            accionesCell.appendChild(linkDelete);
        });
    })
    .catch(error => console.error("Error:", error));
}

// Inicializar
fetchCategorias(currentPage);