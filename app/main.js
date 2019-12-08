const log = require('./logger')

const moves = (nice) => {
    const board = getBoard(nice)
    let data = {
        scoreU: 0,
        scoreD: 0,
        scoreL: 0,
        scoreR: 0,
        move: 'left', // one of: ['up','down','left','right']
    };
       const wall1 = {x: 0}
       const wall2 = {y: 0}
       const wall3 = {y: nice.board.height}
       const wall4 = {x: nice.board.width}
       //console.log(nice.you.body[0])
       if (nice.you.body[0].x === wall1.x) {
           if (nice.you.body[0].y === wall3.y - 1) {
               //   console.log("CASE1A")
               data.move = "down"
               data.scoreD+=1;
           } else {
               // console.log("CASE1B")
               data.move = "up"
               data.scoreU+=1;
           }
           data.scoreL+=-500;
       }
       if (nice.you.body[0].y === wall2.y) {
           //  console.log("CASE2")
           data.move = "right"
           data.scoreR+=1;
           data.scoreU+=-500;
       }
       if (nice.you.body[0].x === wall4.x - 1) {
           // console.log("CASE3")
           data.move = "down"
           data.scoreD+=1;
           data.scoreR+=-500;
       }
       if (nice.you.body[0].y === wall3.y - 1) {
           //  console.log("CASE4")
           data.move = "left"
           data.scoreL+=1;
           data.scoreD+=-500;
       }
       if (nice.you.body[0].x === wall1.x && nice.you.body[0].y === wall2.y) {
           //  console.log("CASE5")
           data.move = "right"
           data.scoreR+=1;
           data.scoreL+=-500;
           data.scoreU+=-500;
       }
       if (nice.you.body[0].x === wall1.x && nice.you.body[0].y === wall3.y - 1) {
           // console.log("CASE6")
           data.move = "up"
           data.scoreU+=1;
           data.scoreL+=-500;
           data.scoreD+=-500;
       }
    const arr = [data.scoreU, data.scoreD, data.scoreL, data.scoreR];
    data.move = whichMove(arr,nice.you,nice.board).move;
    // arr.sort();
    let whatNextX= whichMove(arr,nice.you,nice.board).x;
    let whatNextY= whichMove(arr,nice.you,nice.board).y;

    inNextSurrounding(nice.you,board,data,nice.you.body[0].x+whatNextX, nice.you.body[0].y+whatNextY,data.move);
    if(nice.you.health>=70) {
        console.log("normal");
    } else {
        const whichFood = eatWhichFood(nice.you, nice.board);
        eatFood(nice.you,whichFood,data);
    }

   // inSurrounding(nice.you,board,data,nice.you.body[0].x, nice.you.body[0].y);
    data.move = whichMove(arr,nice.you,nice.board).move;
    inSurrounding(nice.you,board,data,nice.you.body[0].x, nice.you.body[0].y);

    const newArr = [data.scoreU, data.scoreD, data.scoreL, data.scoreR];
    data.move = whichMove(newArr,nice.you,nice.board).move;
    return data;
}

const distance = (a,b) => {
   const dis = Math.abs((a.x-b.x)) + Math.abs((a.y - b.y));
   return dis;
}

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
}

const eatFood = (you, whichFood, data) => {
    let whereX = you.body[0].x;
    let whereY = you.body[0].y;
     if( whereX< whichFood.x) {
         data.scoreR+=200;
     }
    if( whereX > whichFood.x) {
        data.scoreL+=200;
    }
    if( whereY< whichFood.y) {
        data.scoreD+=200;
    }
    if( whereY> whichFood.y) {
        data.scoreU+=200;
    }
}

const whichMove = (arr,you,board) => {
    let whichNextX=0;
    let whichNextY=0;
    let move = 'up';
    let max = arr[0]
    if(arr[1] > max){
        max = arr[1]
        move = 'down'
        if(max == arr[0] && you.body[0].y > board.height/2){
            move = 'up'
        }
    }
    if(arr[2] >= max){
        max = arr[2]
        move = 'left'
    }
    if(arr[3] > max){
        max = arr[3]
        move = 'right'
        if(max == arr[2] && you.body[0].x > board.width/2){
            move = 'left'
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

const getBoard = (big) => {

  let Myboard = []
    for(let i=0;i<big.board.height;i++) {
        Myboard[i] = [];
    }
    for(let i=0;i<Myboard.length;i++) {
                for(let j=0;j<Myboard.length;j++) {
                    Myboard[i][j] = " "
                }
    }
    for(let i = 0; i < big.board.food.length; i++) {
        if (big.board.food[i]) {
            Myboard[big.board.food[i].x][big.board.food[i].y] = "F"
        }
    }
    for(let i = 0; i < big.board.snakes.length; i++) {
        if(big.board.snakes[i].id !== big.you.id) {
            for (let j = 0; j < big.board.snakes[i].body.length; j++) {
                if (big.board.snakes[i].body[j]) {
                    if(j === 0){
                        Myboard[big.board.snakes[i].body[j].x][big.board.snakes[i].body[j].y] = "H"
                    } else {
                        Myboard[big.board.snakes[i].body[j].x][big.board.snakes[i].body[j].y] = "S"
                    }
                }
            }
        } else {
            for (let j = 0; j < big.board.snakes[i].body.length; j++) {
                if (big.board.snakes[i].body[j]) {
                    if(j === 0){
                        Myboard[big.board.snakes[i].body[j].x][big.board.snakes[i].body[j].y] = "X"
                    } else {
                        Myboard[big.board.snakes[i].body[j].x][big.board.snakes[i].body[j].y] = "Y"
                    }
                }
            }
        }
    }
    printBoard(Myboard);
    return Myboard;
};

const printBoard = (myBoard) => {
    let newCol = " ";
    for(let i=0;i<myBoard.length;i++) {
        newCol+= i%10
    }
    console.log(newCol);
    for(let i=0;i<myBoard.length;i++) {

        let newRow= "";
        newRow+= i%10;
        for(let j=0;j<myBoard.length;j++) {
             newRow += myBoard[j][i];
        }
        newRow+= i%10;
        console.log(newRow)
    }
};

const inSurrounding = (you, board, data, whereX, whereY) => {
    console.log("here is x:  "+whereX,"  here uis Y:   "+whereY)
    if(whereX-1 >= 0) {
        if(board[whereX-1][whereY] === "H" || board[whereX-1][whereY] === "S"){
            if(board[whereX-1][whereY] === "S"){
                data.scoreL += -400;
            }else{
                data.scoreL += -100;
            }
        } else if(board[whereX-1][whereY] === "Y" || board[whereX-1][whereY] === "X") {
            data.scoreL += -500;
        } else {
            data.scoreL += 10;
        }
    }
    if(whereX+1 <= board.length-1) {
        if(board[whereX+1][whereY] === "H" || board[whereX+1][whereY] === "S"){
            if(board[whereX+1][whereY] === "S"){
                data.scoreR += -400;
            }else{
                data.scoreR += -100;
            }
        } else if(board[whereX+1][whereY] === "Y" || board[whereX+1][whereY] === "X") {
            data.scoreR += -500;
        } else {
            data.scoreR += 10;
        }
    }
    if(whereY-1 >= 0) {
        if(board[whereX][whereY-1] === "H" || board[whereX][whereY-1] === "S"){
            if(board[whereX][whereY-1] === "S"){
                data.scoreU += -400;
            }else{
                data.scoreU += -100;
            }
        } else if(board[whereX][whereY-1] === "Y" || board[whereX][whereY-1] === "X") {
            data.scoreU += -500;
        } else {
            data.scoreU += 10;
        }
    }
    if(whereY+1 <= board.length-1) {
        if(board[whereX][whereY+1] === "H" || board[whereX][whereY+1] === "S"){
            if(board[whereX][whereY+1] === "S"){
                data.scoreD += -400;
            }else{
                data.scoreD += -100;
            }
        } else if(board[whereX][whereY+1] === "Y" || board[whereX][whereY+1] === "X") {
            data.scoreD += -500;
        } else {
            data.scoreD += 10;
        }
    }
};


const inNextSurrounding = (you, board, data, whereX, whereY, originalMove) => {
    console.log("here is x:  "+whereX,"  here uis Y:   "+whereY);
    switch (originalMove) {
        case "up":
            if(whereX-1 >= 0) {
                if(board[whereX-1][whereY] === "H"){
                    data.scoreU += -200;
                }
                if(board[whereX-1][whereY] === "S"){
                    data.scoreU += -300;
                } else {
                    data.scoreU += 10;
                }
            }
            if(whereX+1 <= board.length-1) {
                if(board[whereX+1][whereY] === "H"){
                    data.scoreU += -200;
                }
                if(board[whereX+1][whereY] === "S"){
                    data.scoreU += -300;
                }  else {
                    data.scoreU += 10;
                }
            }
            if(whereY-1 >= 0) {
                if(board[whereX][whereY-1] === "H"){
                    data.scoreU += -200;
                }
                if(board[whereX][whereY-1] === "S"){
                    data.scoreU += -300;
                }  else {
                    data.scoreU += 10;
                }
            }
            if(whereY+1 <= board.length-1) {
                if(board[whereX][whereY+1] === "H"){
                    data.scoreU += -200;
                }
                if(board[whereX][whereY+1] === "S"){
                    data.scoreU += -300;
                }  else {
                    data.scoreU += 10;
                }
            }
            break;
        case "down":
            if(whereX-1 >= 0) {
                if(board[whereX-1][whereY] === "H"){
                    data.scoreD += -200;
                }
                if(board[whereX-1][whereY] === "S"){
                    data.scoreD += -300;
                }  else {
                    data.scoreD += 10;
                }
            }
            if(whereX+1 <= board.length-1) {
                if(board[whereX+1][whereY] === "H"){
                    data.scoreD += -200;
                }
                if(board[whereX+1][whereY] === "S"){
                    data.scoreD += -300;
                }  else {
                    data.scoreD += 10;
                }
            }
            if(whereY-1 >= 0) {
                if(board[whereX][whereY-1] === "H"){
                    data.scoreD += -200;
                }
                if(board[whereX][whereY-1] === "S"){
                    data.scoreD += -300;
                }  else {
                    data.scoreD += 10;
                }
            }
            if(whereY+1 <= board.length-1) {
                if(board[whereX][whereY+1] === "H"){
                    data.scoreD += -200;
                }
                if(board[whereX][whereY+1] === "S"){
                    data.scoreD += -300;
                }  else {
                    data.scoreD += 10;
                }
            }
            break;
        case "left":
            if(whereX-1 >= 0) {
                if(board[whereX-1][whereY] === "H"){
                    data.scoreL += -200;
                }
                if(board[whereX-1][whereY] === "S"){
                    data.scoreL += -300;
                }  else {
                    data.scoreL += 10;
                }
            }
            if(whereX+1 <= board.length-1) {
                if(board[whereX+1][whereY] === "H"){
                    data.scoreL += -200;
                }
                if(board[whereX+1][whereY] === "S"){
                    data.scoreL += -300;
                }  else {
                    data.scoreL += 10;
                }
            }
            if(whereY-1 >= 0) {
                if(board[whereX][whereY-1] === "H"){
                    data.scoreL += -200;
                }
                if(board[whereX][whereY-1] === "S"){
                    data.scoreL += -300;
                }  else {
                    data.scoreL += 10;
                }
            }
            if(whereY+1 <= board.length-1) {
                if(board[whereX][whereY+1] === "H"){
                    data.scoreL += -200;
                }
                if(board[whereX][whereY+1] === "S"){
                    data.scoreL += -300;
                }  else {
                    data.scoreL += 10;
                }
            }
            break;
        case "right":
            if(whereX-1 >= 0) {
                if(board[whereX-1][whereY] === "H"){
                    data.scoreR += -200;
                }
                if(board[whereX-1][whereY] === "S"){
                    data.scoreR += -300;
                }  else {
                    data.scoreR += 10;
                }
            }
            if(whereX+1 <= board.length-1) {
                if(board[whereX+1][whereY] === "H"){
                    data.scoreR += -200;
                }
                if(board[whereX+1][whereY] === "S"){
                    data.scoreR += -300;
                }  else {
                    data.scoreR += 10;
                }
            }
            if(whereY-1 >= 0) {
                if(board[whereX][whereY-1] === "H"){
                    data.scoreR += -200;
                }
                if(board[whereX][whereY-1] === "S"){
                    data.scoreR += -300;
                }  else {
                    data.scoreR += 10;
                }
            }
            if(whereY+1 <= board.length-1) {
                if(board[whereX][whereY+1] === "H"){
                    data.scoreR += -200;
                }
                if(board[whereX][whereY+1] === "S"){
                    data.scoreR+= -300;
                }  else {
                    data.scoreR += 10;
                }
            }
    }
};


module.exports = {
    moves
};