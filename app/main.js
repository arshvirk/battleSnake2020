const log = require('./logger');
const Board = require('./Board');
const eatAndHunt = require('./eatAndHunt');
const wallsAndMovesWithScore = require('./wallsAndMovesWithScore');
const key = require('./keys');


const moves = (request) => {
    log.status("\nGDHDHDDHDHDHDFHDHDFHDDFH      :       "+request.turn);
    const board = Board.getBoard(request);
    let data = {
        //[up,down,left,right]
        score: [0, 0, 0, 0],
        move: 'left'
    };
    // Deal with the wall and get the temp move
    data = wallsAndMovesWithScore.wallStuff(request, data,board);
    console.log("This is the data from walls encounter");
    console.log(data);

    // eat if there are no smaller snakes otherwise hunt
    if(request.you.health>=20) {
        const whichSnake = eatAndHunt.huntWhichSnake(request.you, request.board);
        if(!!whichSnake) {
            eatAndHunt.eatFoodOrHuntSnake(request.you, whichSnake, data,board);
        } else {
            const whichFood = eatAndHunt.eatWhichFood(request.you, request.board);
            eatAndHunt.eatFoodOrHuntSnake(request.you,whichFood,data,board);
        }
    } else {
        const whichFood = eatAndHunt.eatWhichFood(request.you, request.board);
        eatAndHunt.eatFoodOrHuntSnake(request.you,whichFood,data,board);
    }

    // the data after eating or hunting
    const arr = data.score;
    data = wallsAndMovesWithScore.whichBoxHasMinScore(arr,request.you,board,data);
    console.log("This is the data after eating or hunting");
    console.log(data);

   //  Check the spots available closest(N1) to the snake head.
    data = checkSurrounding(request.you, board, data, request.you.body[0].x, request.you.body[0].y,request);
    console.log("This is the data after surrounding");
    console.log(data);

    // openSpaceCheck(request, data, board,request.you.body[0].x, request.you.body[0].y);
  //  const last = [data.scoreU, data.scoreD, data.scoreL, data.scoreR];
  //  data.move = whichMove(last,request.you,board).move;
    console.log(data);

    return data.move;
};

const checkSurrounding =  (you, board, data, whereX, whereY,nice) => {

    if(whereX-1 >= 0 && board[(whereX-1)][whereY] !== "Y" && board[(whereX-1)][whereY] !== "S" && (board[(whereX-1)][whereY] !== "E" || you.body.length !==2)) {
        data.score[key.left] += calculateSurroundingScore(nice.you,board,(whereX-1),whereY,nice);
    } else {
        data.score[key.left] += 20000
    }
    if((whereX+1) <= (nice.board.width-1) && board[(whereX+1)][whereY] !== "Y" && board[(whereX+1)][whereY] !== "S" && (board[(whereX+1)][whereY] !== "E" || you.body.length !==2)) {
        data.score[key.right] += calculateSurroundingScore(nice.you,board,(whereX+1),whereY,nice);
    } else {
        data.score[key.right] += 20000
    }
    if(whereY-1 >= 0 && board[(whereX)][(whereY-1)] !== "Y" && board[(whereX)][(whereY-1)] !== "S" && (board[(whereX)][(whereY-1)] !== "E" || you.body.length !==2)) {
        data.score[key.up] += calculateSurroundingScore(nice.you,board,whereX,(whereY-1),nice);
    } else {
        data.score[key.up] += 20000
    }
    if(whereY+1 <= nice.board.height-1 && board[(whereX)][(whereY+1)] !== "Y" && board[(whereX)][(whereY+1)] !== "S" && (board[(whereX)][(whereY+1)] !== "E" || you.body.length !==2)) {
        data.score[key.down] += calculateSurroundingScore(nice.you,board,whereX,(whereY+1),nice);
    } else {
        data.score[key.down] += 20000
    }

    return wallsAndMovesWithScore.whichBoxHasMinScore(data.score,nice.you,board,data);
};

const calculateSurroundingScore = (you, board, whereX, whereY,nice, data) => {
    let score = 0;
    let countDead=0;
    let countWallDead=0;
    for (let i = 0; i < 4; i++) {
        let neighbourX = (whereX+key.neighbours[i].x);
        let neighbourY = (whereY+key.neighbours[i].y);

        if (0 <= neighbourX  && neighbourX <= nice.board.height-1 && 0 <= neighbourY && neighbourY <= nice.board.width-1) {
            if(board[neighbourX][neighbourY] === "H" || board[neighbourX][neighbourY] === "S"){
                if(board[neighbourX][neighbourY] === "S"){
                    countDead+=1;
                    score += 3000;
                }else{
                    score += 4000;
                }
            } else if(board[neighbourX][neighbourY] === "Y" || board[neighbourX][neighbourY] === "X") {
                countDead+=1;
                score += 500;
            }
            isHeadClose(board,neighbourX,neighbourY, score);
        } else {
            countWallDead+=1;
        }
    }
    if(countDead === 3 || countWallDead ===2) {
        score += 5000;
    }
    return score;
};

isHeadClose = (board, whereX, whereY, score) => {
    if(whereX-1 >= 0) {
        if (board[whereX - 1][whereY] === "H") {
            score += 7000;
        }
    }
    if(whereX+1 <= board.length-1) {
        if (board[whereX + 1][whereY] === "H") {
            score += 7000;
        }
    }
    if(whereY-1 >= 0) {
        if (board[whereX][whereY - 1] === "H") {
            score += 7000;
        }
    }
    if(whereY+1 <= board.length-1) {
        if (board[whereX][whereY+1] === "H") {
            score += 7000;
        }
    }
    return score;

};

module.exports = {
    moves
};
