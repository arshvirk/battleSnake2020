const log = require('./logger')
const Board = require('./Board')

const moves = (nice) => {
    const board = Board.getBoard(nice)
    let data = {
        scoreU: 0,
        scoreD: 0,
        scoreL: 0,
        scoreR: 0,
        move: 'left', // one of: ['up','down','left','right']
    };
    data.move = wallStuff(nice, data,board).move;

    if(nice.you.health>=20) {
        const whichSnake = huntWhichSnake(nice.you, nice.board);
        if(!!whichSnake) {
            huntSnake(nice.you, whichSnake, data);
        } else {
            const whichFood = eatWhichFood(nice.you, nice.board);
            eatFood(nice.you,whichFood,data,board);
        }
    } else {
        const whichFood = eatWhichFood(nice.you, nice.board);
        eatFood(nice.you,whichFood,data,board);
    }

    const arr = [data.scoreU, data.scoreD, data.scoreL, data.scoreR];
    data.move = whichMove(arr,nice.you,board).move;
    let whatNextX= whichMove(arr,nice.you,board).x;
    let whatNextY= whichMove(arr,nice.you,board).y;
    inNextSurrounding(nice.you,board,data,nice.you.body[0].x+whatNextX, nice.you.body[0].y+whatNextY,data.move);

    const StarnewArr = [data.scoreU, data.scoreD, data.scoreL, data.scoreR];
    data.move = whichMove(StarnewArr,nice.you,board).move;

    inSurrounding(nice.you,board,data,nice.you.body[0].x, nice.you.body[0].y);

    const newArr = [data.scoreU, data.scoreD, data.scoreL, data.scoreR];
    data.move = whichMove(newArr,nice.you,board).move;

    return data;
};

const wallStuff = (nice, data,board) => {
    const x = nice.you.body[0].x;
    const y = nice.you.body[0].y;
    const wall1 = {x: 0}
    const wall2 = {y: 0}
    const wall3 = {y: nice.board.height}
    const wall4 = {x: nice.board.width}
    if (nice.you.body[0].x === wall1.x) {
        if (nice.you.body[0].y === wall3.y - 1) {
            data.move = whenWall(x,y,nice,data,board);
        } else {
            data.move = whenWall(x,y,nice,data,board);
        }
        data.scoreL+=-1000;
    }
    if (nice.you.body[0].y === wall2.y) {
        data.move = whenWall(x,y,nice,data,board);
        data.scoreU+=-1000;
    }
    if (nice.you.body[0].x === wall4.x - 1) {
        data.move = whenWall(x,y,nice,data,board);
        data.scoreR+=-1000;
    }
    if (nice.you.body[0].y === wall3.y - 1) {
        data.move = whenWall(x,y,nice,data,board);
        data.scoreD+=-1000;
    }
    if (nice.you.body[0].x === wall1.x && nice.you.body[0].y === wall2.y) {
        data.move = whenWall(x,y,nice,data,board);
        data.scoreL+=-1000;
        data.scoreU+=-1000;
    }
    if (nice.you.body[0].x === wall1.x && nice.you.body[0].y === wall3.y - 1) {
        data.move = whenWall(x,y,nice,data,board);
        data.scoreL+=-1000;
        data.scoreD+=-1000;
    }
    return data;
};

const whenWall = (x,y,nice,data,board) => {
    let scoreD =0;
    let scoreU=0;
    let scoreL=0;
    let scoreR=0;
    let whereX = x;
    let whereY = y;
    if(whereX-1 >= 0) {
        scoreL = -pointScore(nice.you,board,whereX-1,whereY);
    }
    if(whereX+1 <= nice.board.length-1) {
        scoreR = -pointScore(nice.you,board,whereX+1,whereY);
    }
    if(whereY-1 >= 0) {
        scoreU = -pointScore(nice.you,board,whereX,whereY-1);
    }
    if(whereY+1 <= nice.board.width-1) {
        scoreD = -pointScore(nice.you,board,whereX,whereY+1);
    }

    const arr =[-scoreU,-scoreD,-scoreL,-scoreR];
    return whichMove(arr,nice.you,board).move;
};

const distance = (a,b) => {
   const dis = Math.abs((a.x-b.x)) + Math.abs((a.y - b.y));
   return dis;
};

const eatWhichFood = (you,board) => {
    let whereX = you.body[0].x;
    let whereY = you.body[0].y;
    let distanceMin = 100;
    let whichFood;

    for(let i = 0; i < board.food.length; i++) {
        let foodX = board.food[i].x;
        let foodY = board.food[i].y;
        if (distance({x: whereX, y: whereY},{x:foodX,y:foodY}) < distanceMin) {
            distanceMin = distance({x: whereX, y: whereY},{x:foodX,y:foodY});
            whichFood = {x:foodX, y: foodY};
        }
    }
    return whichFood;
};

const eatFood = (you, whichFood, data,board) => {
    let whereX = you.body[0].x;
    let whereY = you.body[0].y;
    if( whereX < whichFood.x && (board[whereX+1][whereY] !== "H" || board[whereX+1][whereY] !== "S" || board[whereX+1][whereY] !== "Y")) {
         data.scoreR+=10;
    }
    if( whereX > whichFood.x && (board[whereX-1][whereY] !== "H" || board[whereX-1][whereY] !== "S" || board[whereX-1][whereY] !== "Y")) {
        data.scoreL+=10;
    }
    if( whereY < whichFood.y && (board[whereX][whereY+1] !== "H" || board[whereX][whereY+1] !== "S" || board[whereX][whereY+1] !== "Y")) {
        data.scoreD+=10;
    }
    if( whereY > whichFood.y && (board[whereX][whereY] !== "H" || board[whereX][whereY-1] !== "S" || board[whereX][whereY-1] !== "Y")) {
        data.scoreU+=10;
    }
};

const huntWhichSnake = (you,board) => {
    let whereX = you.body[0].x;
    let whereY = you.body[0].y;
    let distanceMin = 100;
    let whichSnake;
    let snakeX=whereX;
    let snakeY=whereY;

    for(let i = 0; i < board.snakes.length; i++) {
        if(board.snakes[i].id !== you.id && board.snakes[i].body.length < you.body.length && distance({x: whereX, y: whereY},{x:snakeX,y:snakeY}) < distanceMin) {
            snakeX = board.snakes[i].body[0].x;
            snakeY = board.snakes[i].body[0].y;
            distanceMin = distance({x: whereX, y: whereY},{x:snakeX,y:snakeY});
            whichSnake = {x:snakeX, y: snakeY};
        }
    }
    return whichSnake;
};

const huntSnake = (you, whichSnake, data) => {
    let whereX = you.body[0].x;
    let whereY = you.body[0].y;
    if( whereX< whichSnake.x) {
        data.scoreR+=10;
    }
    if( whereX > whichSnake.x) {
        data.scoreL+=10;
    }
    if( whereY< whichSnake.y) {
        data.scoreD+=10;
    }
    if( whereY> whichSnake.y) {
        data.scoreU+=10;
    }
};

const pointScore = (you, board,whereX, whereY) => {
    let score = 0;
    if(whereX-1 >= 0) {
        if(board[whereX-1][whereY] === "H" || board[whereX-1][whereY] === "S"){
            if(board[whereX-1][whereY] === "S"){
                score = 1000;
            }else{
                score += 100;
            }
        } else if(board[whereX-1][whereY] === "Y" || board[whereX-1][whereY] === "X") {
            score = 1000;
        }
    } else {
        score = 1000;
    }
    if(whereX+1 <= board.length-1) {
        if(board[whereX+1][whereY] === "H" || board[whereX+1][whereY] === "S"){
            if(board[whereX+1][whereY] === "S"){
                score = 1000;
            }else{
                score += 100;
            }
        } else if(board[whereX+1][whereY] === "Y" || board[whereX+1][whereY] === "X") {
            score  = 1000;
        }
    } else {
        score = 1000;
    }
    if(whereY-1 >= 0) {
        if(board[whereX][whereY-1] === "H" || board[whereX][whereY-1] === "S"){
            if(board[whereX][whereY-1] === "S"){
                score  = 1000;
            }else{
                score  += 100;
            }
        } else if(board[whereX][whereY-1] === "Y" || board[whereX][whereY-1] === "X") {
            score  = 1000;
        }
    } else {
        score = 1000;
    }
    if(whereY+1 <= board.length-1) {
        if(board[whereX][whereY+1] === "H" || board[whereX][whereY+1] === "S"){
            if(board[whereX][whereY+1] === "S"){
                score  = 1000;
            }else{
                score  += 100;
            }
        } else if(board[whereX][whereY+1] === "Y" || board[whereX][whereY+1] === "X") {
            score  = 1000;
        }
    } else {
        score = 1000;
    }
    return score;
};

const whichMove = (arr,you,board) => {
    let whichNextX=0;
    let whichNextY=0;
    let move = 'up';
    let max = arr[0];
    if(arr[1] >= max){
        if(max === arr[1] && pointScore(you,board,you.body[0].x,you.body[0].y+1) > pointScore(you,board,you.body[0].x,you.body[0].y-1)){
            max = arr[0];
            move = 'up'
        } else {
            max = arr[1];
            move = 'down'
        }
    }
    if(arr[2] >= max){
        if(max === arr[2]) {
            if(move === 'up') {
                if(pointScore(you,board,you.body[0].x-1,you.body[0].y) > pointScore(you,board,you.body[0].x,you.body[0].y-1)) {
                    max = arr[0]
                    move = 'up'
                } else {
                    max = arr[2];
                    move = 'left'
                }
            } else if (move === 'down') {
                if(pointScore(you,board,you.body[0].x-1,you.body[0].y) > pointScore(you,board,you.body[0].x,you.body[0].y+1)) {
                    max = arr[1]
                    move = 'down'
                } else {
                    max = arr[2];
                    move = 'left'
                }
            }
        } else {
            max = arr[2];
            move = 'left'
        }
    }
    if(arr[3] >= max){
        if(max === arr[3]) {
            if(move === 'up') {
                if(pointScore(you,board,you.body[0].x+1,you.body[0].y) > pointScore(you,board,you.body[0].x,you.body[0].y-1)) {
                    max = arr[0]
                    move = 'up'
                } else {
                    max = arr[3];
                    move = 'right'
                }
            } else if (move === 'down') {
                if(pointScore(you,board,you.body[0].x+1,you.body[0].y) > pointScore(you,board,you.body[0].x,you.body[0].y+1)) {
                    max = arr[1]
                    move = 'down'
                } else {
                    max = arr[3];
                    move = "right"
                }
            } else if (move === 'left') {
                if(pointScore(you,board,you.body[0].x+1,you.body[0].y) > pointScore(you,board,you.body[0].x-1,you.body[0].y)) {
                    max = arr[2]
                    move = 'left'
                } else {
                    max = arr[3];
                    move = 'right'
                }
            }
        } else {
            max = arr[3];
            move = 'right'
        }
    }
    switch (move) {
        case "up":
            whichNextY=-1;
            break;
        case "down":
            whichNextY=1;
            break;
        case "left":
            whichNextX=-1;
            break;
        case "right":
            whichNextX=1;
    }
    return {move: move,x: whichNextX, y: whichNextY};
}

const inSurrounding = (you, board, data, whereX, whereY) => {
    if(whereX-1 >= 0) {
        if(board[whereX-1][whereY] === "H" || board[whereX-1][whereY] === "S"){
            if(board[whereX-1][whereY] === "S"){
                data.scoreL = -1000;
            }else{
                data.scoreL += -100;
            }
        } else if(board[whereX-1][whereY] === "Y" || board[whereX-1][whereY] === "X") {
            data.scoreL = -1000;
        }
    }
    if(whereX+1 <= board.length-1) {
        if(board[whereX+1][whereY] === "H" || board[whereX+1][whereY] === "S"){
            if(board[whereX+1][whereY] === "S"){
                data.scoreR = -1000;
            }else{
                data.scoreR += -100;
            }
        } else if(board[whereX+1][whereY] === "Y" || board[whereX+1][whereY] === "X") {
            data.scoreR = -1000;
        }
    }
    if(whereY-1 >= 0) {
        if(board[whereX][whereY-1] === "H" || board[whereX][whereY-1] === "S"){
            if(board[whereX][whereY-1] === "S"){
                data.scoreU = -1000;
            }else{
                data.scoreU += -100;
            }
        } else if(board[whereX][whereY-1] === "Y" || board[whereX][whereY-1] === "X") {
            data.scoreU = -1000;
        }
    }
    if(whereY+1 <= board.length-1) {
        if(board[whereX][whereY+1] === "H" || board[whereX][whereY+1] === "S"){
            if(board[whereX][whereY+1] === "S"){
                data.scoreD = -1000;
            }else{
                data.scoreD += -100;
            }
        } else if(board[whereX][whereY+1] === "Y" || board[whereX][whereY+1] === "X") {
            data.scoreD = -1000;
        }
    }
};

const inNextSurrounding = (you, board, data, whereX, whereY, originalMove) => {
    switch (originalMove) {
        case "up":
            caseUp(board, data, whereX, whereY);
            break;
        case "down":
            caseDown(board, data, whereX, whereY);
            break;
        case "left":
            caseLeft(board, data, whereX, whereY);
            break;
        case "right":
            caseRight(board, data, whereX, whereY);
    }
};


const caseUp = (board,data, whereX, whereY) => {
    if(whereX-1 >= 0) {
        if(board[whereX-1][whereY] === "H"){
            data.scoreU += -200;
            data.scoreD += 20;
        } else if(board[whereX-1][whereY] === "S"){
            data.scoreU += -300;
            data.scoreD += 30;
        }
    }
    if(whereX+1 <= board.length-1) {
        if(board[whereX+1][whereY] === "H"){
            data.scoreU += -200;
            data.scoreD += 20;
        } else if(board[whereX+1][whereY] === "S"){
            data.scoreU += -300;
            data.scoreD += 30;
        }
    }
    if(whereY-1 >= 0) {
        if(board[whereX][whereY-1] === "H"){
            data.scoreU += -200;
            data.scoreD += 20;
        } else if(board[whereX][whereY-1] === "S"){
            data.scoreU += -300;
            data.scoreD += 30;
        }
    }
    if(whereY+1 <= board.length-1) {
        if(board[whereX][whereY+1] === "H"){
            data.scoreU += -200;
            data.scoreD += 20;
        } else if(board[whereX][whereY+1] === "S"){
            data.scoreU += -300;
            data.scoreD += 30;
        }
    }
};

const caseDown = (board, data, whereX, whereY) => {
    if(whereX-1 >= 0) {
        if(board[whereX-1][whereY] === "H"){
            data.scoreD += -200;
            data.scoreU += 20;
        } else if(board[whereX-1][whereY] === "S"){
            data.scoreD += -300;
            data.scoreU += 30;
        }
    }
    if(whereX+1 <= board.length-1) {
        if(board[whereX+1][whereY] === "H"){
            data.scoreD += -200;
            data.scoreU += 20;
        } else if(board[whereX+1][whereY] === "S"){
            data.scoreD += -300;
            data.scoreU += 30;
        }
    }
    if(whereY-1 >= 0) {
        if(board[whereX][whereY-1] === "H"){
            data.scoreD += -200;
            data.scoreU += 20;
        } else if(board[whereX][whereY-1] === "S"){
            data.scoreD += -300;
            data.scoreU += 30;
        }
    }
    if(whereY+1 <= board.length-1) {
        if(board[whereX][whereY+1] === "H"){
            data.scoreD += -200;
            data.scoreU += 20;
        } else if(board[whereX][whereY+1] === "S"){
            data.scoreD += -300;
            data.scoreU += 30;
        }
    }
};
const caseLeft = (board, data, whereX, whereY) => {
    if(whereX-1 >= 0) {
        if(board[whereX-1][whereY] === "H"){
            data.scoreL += -200;
            data.scoreR += 20;
        } else if(board[whereX-1][whereY] === "S"){
            data.scoreL += -300;
            data.scoreR += 30;
        }
    }
    if(whereX+1 <= board.length-1) {
        if(board[whereX+1][whereY] === "H"){
            data.scoreL += -200;
            data.scoreR += 20;
        } else if(board[whereX+1][whereY] === "S"){
            data.scoreL += -300;
            data.scoreR += 30;
        }
    }
    if(whereY-1 >= 0) {
        if(board[whereX][whereY-1] === "H"){
            data.scoreL += -200;
            data.scoreR += 20;
        } else if(board[whereX][whereY-1] === "S"){
            data.scoreL += -300;
            data.scoreR += 30;
        }
    }
    if(whereY+1 <= board.length-1) {
        if(board[whereX][whereY+1] === "H"){
            data.scoreL += -200;
            data.scoreR += 20;
        } else if(board[whereX][whereY+1] === "S"){
            data.scoreL += -300;
            data.scoreR += 30;
        }
    }
};
const caseRight = (board, data, whereX, whereY) => {
    if(whereX-1 >= 0) {
        if(board[whereX-1][whereY] === "H"){
            data.scoreR += -200;
            data.scoreL += 20;
        } else if(board[whereX-1][whereY] === "S"){
            data.scoreR += -300;
            data.scoreL += 30;
        }
    }
    if(whereX+1 <= board.length-1) {
        if(board[whereX+1][whereY] === "H"){
            data.scoreR += -200;
            data.scoreL += 20;
        } else if(board[whereX+1][whereY] === "S"){
            data.scoreR += -300;
            data.scoreL += 30;
        }
    }
    if(whereY-1 >= 0) {
        if(board[whereX][whereY-1] === "H"){
            data.scoreR += -200;
            data.scoreL += 20;
        } else if(board[whereX][whereY-1] === "S"){
            data.scoreR += -300;
            data.scoreL += 30;
        }
    }
    if(whereY+1 <= board.length-1) {
        if(board[whereX][whereY+1] === "H"){
            data.scoreR += -200;
            data.scoreL += 20;
        } else if(board[whereX][whereY+1] === "S"){
            data.scoreR+= -300;
            data.scoreL += 30;
        }
    }
};

module.exports = {
    moves
};