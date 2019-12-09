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

module.exports = {
    getBoard, printBoard
};