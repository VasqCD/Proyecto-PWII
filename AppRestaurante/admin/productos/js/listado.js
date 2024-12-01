fetch ('http://localhost:3001/productos')
.then(function(response){
    if(response.ok){
        return response.json();
    }
    throw new Error('Error al obtener productos');
    
})

.then(function(data){
    console.log(data);
    let tableBody = document.querySelector('#miTabla tbody');

    data.productos.forEach(function(item){
        let fila = tableBody.insertRow();
        fila.insertCell().textContent = item._id;
        fila.insertCell().textContent = item.nombreProducto;
        fila.insertCell().textContent = item.descripcionProducto;
        fila.insertCell().textContent = item.precioProducto;
        fila.insertCell().textContent = item.estadoProducto;
        fila.insertCell().textContent = item.categoriaProducto;

        let linkCellUpdate = fila.insertCell();
        let linkUpdate = document.createElement('a');
        
        
    });
})
.catch(function(error){
    console.log(error);
});