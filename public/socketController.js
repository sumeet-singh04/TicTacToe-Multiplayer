/**
 * Created by Sumeet on 21-Feb-16.
 */


angular.module('ticTacToe').controller('gameCtrl', ['$scope', '$uibModal', function ($scope, $modal) {
    var socketCtrl = this;

    var socket, game = {
            gameId: '',
            playerOne: '',
            playerTwo: '',
            isPlayerOne: false,
            currentTurn: 'X'
        },
        waitingModalInstance;

    function initGameGrid() {
        //Used to store current game state.
        socketCtrl.gameGrid = [['', '', ''], ['', '', ''], ['', '', '']];
    }

    initGameGrid();

    var initModalScope = $scope.$new();

    var waitingModalScope = $scope.$new();

    var lostWonModalScope = $scope.$new();


    var initModalOptions = {
        templateUrl: 'initial-modal.html',
        scope: initModalScope,
        backdrop: 'static'
    };

    var waitingForPlayerModal = {
        templateUrl: 'waiting-modal.html',
        scope: waitingModalScope,
        backdrop: 'static'
    };

    var lostWonModal = {
        templateUrl: 'lost-won-modal.html',
        scope: lostWonModalScope,
        backdrop: 'static'
    }

    function initNewGame(name) {
        game.playerOne = initModalScope.playerName;
        socket.emit('newGame', {name: name});
    }

    function joinGame(gameId, name) {
        game.gameId = gameId;
        socket.emit('joinGame', {id: gameId, name: name});
    }


    function createConnection() {
        socket = io();
        bindSocketEvents();
        var modalInstance = $modal.open(initModalOptions);
        modalInstance.result.then(function (data) {
            //New game
            if (data.newGame) {
                //trigger initGame and show waiting for other player modal with ID.
                initNewGame(data.playerName);
                game.isPlayerOne = true;
            }
            //Join old game
            else {
                // trigger join game.
                joinGame(data.gameId, data.playerName);
            }
        });
    }

    socketCtrl.setCol = function (index, row) {
        row[index] = socketCtrl.currentTerm;
        //Update game here.
        socket.emit('madeTurn', {id: game.gameId, gameArr: socketCtrl.gameGrid, playerAlph: socketCtrl.currentTerm});

        waitingModalScope.waitingFor = game.isPlayerOne ? game.playerTwo : game.playerOne;
        waitingModalInstance = $modal.open(waitingForPlayerModal);
        //Show waiting dialog.

    };

    socketCtrl.setCurrentTurn = function (isGameJoined) {
        if (isGameJoined) {
            socketCtrl.currentTerm = 'O';
        } else {
            socketCtrl.currentTerm = 'X';
        }
    };

    function handleNewGame() {
        //Show waiting for other player modal with game Id.
        waitingModalScope.gameId = game.gameId;
        waitingModalScope.hasOtherPlayerJoined = false;
        waitingModalInstance = $modal.open(waitingForPlayerModal);

    }

    //either of handleNewPLayer or handleJoinGame runs.
    function handleNewPlayer(name) {
        //handle joining of other player here.
        game.playerTwo = name;
        waitingModalScope.hasOtherPlayerJoined = true;
        waitingModalScope.isPlayerFirst = true;
        waitingModalInstance.close();
        socketCtrl.setCurrentTurn();
    }

    function handleJoinGame(data) {
        console.log("old game found. Create waiting for player one");
        game.playerOne = data.name;
        waitingModalScope.hasOtherPlayerJoined = true;
        waitingModalScope.waitingFor = game.playerOne;
        waitingModalInstance = $modal.open(waitingForPlayerModal);
        socketCtrl.setCurrentTurn(true);

    }


    function bindSocketEvents() {
        //Add scope.$apply() after all these.

        socket.on('newGameResult', function (data) {
            $scope.$apply(function () {
                console.log("Got game id back : " + data.id);
                game.gameId = data.id;
                handleNewGame(data);
            });
        });

        socket.on('newPlayerJoined', function (data) {
            $scope.$apply(function () {
                console.log('new player joined in.')
                handleNewPlayer(data.name);
            })
        });

        socket.on('joinGameResult', function (data) {
            $scope.$apply(function () {
                console.log('game found');
                handleJoinGame(data);
            });
        });

        socket.on('updateGame', function (data) {
            console.log("update received");

            $scope.$apply(function () {
                socketCtrl.gameGrid = data.gameArr;
                waitingModalInstance.close();
            });
        });

        socket.on('decision', function (data) {
            $scope.$apply(function () {
                waitingModalInstance.close();
                if (data.hasWon) {
                    //You won.
                    lostWonModalScope.hasWon = true;
                } else {
                    //You lost.
                    lostWonModalScope.hasWon = false;
                }

                //Show modal
                var result = $modal.open(lostWonModal);

                result.then(function () {
                    playAgain();
                }, function () {
                    //TODO handle I quit button.
                });
            });
        });

        function playAgain() {
            initGameGrid();
            socket.emit('playAgain', {id: game.gameId});
        }

        socket.on('tie', function () {
            $scope.$apply(function () {

                lostWonModalScope.isTie = true;

                $modal.open(lostWonModal).then(function () {
                    playAgain();
                }, function() {
                    //TODO handle I quit button.
                });
            });
        });

        socket.on('playAgain', function () {
            $scope.$apply(function () {
                initGameGrid();
                waitingModalScope.waitingFor = game.isPlayerOne ? game.playerTwo : game.playerOne;
                waitingModalInstance = $modal.open(waitingForPlayerModal);
            });
        });

        socket.on('gameError', function (data) {
            //TODO take error message to modal popup.
            console.error(data.message);
        });
    }

    createConnection();
}]);
