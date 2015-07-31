var game = {},
    canvas,
    ctx,
    frame,
    keystate;

game.data = {
    map: [],
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
var field = {
    init: function (dir, width, height) {
        for (var x = 0; x < width; x++) {
            game.data.map.push([]);
            for (var y = 0; y < height; y++) {
                game.data.map[x].push(dir);
            }
        }
    },
    set: function(val, x, y) {
        game.data.map[x][y] = val;
    },

    get: function(x, y) {
        return  game.data.map[x][y];
    }
};
var snake = {
    snakeMap: [],
    direction: null,
    lastPosition: null,
    init: function(dir, x, y) {
        this.direction = dir;
        this.move(x, y);
    },

    move: function(x, y) {
        this.snakeMap.unshift({x: x, y: y});
        console.log('snake move',this.snakeMap);
        this.lastPosition = this.snakeMap[0];
    },

    remove: function() {
        return this.snakeMap.pop();
    }
};
function makeFood() {
    var foodMap = [];
    for (var x = 0; x < game.data.width; x++) {
        for (var y = 0; y < game.data.height; y++) {
            if (field.get(x, y) === game.data.empty) {
                foodMap.push({x: x, y: y});
            }
        }
    }
    var foodPosition = foodMap[Math.round(Math.random()*(foodMap.length - 1))];
    field.set(game.data.food, foodPosition.x, foodPosition.y);
}

function start() {
    var container = document.getElementById("wrapper");
    canvas = document.createElement("canvas");
    canvas.width = game.data.width*20;
    canvas.height = game.data.height*20;
    ctx = canvas.getContext("2d");
    container.appendChild(canvas);

    keystate = {};
    document.addEventListener("keydown", function(e) {
        keystate[e.keyCode] = true;
    });
    document.addEventListener("keyup", function(e) {
        delete keystate[e.keyCode];
    });
    initGame();
    main();
}

function initGame() {
    var snakePosition = {x: Math.floor(game.data.width/2), y: game.data.height - 1};
    field.init(game.data.empty, game.data.width, game.data.height);
    field.set(game.data.snake, snakePosition.x, snakePosition.y);
    snake.init(game.data.up, snakePosition.x, snakePosition.y);
    makeFood();
}

function main() {
    update();
    paint();
    window.requestAnimationFrame(main, canvas);
}

function update() {
    if (keystate[game.data.keyUp] && snake.direction != game.data.down) {
        snake.direction = game.data.up;
    }
    if (keystate[game.data.keyDown] && snake.direction != game.data.up) {
        snake.direction = game.data.down;
    }
    if (keystate[game.data.keyLeft] && snake.direction != game.data.left) {
        snake.direction = game.data.left;
    }
    if (keystate[game.data.keyRight] && snake.direction != game.data.right) {
        snake.direction = game.data.right;
    }

    var moveX = snake.lastPosition.x,
        moveY = snake.lastPosition.y;
        console.log(moveX, moveY);
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
    if (0 >= moveY || moveY > game.data.height - 1 ||
        0 >= moveX || moveX > game.data.width - 1 ||
        game.data.map[moveX][moveY] == game.data.snake) {
//        initGame();
    }

    if (game.data.map[moveX][moveY] == game.data.food) {
        makeFood();
    } else {
        var cell = snake.remove();
        field.set(game.data.empty, cell.x, cell.y);
    }
        field.set(game.data.snake, moveX, moveY);
        snake.move(moveX, moveY);

}

function paint() {
    var cellW = canvas.width/game.data.width;
    var cellH = canvas.height/game.data.height;
    for (var x = 0; x < game.data.width; x++) {
        for (var y = 0; y < game.data.height; y++) {
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
}

start();