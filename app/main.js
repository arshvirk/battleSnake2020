const moves = (nice) => {
    const board = getBoard(nice.board)

    let data = {
        move: 'left', // one of: ['up','down','left','right']
    };
   if(nice.you.health>=0) {
       const wall1 = {x: 0}
       const wall2 = {y: 0}
       const wall3 = {y: nice.board.height}
       const wall4 = {x: nice.board.width}
       //console.log(nice.you.body[0])
       if (nice.you.body[0].x === wall1.x) {
           if (nice.you.body[0].y === wall3.y - 1) {
               //   console.log("CASE1A")
               data = {move: "down"}
           } else {
               // console.log("CASE1B")
               data = {move: "up"}
           }
       }
       if (nice.you.body[0].y === wall2.y) {
           //  console.log("CASE2")
           data = {move: "right"}
       }
       if (nice.you.body[0].x === wall4.x - 1) {
           // console.log("CASE3")
           data = {move: "down"}
       }
       if (nice.you.body[0].y === wall3.y - 1) {
           //  console.log("CASE4")
           data = {move: "left"}
       }
       if (nice.you.body[0].x === wall1.x && nice.you.body[0].y === wall2.y) {
           //  console.log("CASE5")
           data = {move: "right"}
       }
       if (nice.you.body[0].x === wall1.x && nice.you.body[0].y === wall3.y - 1) {
           // console.log("CASE6")
           data = {move: "up"}
       }
   } else {

   }
    return data;
}

const getBoard = (board) => {
  let Myboard = []
    for(let i=0;i<board.height;i++) {
        Myboard[i] = [];
    }
    for(let i=0;i<Myboard.length;i++) {
                for(let j=0;j<Myboard.length;j++) {
                    Myboard[i][j] = " "
                }
    }
    for(let i = 0; i < board.food.length; i++) {
        if (board.food[i]) {
            Myboard[board.food[i].x][board.food[i].y] = "F"
        }
    }
    for(let i = 0; i < board.food.length; i++) {
        if (board.food[i]) {
            Myboard[board.food[i].x][board.food[i].y] = "F"
        }
    }
    printBoard(Myboard)

}

const printBoard = (Myboard) => {
    for(let i=0;i<Myboard.length;i++) {

        let newRow= ""
        newRow+= "i"
        for(let j=0;j<Myboard.length;j++) {
             newRow += Myboard[j][i];
        }
        newRow+= "i"
        console.log(newRow)
    }
}


module.exports = {
    moves
}