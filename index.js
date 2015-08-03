var game = {},
    canvas,
    ctx,
    score = 0,
    animationFrame,
    keystate;

game.data = {
    count: 1,
    width: 20,
    height: 20,
    empty: 0,
    snake: 1,
    food: 2,
    keyUp: 38,
    keyDown: 40,
    keyLeft: 37,
    keyRight: 39,
    up: 0,
    down: 1,
    left: 2,
    right: 3

};
// todo use constructors, Luke
var field = {
    width: null,
    height: null,
    fieldMap: [],

    init: function (dir, width, height) {
        this.width = width;
        this.height = height;
        this.fieldMap = [];

        for (var x = 0; x < width; x++) {
            this.fieldMap.push([]);
            for (var y = 0; y < height; y++) {
                this.fieldMap[x].push(dir);
            }
        }
    },
    set: function (val, x, y) {
        this.fieldMap[x][y] = val;
    },

    get: function (x, y) {
        return  this.fieldMap[x][y];
    }
};
var snake = {
    snakeMap: null,
    direction: null,
    lastPosition: null,

    init: function (dir, x, y) {
        this.direction = dir;
        this.snakeMap = [];
        this.move(x, y);
    },

    move: function (x, y) {
        // todo remove fucking unshift
//        console.log('before',this.snakeMap);
        this.snakeMap = new  Array({x: x, y: y});
        this.lastPosition = this.snakeMap[0];
//        console.log('after',this.snakeMap, this.lastPosition);
    },

    remove: function () {
        return this.snakeMap.pop();
    }
};
function makeFood() {
    var amountFood = 0;
    while (amountFood < game.data.count) {
        var foodPositionX = Math.floor(field.width * Math.random()),
            foodPositionY = Math.floor(field.height * Math.random());
        if (field.get(foodPositionX, foodPositionY) == game.data.empty) {
            field.set(game.data.food, foodPositionX, foodPositionY);
            amountFood++;
        }
    }
}

function start() {
    var container = document.getElementById("wrapper");
    canvas = document.createElement("canvas");
    canvas.width = game.data.width*20;
    canvas.height = game.data.height*20;
    ctx = canvas.getContext("2d");
    container.appendChild(canvas);

    animationFrame = 0;
    keystate = {};
    document.addEventListener("keydown", function (e) {
        keystate[e.keyCode] = true;
    });
    document.addEventListener("keyup", function (e) {
        delete keystate[e.keyCode];
    });
    initGame();
    main();

}

function initGame() {
    field.init(game.data.empty, game.data.width, game.data.height);
    var snakePosition = {x: Math.floor(game.data.width/2), y: game.data.height - 1};
    snake.init(game.data.up, snakePosition.x, snakePosition.y);
    field.set(game.data.snake, snakePosition.x, snakePosition.y);
    makeFood();
}

function main() {
    update();
    paint();
    window.requestAnimationFrame(main, canvas);
}

function update() {
    animationFrame++;

    // todo map this shit
    var keyCodeArr = [game.data.keyUp,game.data.keyDown,game.data.keyLeft,game.data.keyRight];
    var keyStamp = [game.data.up,game.data.down,game.data.left,game.data.right];

    for (var i = 0; i < keyCodeArr.length; i++) {
        if (keystate[keyCodeArr[i]] && snake.direction != keyStamp[i]) {
            snake.direction = keyStamp[i];
        }
    }

//    if (keystate[game.data.keyUp] && snake.direction != game.data.down) {
//        snake.direction = game.data.up;
//    }
//    if (keystate[game.data.keyDown] && snake.direction != game.data.up) {
//        snake.direction = game.data.down;
//    }
//    if (keystate[game.data.keyLeft] && snake.direction != game.data.left) {
//        snake.direction = game.data.left;
//    }
//    if (keystate[game.data.keyRight] && snake.direction != game.data.right) {
//        snake.direction = game.data.right;
//    }

    if (animationFrame%5 == 0) {
        var moveX = snake.lastPosition.x,
            moveY = snake.lastPosition.y;
//        var moveObj = {
//            0: moveY -= 1,
//            1: moveY += 1,
//            2: moveX -= 1,
//            3: moveX += 1
//        };
//        moveObj[snake.direction];
        switch (snake.direction) {
            case game.data.up:
                moveY -= 1;
                break;
            case game.data.down:
                moveY += 1;
                break;
            case game.data.left:
                moveX -= 1;
                break;
            case game.data.right:
                moveX += 1;
                break;
        }
        if (0 > moveY || moveY > field.height - 1 ||
            0 > moveX || moveX > field.width - 1 ||
            field.get(moveX, moveY) == game.data.snake) {
            score = 0;
           return initGame();
        }

        if (field.get(moveX, moveY) == game.data.food) {
            score++;
            makeFood();
        } else {
            var cell = snake.remove();
            field.set(game.data.empty, cell.x, cell.y);
        }
//        console.log(moveX, moveY);
        field.set(game.data.snake, moveX, moveY);
        snake.move(moveX, moveY);
    }
}

function paint() {
    var cellW = canvas.width/game.data.width;
    var cellH = canvas.height/game.data.height;
    for (var x = 0; x < game.data.width; x++) {
        for (var y = 0; y < game.data.height; y++) {
            //todo map
            switch (field.get(x, y)) {
                case game.data.empty:
                    ctx.fillStyle = "#ffffff";
                    break;
                case game.data.snake:
                    ctx.fillStyle = "#008000";
                    break;
                case game.data.food:
                    ctx.fillStyle = "#ff0000";
                    break;
            }
            ctx.fillRect(x*cellW, y*cellH, cellW, cellH);
        }
    }
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Score: " + score, 10, 20);
}

start();