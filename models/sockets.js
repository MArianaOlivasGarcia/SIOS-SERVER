const { saveReport, getAllReportsByUserId, getAllServicesByUserId, userConnected, userDisconnected, editReport } = require("../controllers/socket.controllers");
const { comprobarJWT } = require("../helpers/jwt.helper");


class Sockets {

    constructor( io ) {
        this.io = io;

        this.socketsEvents();
    }


    socketsEvents() {
        
        // On connection
        this.io.on('connection', async ( socket ) => {
        
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
            } 
        
            // Escuchar del cliente nuevo reporte (depto-report)
            socket.on('depto-report', async ( payload ) => {
                // console.log(payload)
                
                // Guardar reporte en la base de datos
                const service = await saveReport( payload );
            
                // Emitir el reporte al usuario admin 
                this.io.to( payload.to ).emit('new-service', {...service} )

                // Emitir el reporte al usuario que emitio
                this.io.to( payload.from ).emit('reports-list', await getAllReportsByUserId( id ) )


            })


            // Escuchar del cliente edit report
            socket.on('edit-report', async ( payload ) => {
                // console.log(payload)
                
                // Guardar reporte en la base de datos
                const service = await editReport( payload );
            
                // TODO : Emitir el reporte al usuario admin (reporte editado)

                // Emitir el reporte al usuario que emitio
                this.io.to( payload.from ).emit('reports-list', await getAllReportsByUserId( id ) )


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