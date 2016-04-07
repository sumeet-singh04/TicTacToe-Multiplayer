var shortid = require('shortid');

var GameSocket = function () {


    return {
        players: [],
        playerSockets: {},
        setPlayer: function (socket, name) {
            this.players.push({id: socket.id, name: name});
            this.playerCount++;
            this.playerSockets[socket.id] = socket;
        },
        getNextPlayerSocketId: function (socket) {
           return this.playerSockets[this.getNextPlayer(socket).id];
        },
        getNextPlayer: function (socket) {
            if (this.players[0].id === socket.id) {
                return this.players[1];
            } else {
                return this.players[0];
            }
        },
        currentGameArray: [[], [], []],
        playerCount: 0,
        gameId: shortid.generate(),
        turnsTaken:0,
        score: {
            playerOne: 0,
            playerTwo: 0
        }
    }
};


module.exports = GameSocket;