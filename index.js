var Field = function () {
    this.width = null;
    this.height = null;
    this.fieldMap = [];

};

Field.prototype = {
    constructor: Field,

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

var Snake = function () {
    this.snakeMap = null;
    this.direction = null;
    this.lastPosition = null;
    this.oldPosition = null;
};

Snake.prototype = {
    constructor: Snake,

    init: function (dir, x, y) {
        this.direction = dir;
        this.snakeMap = [];
        this.move(x, y);
    },
    move: function (x, y) {
        this.snakeMap.unshift({x: x, y: y});
//        this.snakeMap.push({x: x, y: y});
//        for (var i = this.snakeMap.length - 1; i < 0; i--) {
//            console.log(this.snakeMap[i-1]);
//            this.oldPosition = this.snakeMap[i];
//            this.snakeMap.push(this.oldPosition);
//
//        }
        this.lastPosition = this.snakeMap[0];
    },
    remove: function () {
        return this.snakeMap.pop();
    }
};

var Game = function () {
    this.data = {
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
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.score = 0;
    this.animationRate = 0;
    this.keystate = {};
    this.speed = 12;

    this.field = new Field();
    this.snake = new Snake();
};

Game.prototype = {
    constructor: Game,
    field: this.field,

    start: function () {
        var container = document.getElementById("wrapper");
        game.canvas.width = game.data.width*20;
        game.canvas.height = game.data.height*20;
        container.appendChild(game.canvas);

        document.addEventListener("keydown", function (e) {
            game.keystate[e.keyCode] = true;
        });
        document.addEventListener("keyup", function (e) {
            delete game.keystate[e.keyCode];
        });
        game.initGame();
        game.main();
    },
    initGame: function () {
        this.field.init(game.data.empty, game.data.width, game.data.height);
        var snakePosition = {x: Math.floor(game.data.width/2), y: game.data.height - 1};
        this.snake.init(game.data.up, snakePosition.x, snakePosition.y);
        this.field.set(game.data.snake, snakePosition.x, snakePosition.y);
        makeFood(this.field);
    },
    main: function () {
        game.update();
        game.paint();
        window.requestAnimationFrame(game.main, game.canvas);
    },
    update: function () {
        game.animationRate++;

        var keyCodeArr = [
            game.data.keyUp, game.data.keyDown, game.data.keyLeft, game.data.keyRight
        ];
        var keyIndex = [
            game.data.up, game.data.down, game.data.left, game.data.right
        ];

        for (var i = 0; i < keyCodeArr.length; i++) {
            if (game.keystate[keyCodeArr[i]] && this.snake.direction != keyIndex[i]) {
                this.snake.direction = keyIndex[i];
            }
        }

        if (game.animationRate%game.speed == 0) {

            var directions = [
                    {x : 0, y : -1},
                    {x : 0, y : +1},
                    {x : -1, y : 0},
                    {x : +1, y : 0}
                ],
            move = {
                x : this.snake.lastPosition.x,
                y : this.snake.lastPosition.y
            };
            move.x += directions[this.snake.direction].x;
            move.y += directions[this.snake.direction].y;

            if (move.y < 0 || move.y > this.field.height - 1 ||
                move.x < 0 || move.x > this.field.width - 1 ||
                this.field.get(move.x, move.y) == game.data.snake) {
                game.score = 0;
                game.speed = 10;
                return game.initGame();
            }

            if (this.field.get(move.x, move.y) == game.data.food) {
                game.score++;
                game.speed -= 0.5;
                makeFood(this.field);
            } else {
                var cell = this.snake.remove();
                this.field.set(game.data.empty, cell.x, cell.y);
            }

            this.field.set(game.data.snake, move.x, move.y);
            this.snake.move(move.x, move.y);
        }
    },
    paint: function () {
        var cellW = game.canvas.width/game.data.width;
        var cellH = game.canvas.height/game.data.height;
        var colorList = ["#ffffff", "#008000", "#ff0000"];

        for (var x = 0; x < game.data.width; x++) {
            for (var y = 0; y < game.data.height; y++) {
                game.ctx.fillStyle = colorList[this.field.get(x, y)];
                game.ctx.fillRect(x*cellW, y*cellH, cellW, cellH);
            }
        }
        game.ctx.font = "20px Arial";
        game.ctx.fillStyle = "#000000";
        game.ctx.fillText("Score: " + game.score, 10, 20);
    }
};

function makeFood(field) {
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

var game = new Game();
game.start();