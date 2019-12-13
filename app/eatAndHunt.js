const key = require('./keys');
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

const eatFoodOrHuntSnake = (you, whichFoodOrSnake, data,board) => {
    let whereX = you.body[0].x;
    let whereY = you.body[0].y;
    if( whereX < whichFoodOrSnake.x && (board[whereX+1][whereY] !== "H" || board[whereX+1][whereY] !== "S" || board[whereX+1][whereY] !== "Y")) {
        data.score[key.right]+=-10;
    }
    if( whereX > whichFoodOrSnake.x && (board[whereX-1][whereY] !== "H" || board[whereX-1][whereY] !== "S" || board[whereX-1][whereY] !== "Y")) {
        data.score[key.left]+=-10;
    }
    if( whereY < whichFoodOrSnake.y && (board[whereX][whereY+1] !== "H" || board[whereX][whereY+1] !== "S" || board[whereX][whereY+1] !== "Y")) {
        data.score[key.down]+=-10;
    }
    if( whereY > whichFoodOrSnake.y && (board[whereX][whereY-1] !== "H" || board[whereX][whereY-1] !== "S" || board[whereX][whereY-1] !== "Y")) {
        data.score[key.up]+=-10;
    }
};

module.exports = {
    eatWhichFood,
    huntWhichSnake,
    eatFoodOrHuntSnake,
}