const { saveReport, 
    getAllReportsByUserId, 
    getAllServicesByUserId, 
    userConnected, 
    userDisconnected, 
    editReport, 
    calificarService, 
    getAllServices, 
    assignService, 
    finalizedService, 
    getAdminRole, 
    initService } = require("../controllers/socket.controllers");
const { comprobarJWT } = require("../helpers/jwt.helper");


class Sockets {

    constructor( io ) {
        this.io = io;

        this.socketsEvents();
    }


    socketsEvents() {
        
        // On connection
        this.io.on('connection', async ( socket ) => {
        
            console.log('TOKEN')
            console.log(socket.handshake.query['accessToken'])

            console.log('QUERY')
            console.log(socket.handshake.query)
            // Validar que el token sea valido
            const [ valid, id, role ] = comprobarJWT( socket.handshake.query['accessToken'] )

            if ( !valid ) {
                console.log('Socket no identificado');
                return socket.disconnect();
            }
            // Conectar y actualzar en la db
            // console.log('Cliente conectado', id)
            console.log('Cliente conectado')
            console.log({id, role})
            await userConnected( id );

            // Emitir lista de usuarios a TODOS
            // this.io.emit('users-list', await getAllUsers() );

        
            
            // Unir al usuario a una sala
            socket.join( id );
            

            if ( role == 'USER_ROLE' ) {
                // Si es un departamento, emitir su lista de reportes
                this.io.to( id ).emit('reports-list', await getAllReportsByUserId( id ) )
            } else if ( role == 'SITE_ROLE' ) {
                // Si es un chico de servicio, emitir su lista de servicios
                this.io.to( id ).emit('services-list', await getAllServicesByUserId( id ) )
            } else {
                this.io.to( id ).emit('services-all', await getAllServices() )
            }
        
            // Escuchar del cliente nuevo reporte (depto-report)
            socket.on('depto-report', async ( payload ) => {
                // console.log(payload)
                
                // Guardar reporte en la base de datos
                const service = await saveReport( payload );
            
                // Emitir el reporte al usuario admin 
                this.io.to( payload.to ).emit('services-all', await getAllServices() )

                // Emitir el reporte al usuario que emitio
                this.io.to( payload.from ).emit('reports-list', await getAllReportsByUserId( id ) )
 

            })


            // Escuchar del cliente edit report
            socket.on('edit-report', async ( payload ) => {
                // console.log(payload)
                
                // Guardar reporte en la base de datos
                const service = await editReport( payload );
            
                // TODO : Emitir el reporte al usuario admin (reporte editado)

                // Emitir servicios al usuario que emitio
                this.io.to( payload.from ).emit('reports-list', await getAllReportsByUserId( id ) )


            })


            socket.on('assigned', async ( payload ) => {
                const service = await assignService( payload );
                console.log(service)
                //devolver al admin el listado
                this.io.to( payload.from ).emit('services-all', await getAllServices() )

                // Emitir al user la lista
                this.io.to( payload.to ).emit('services-list', await getAllServicesByUserId( payload.to ) )

                // Emitir al usuario depto sus reportes
                this.io.to( payload.depto  ).emit('reports-list', await getAllReportsByUserId( payload.depto ) )

            })




            socket.on('start', async ( payload ) => {


                const admin = await getAdminRole()


                await initService( payload );

                 //devolver al admin el listado
                 this.io.to( admin._id ).emit('services-all', await getAllServices() )

                 // Emitir al user site la lista
                 this.io.to( payload.from ).emit('services-list', await getAllServicesByUserId( payload.from ) )
 
                 // Emitir al usuario depto sus reportes
                 this.io.to( payload.to  ).emit('reports-list', await getAllReportsByUserId( payload.to ) )

            })

            socket.on('finish', async ( payload ) => {


            })




             // Escuchar del cliente calificar report
             socket.on('calificar-report', async ( payload ) => {
                // console.log(payload)
                
                // Guardar reporte en la base de datos
                const service = await calificarService( payload );
            
                // TODO : Emitir el reporte al usuario admin (reporte calificado)

                // Emitir servicios al usuario que emitio
                // this.io.to( payload.from ).emit('reports-list', await getAllReportsByUserId( id ) )


            })



            socket.on('finalize-service', async ( payload ) => {
                // console.log(payload)
                
                // Guardar reporte en la base de datos
                const service = await finalizedService( payload );
            
                // Emitir listados
                //devolver al admin el listado
                this.io.to( payload.to ).emit('services-all', await getAllServices() )

                // Emitir al user site la lista
                this.io.to( payload.from ).emit('services-list', await getAllServicesByUserId( payload.from ) )

                // Emitir al usuario depto sus reportes
                this.io.to( payload.service.user  ).emit('reports-list', await getAllReportsByUserId( payload.service.user ) )

            })




            // Desconectar y actualzar en la db
            socket.on('disconnect', async () => {
                console.log('Cliente desconectado');
                await userDisconnected( id );
                // this.io.emit('users-list', await getAllUsers() );
            })
        
        })

    }


}


module.exports = Sockets;