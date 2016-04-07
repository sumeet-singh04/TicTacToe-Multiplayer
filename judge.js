/**
 * Created by Sumeet on 04-Apr-16.
 */

function judge(gameArr, alph) {
    var i =0;

    if (gameArr[0][0] === alph) {
        if (gameArr[0][0] === gameArr[0][1] && gameArr[0][1] === gameArr[0][2]) {
            return true;
        } else if (gameArr[0][0] === gameArr[1][0] && gameArr[1][0] === gameArr[2][0]) {
            return true;
        } else if (gameArr[0][0] === gameArr[1][1] && gameArr[1][1] === gameArr[2][2]) {
            return true;
        }
    }

    if (gameArr[0][2] === alph) {
        if (gameArr[0][2] === gameArr[1][2] && gameArr[1][2] === gameArr[2][2]) {
            return true;
        } else if (gameArr[0][2] === gameArr[1][1] && gameArr[1][1] === gameArr[2][0]) {
            return true;
        }
    }

    if (gameArr[2][0] === alph) {
        if (gameArr[2][0] === gameArr[2][1] && gameArr[2][1] === gameArr[2][2]) {
            return true;
        }
    }

    if (gameArr[0][1] === alph) {
        if (gameArr[0][1] === gameArr[2][1] && gameArr[1][1] === gameArr[2][1]) {
            return true;
        }
    }

    if (gameArr[1][0] === alph) {
        if (gameArr[1][0] === gameArr[1][1] && gameArr[1][1] === gameArr[1][2]) {
            return true;
        }
    }

    return false;
}

module.exports = judge;