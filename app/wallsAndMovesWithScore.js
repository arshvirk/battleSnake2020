const key = require('./keys');

const wallStuff = (request, data,board) => {
    const x = request.you.body[0].x;
    const y = request.you.body[0].y;
    const wall1 = {x: 0}
    const wall2 = {y: 0}
    const wall3 = {y: request.board.height}
    const wall4 = {x: request.board.width}
    if (request.you.body[0].x === wall1.x) {
        data = whenWall(x,y,request,data,board);
    }
    if (request.you.body[0].y === wall2.y) {
        data = whenWall(x,y,request,data,board);
    }
    if (request.you.body[0].x === wall4.x - 1) {
        data= whenWall(x,y,request,data,board);
    }
    if (request.you.body[0].y === wall3.y - 1) {
        data = whenWall(x,y,request,data,board);
    }
    return data;
};

const whenWall = (x,y,request,data,board) => {
    let scoreD =0;
    let scoreU=0;
    let scoreL=0;
    let scoreR=0;
    let whereX = x;
    let whereY = y;
    if(whereX-1 >= 0 && board[(whereX-1)][whereY] !== "Y" && board[(whereX-1)][whereY] !== "E") {
        scoreL = calculateScore(board,(whereX-1),whereY,request);
    } else {
        scoreL = 20000
    }
    if((whereX+1) <= (request.board.width-1) && board[(whereX+1)][whereY] !== "Y" && board[(whereX+1)][whereY] !== "E") {
        scoreR = calculateScore(board,(whereX+1),whereY,request);
    } else {
        scoreR = 20000
    }
    if(whereY-1 >= 0 && board[(whereX)][(whereY-1)] !== "Y" && board[(whereX)][(whereY-1)] !== "E") {
        scoreU = calculateScore(board,whereX,(whereY-1),request);
    } else {
        scoreU = 20000
    }
    if(whereY+1 <= request.board.height-1 && board[(whereX)][(whereY+1)] !== "Y" && board[(whereX)][(whereY+1)] !== "E") {
        scoreD = calculateScore(board,whereX,(whereY+1),request);
    } else {
        scoreD = 20000
    }
    const arr =[scoreU,scoreD,scoreL,scoreR];
    console.log(arr);
    return whichBoxHasMinScore(arr,request.you,board,data);
};

const calculateScore = (board, whereX, whereY,nice) => {
    let score = 0;
    for (let i = 0; i < 4; i++) {
        let neighbourX = (whereX+key.neighbours[i].x);
        let neighbourY = (whereY+key.neighbours[i].y);

        if (0 <= neighbourX  && neighbourX <= nice.board.height-1 && 0 <= neighbourY && neighbourY <= nice.board.width-1) {
            if(board[neighbourX][neighbourY] === "H" || board[neighbourX][neighbourY] === "S"){
                if(board[neighbourX][neighbourY] === "S"){
                    score += 1000;
                }else{
                    score += 990;
                }
            } else if(board[neighbourX][neighbourY] === "Y" || board[neighbourX][neighbourY] === "X"|| board[neighbourX][neighbourY] === "E") {
                if(board[neighbourX][neighbourY] === "E") {
                    score += 5000;
                } else {
                    score += 1000;
                }
            }
        } else {
            score += 2000;
        }
    }
    return score;
};

const getKind = (value) => {
    if(value === "up"){
        return key.up;
    }
    if(value === "down"){
        return key.down;
    }
    if(value === "left"){
        return key.left;
    }
    if(value === "right"){
        return key.right;
    }
};

const whichBoxHasMinScore = (arr, you, board, data) => {
    let minScore = arr[key.up];
    let move = key.DIRECTION[key.up];
    for(let i = 1; i < 4; i++) {
        if(arr[i] <= minScore ) {
            if(minScore === arr[i] && data.score[i] < data.score[getKind(move)]) {
            } else {
                minScore = arr[i];
                move = key.DIRECTION[i];
            }
        }
    }
    data.move =  move;
    data.score = arr;
    return data;
};

module.exports = {
    wallStuff,
    calculateScore,
    whichBoxHasMinScore,
    getKind,
}