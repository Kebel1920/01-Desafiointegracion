const Express = require('express');
const http = require ('http')
const SocketIo  = require ('socket.io');
const app = Express ();


const server = http.createServer(app);
const io = SocketIo (server);


io.on ('connection', (Socket)=> {
    console.log ('Un cliente se ha conectado');

    Socket.on ('newProduct',(products)=>{
        io.emit ('actualizarProductos', products);
    
    });

    Socket.on ('eliminaeProductos',(productId)=>{
        io.emit('productoEliminado',productId);
        
        });

});



const PORT = 8080
server.listen(PORT, () => {
    console.log (`servidor Express inicializado en el puerto ${PORT}`);

});