var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require("underscore");

var clients = {};


http.listen(27544, function () {
    console.log('listening on *:27544');
});


io.on('connection', function (socket) {
    clients[socket.id] = socket;
    socket.on('disconnect', function () {
        delete clients[socket.id];
    });

    function filtra(nome, clients) {
        return _.filter(clients, function (s, k) {
            return (s.nome == nome) ? s : false
        })
    }

    socket.on('collega', function (nome) {
        if (!(nome)) {
            socket.emit("collegato", "");
            if(socket.remoto) socket.leave(remoto);
          
            return false
        }

        filtrati = filtra(nome, clients)
        if (filtrati.length > 0) {
            socket.emit("collegato", nome)
            socket.remoto = nome
            socket.join(nome);
            
        } else {
        
            if(socket.remoto) socket.leave(socket.remoto);
            
            socket.emit("collegato", "")
        }

    });


    socket.on('registra', function (nome) {
        if (!(nome)) {
            socket.nome = "";
            
            socket.emit("conferma", "")
            return false
        }
        if (socket.nome == nome) return socket.emit("conferma", socket.nome);
        filtrati = filtra(nome, clients)
        if (filtrati.length == 0) {
            socket.nome = nome
            
            socket.emit("conferma", nome)
        } else {
            socket.emit("rifiuta", nome)
        }

    });

    socket.on('send_video', function (nome, video) {
        if (!(nome)) return false
        filtrati = filtra(nome, clients)

        if (filtrati.length) {
            
            filtrati[0].emit("recive_video", socket.id, video)
        } else {
            
        }
    });


    socket.on('send_pause', function (nome) {
        if (!(nome)) return false
        filtrati = filtra(nome, clients)

        if (filtrati.length) {
            
            filtrati[0].emit("recive_pause", socket.id)
        } else {
            
        }
    });

    socket.on('send_play', function (nome) {
        if (!(nome)) return false
        filtrati = filtra(nome, clients)

        if (filtrati.length) {
            
            filtrati[0].emit("recive_play", socket.id)
        } else {
            
        }

    });

    socket.on('send_volume', function (nome, volume) {
        if (!(nome)) return false
        filtrati = filtra(nome, clients)

        if (filtrati.length) {
            
            filtrati[0].emit("recive_volume", socket.id, volume)
        } else {
            
        }
    });
    
    
    /////////////////////////
    
    
    socket.on('sync_volume', function (nome, volume) {
        io.to(nome).emit('sync_volume', volume)
        
    });

})