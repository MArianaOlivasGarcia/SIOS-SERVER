const getMenuFrontEnd = ( role = 'user_role' ) => {

    if ( role == 'SITE_ROLE' ) {
        return [
            { titulo: 'Inicio', icono: 'fas fa-user-alt mr-2', url: 'inicio' },
            { titulo: 'Mis servicios', icono: 'fas fa-user-alt mr-2', url: 'mis-servicios' },
            { titulo: 'Inventario',  icono: 'fas fa-newspaper mr-2', url: 'inventario' },
        ];
    }

    if ( role == 'USER_ROLE' ) {
        return [
            { titulo: 'Inicio', icono: 'fas fa-user-alt mr-2', url: 'inicio' },
            { titulo: 'Mis reportes', icono: 'fas fa-user-alt mr-2', url: 'mis-reportes' },
        ];
    }

    if ( role == 'ADMIN_ROLE' ) {
        return [
            { titulo: 'Solicitudes', icono: 'fas fa-user-alt mr-2', url: 'solicitudes' },
            { titulo: 'Servicios', icono: 'fas fa-user-alt mr-2', url: 'servicios' },
            { titulo: 'Ordenes',     icono: 'fas fa-newspaper mr-2', url: 'ordenes' },
            { titulo: 'Inventario',  icono: 'fas fa-newspaper mr-2', url: 'inventario' },
            { titulo: 'Usuarios', icono: 'fa-solid fa-users', url: 'usuarios' },
            { titulo: 'Departamentos', icono: 'fa-solid fa-users', url: 'departamentos' },
        ];
    }
      

}



const getCategoriesReport = () => {
    return [
        'Categoria 1',
        'Categoria 2',
        'Categoria 3',
        'Categoria 4',
        'Categoria 5'
    ]
}


module.exports = {
    getMenuFrontEnd,
    getCategoriesReport
}