/**
 * Created by Sumeet on 21-Feb-16.
 */


var Game_Array = [[], [], []];
var nmbrOfMoves = 0;
var fillAlph = 'X';

function fill(locationX, locationY, sqrt) {

    if (!Game_Array[locationX][locationY]) {
        Game_Array[locationX][locationY] = fillAlph;
       // document.getElementById(sqrt).textContent = fillAlph;
    } else {
        return;
    }
    nmbrOfMoves++;
    var isWinner = checkWinner(fillAlph);
    if (isWinner) {
        alert(fillAlph + ' Won !');
        clear();
        nmbrOfMoves = 0;
    } else {
        if (nmbrOfMoves >= 9) {
            alert('Tie');
            clear();
            nmbrOfMoves = 0;
            return;
        }
        fillAlph = fillAlph === 'X' ? 'O' : 'X';
       // document.getElementById('nextTurn').textContent = 'Next Turn : ' + fillAlph;

    }

}

function clear() {
    for (var i = 1; i < 10; i++) {
        document.getElementById(i).textContent = '';
    }
    Game_Array = [[], [], []];
}

function checkWinner(alph) {
    if (Game_Array[0][0] === alph) {
        if (Game_Array[0][0] === Game_Array[0][1] && Game_Array[0][1] === Game_Array[0][2]) {
            return true;
        } else if (Game_Array[0][0] === Game_Array[1][0] && Game_Array[1][0] === Game_Array[2][0]) {
            return true;
        } else if (Game_Array[0][0] === Game_Array[1][1] && Game_Array[1][1] === Game_Array[2][2]) {
            return true;
        }
    } else if (Game_Array[0][2] === alph) {
        if (Game_Array[0][2] === Game_Array[1][2] && Game_Array[1][2] === Game_Array[2][2]) {
            return true;
        } else if (Game_Array[0][2] === Game_Array[1][1] && Game_Array[1][1] === Game_Array[2][0]) {
            return true;
        }
    } else if (Game_Array[2][0] === alph) {
        if (Game_Array[2][0] === Game_Array[2][1] && Game_Array[2][1] === Game_Array[2][2]) {
            return true;
        }
    } else if (Game_Array[0][1] === alph) {
        if (Game_Array[0][1] === Game_Array[2][1] && Game_Array[1][1] === Game_Array[2][1]) {
            return true;
        }
    } else if (Game_Array[1][0] === alph) {
        if (Game_Array[1][0] === Game_Array[1][1] && Game_Array[1][1] === Game_Array[1][2]) {
            return true;
        }
    }
    return false;

}

var render = function (gameArr) {
    gameArr.forEach(function(row,index) {
        row.forEach(function(col, ind) {
            document.getElementById(index+ind+1).textContent = col;
        });
    });
};




//Add code for web sockets.
window.onload = function () {

    var ctrl = window.socketCtrl.createConnection();
    var pageHandler = window.pageHandler.createPage();

    window.handleNewGame = function(gameData) {
        document.getElementById('newOldModal').style.display = 'none';

        if(gameData.newGame) {
            document.getElementById('modalOverlay').style.display = 'none';
            document.getElementById('nextTurn').innerHTML = 'You have created a new game.' +
                ' Share this <input value="'+gameData.id+'" readonly/> with your partner.'
        } else {
            document.getElementById('nextTurn').innerHTML = 'You have joined a game with '+gameData.name;

        }

    };

    window.handleNewPlayer = function(name) {
        document.getElementById('nextTurn').innerHTML =  document.getElementById('nextTurn').innerHTML+
            '<br/>'+name+' Just joined in. It\'s your first turn';
    };

    document.getElementById('new-game').addEventListener('click', function () {
        var name = document.getElementById('name').value;
        if (name) {
            ctrl.initNewGame(name, handleNewGame);
        } else {
            alert("Enter player name");
        }
    });

    document.getElementById('join-game').addEventListener('click', function () {
        var name = document.getElementById('name').value;
        var gameId = document.getElementById('gameId').value;

        if (name && gameId) {
            ctrl.joinGame(gameId, name);
        } else {
            alert("Enter name and game id to join.");
        }
    });
}
