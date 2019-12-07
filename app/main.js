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
       }
       if (nice.you.body[0].y === wall2.y) {
           //  console.log("CASE2")
           data.move = "right"
           data.scoreR+=1;
       }
       if (nice.you.body[0].x === wall4.x - 1) {
           // console.log("CASE3")
           data.move = "down"
           data.scoreD+=1;
       }
       if (nice.you.body[0].y === wall3.y - 1) {
           //  console.log("CASE4")
           data.move = "left"
           data.scoreL+=1;
       }
       if (nice.you.body[0].x === wall1.x && nice.you.body[0].y === wall2.y) {
           //  console.log("CASE5")
           data.move = "right"
           data.scoreR+=1;
       }
       if (nice.you.body[0].x === wall1.x && nice.you.body[0].y === wall3.y - 1) {
           // console.log("CASE6")
           data.move = "up"
           data.scoreU+=1;
       }
   inSurrounding(nice.you,board,data);
    console.log("KKKKKKK");
    console.log(data);
    if(nice.you.health>=30) {
        console.log("normal");
    } else {
        console.log("%%%%%%%$4444444444444444444444444444444444"+nice.you.health);
        const whichFood = eatWhichFood(nice.you, nice.board);
        console.log(data);
        console.log("SHIRRRRRR:  "+ whichFood);
        eatFood(nice.you,whichFood,data);
        console.log(data);
    }
    const arr = [data.scoreU, data.scoreD, data.scoreL, data.scoreR];
   // arr.sort();
    console.log("realshittt"+arr);
    console.log("newadta    "+whichMove(arr,nice.you,nice.board))
    data.move = whichMove(arr,nice.you,nice.board);
    let whereX = nice.you.body[0].x;
    let whereY = nice.you.body[0].y;
    console.log("dis:  "+distance({x: whereX, y: whereY}, {x:0,y:0}));
    //eatWhichFood(nice.you, nice.board);
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
   // console.log(whichFood);
}

const eatFood = (you, whichFood, data) => {
    let whereX = you.body[0].x;
    let whereY = you.body[0].y;
     if( whereX< whichFood.x) {
         data.scoreR+=10;
     }
    if( whereX > whichFood.x) {
        data.scoreL+=10;
    }
    if( whereY< whichFood.y) {
        data.scoreD+=10;
    }
    if( whereY> whichFood.y) {
        data.scoreU+=10;
    }
    console.log(data);
}

const whichMove = (arr,you,board) => {
    let move = 'up';
    let max = arr[0]
    if(arr[1] > max){
        max = arr[1]
        move = 'down'
        if(max == arr[0] && you.body[0].y > board.height/2){
            move = 'up'
        }
    }
    if(arr[2] > max){
        max = arr[2]
        move = 'left'
    }
    if(arr[3] >= max){
        max = arr[3]
        move = 'right'
        if(max == arr[2] && you.body[0].x > board.width/2){
            move = 'left'
        }
    }
    return move;
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

const inSurrounding = (you, board, data) => {
    let whereX = you.body[0].x;
    let whereY = you.body[0].y;
    console.log("here is x:  "+whereX,"  here uis Y:   "+whereY)
    if(whereX-1 >= 0) {
        if(board[whereX-1][whereY] === "H" || board[whereX-1][whereY] === "S"){
            data.scoreL = -100;
        } else if(board[whereX-1][whereY] === "Y") {
            data.scoreL = -100;
        } else {
            data.scoreL = 10;
        }
    }
    if(whereX+1 <= board.length-1) {
        if(board[whereX+1][whereY] === "H" || board[whereX+1][whereY] === "S"){
            data.scoreR = -100;
        } else if(board[whereX+1][whereY] === "Y") {
            data.scoreR = -100;
        } else {
            data.scoreR = 10;
        }
    }
    if(whereY-1 >= 0) {
        if(board[whereX][whereY-1] === "H" || board[whereX][whereY-1] === "S"){
            data.scoreU = -100;
        } else if(board[whereX][whereY-1] === "Y") {
            data.scoreU = -100;
        } else {
            data.scoreU = 10;
        }
    }
    if(whereY+1 <= board.length-1) {
        if(board[whereX][whereY+1] === "H" || board[whereX][whereY+1] === "S"){
            data.scoreD = -100;
        } else if(board[whereX][whereY+1] === "Y") {
            data.scoreD = -100;
        } else {
            data.scoreD = 10;
        }
    }
};


module.exports = {
    moves
};