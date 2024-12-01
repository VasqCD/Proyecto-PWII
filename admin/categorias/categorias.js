
export function cargarCategorias() {
    return fetch('http://localhost:3001/categorias')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener categorías');
            }
            return response.json();
        })
        .then(categorias => {
            const selectCategorias = document.getElementById('categoriaProducto');
            selectCategorias.innerHTML = '<option value="">Seleccione una categoría</option>';
            
            categorias.forEach(categoria => {
                if(categoria.estadoCategoria) {
                    const option = document.createElement('option');
                    option.value = categoria._id;
                    option.textContent = categoria.nombreCategoria;
                    selectCategorias.appendChild(option);
                }
            });
            return categorias; // Retornamos las categorías por si se necesitan en otro lugar
        })
        .catch(error => {
            console.error('Error al cargar categorías:', error);
            throw error;
        });
}