var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    gameSocket = require('./tictac/gameSockets'),
    judge = require('./judge');

var currentGames = {};


app.use(express.static('./public'));
app.use(express.static('./bower_components'));

app.get('/', function (req, res) {
    res.sendFile('./public/index.html');
});


//Get server and figure whats gonna happen, New game or join an existing game.
io.on('connection', function (socket) {
    console.log('New client connected');

    socket.on('newGame', function (data) {
        var newGame = gameSocket();
        newGame.setPlayer(socket, data.name);
        currentGames[newGame.gameId] = newGame;
        console.log('new game request accepted with Id : ' + newGame.gameId);
        socket.emit('newGameResult', {id: newGame.gameId, newGame: true});
    });

    socket.on('joinGame', function (data) {
        var prevGame = currentGames[data.id];
        console.log("request to join a game received with id : " + data.id);
        if (prevGame && prevGame.players.length === 1) {
            console.log('game found with id requested.');
            prevGame.setPlayer(socket, data.name);
            prevGame.getNextPlayerSocketId(socket).emit('newPlayerJoined', {name: data.name});
            socket.emit('joinGameResult', {id: prevGame.gameId, name: prevGame.getNextPlayer(socket).name});
        } else {
            socket.emit('gameError', {message: "Please check the game id."});
        }
    });

    socket.on('madeTurn', function (data) {
        console.log("update for game received : " + data.id);
        var prevGame = currentGames[data.id];
        if (prevGame) {
            prevGame.turnsTaken++;
            if (prevGame.turnsTaken >= 9) {
                //TODO it is a tie. Emit event to both players.
                socket.emit('tie');
                prevGame.getNextPlayerSocketId(socket).emit('tie');
            }
            prevGame.currentGameArray = data.gameArr;
            //TODO check win/loose situation.
            var result = judge(data.gameArr,data.playerAlph);
            if (result === true) {
                // Player won. Trigger win event to both players
                socket.emit('decision',{hasWon: true});
                prevGame.getNextPlayerSocketId(socket).emit('decision', {hasWon: false});
            } else {

                // No result. No one won. Just update game to the other player.
                prevGame.getNextPlayerSocketId(socket).emit('updateGame', {gameArr: data.gameArr, result: result});
            }
        } else {
            socket.emit('gameError', {message: "No game found to update with gameId : " + data.id});
        }
    });

    socket.on('disconnect', function () {
        console.log('client disconnected but not removed');
    });

    socket.on('playAgain', function(data) {
        var prevGame = currentGames[data.id];
        if(prevGame) {
            prevGame.getNextPlayerSocketId(socket).emit('playAgain');
        }
        else {
            socket.emit('gameError', {message: "No game found to update with gameId : " + data.id});
        }
    })
});


server.listen(3000, function () {
    console.log('connected');
});

