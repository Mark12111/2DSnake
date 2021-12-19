let scoreBlock; //блок с очками
let score = 0; //сами очки

// настройки игры:

const config = {
    // step и maxstep чтобы пропускать игровой цикл
    step: 0, //шаг
    maxStep: 9, //максимальная скорость 
    //sizeCell - размер одной ячейки, sizeBerry - размер ягоды, которую наша змейка юудет есть
    sizeCell: 16,
    sizeBerry: 16 / 4
}

//==============================================================================

//далее - все, что связано со змейкой
const snake = {
    //координаты
    x: 160,
    y: 160,

//скорость по вертикали и горизонтали
dx: config.sizeCell,
dy: 0,
//массив ячеек под контролем змейки
tails: [],
//кол-во ячеек при появлении змейки
maxTails: 3
}

//================================================================================

//объект, хранит координаты ягоды
let berry = {
    x: 0,
    y: 0
}



// создаем переменную канвас и получаем поле по айди
let canvas = document.querySelector('#game-canvas');
// создаем контекст в формате 2д для отрисовки на нем
let context = canvas.getContext('2d');
// создаем переменную, в которой будет находиться наш счетчик
scoreBlock = document.querySelector('.game-score .score-count');

drawScore();

randomPositionBerry();

function gameLoop() {
    // requestAnimationFrame вызывается в 60 фпс, т.е. 60 кадров в секунду, делаем функциональное замыкание, чтобы функция вызывала саму себя бесконечно
    requestAnimationFrame(gameLoop);

    //проверка, позволяет контролировать скорость отрисовки, если значение из конфига меньше, чем максимальное, то пропускаем функцию
    if (++config.step < config.maxStep) {
        return;
    }
    config.step = 0;
    //очищаем канвас
    context.clearRect(0, 0, canvas.width, canvas.height);
    //отрисовываем змейку и ягоду
    drawBerry();
    drawSnake();
}
requestAnimationFrame(gameLoop);

// функция создания (отображения) змейки

function drawSnake() {
    snake.x += snake.dx;
    snake.y += snake.dy;
    collisionBorder();

    //добавляем в массив объект с координатами
    snake.tails.unshift({x: snake.x, y: snake.y});
    //если кол-во дочерних элементов больше разрешенного кол-ва, то мы удаляем последний элемент
    if (snake.tails.length > snake.maxTails) {
        snake.tails.pop();
    }

    //перебираем все дочерние элементы змейки и отрисовываем их, попутно проверяя на соприкосновение друг с другом и с ягодой
    snake.tails.forEach(function(el, index) {
        if (index == 0) {
            context.fillStyle = "#006400"; //красим "голову" в свой цвет
        }
        else {
            context.fillStyle = "#228B22"; //остальное "тело" в более тусклом цвете
        }
        context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);
        if (el.x === berry.x && el.y === berry.y) {
            snake.maxTails++; //увеличение хвоста на 1
            incScore(); //увеличивает количество очков на 1
            randomPositionBerry(); //новая ягода
        }
        if (score === 10) {
            config.maxstep = 8;
        }
        else if (score === 20) {
            config.maxstep = 7;
        }
        else if (score === 30) {
            config.maxstep = 6;
        }
        else if (score === 40) {
            config.maxstep = 5;
        }
        else if (score === 50) {
            config.maxstep = 4;
        }
        else if (score === 60) {
            config.maxstep = 3;
        }
        else if (score === 70) {
            config.maxstep = 2;
        }
        else if (score === 80) {
            config.maxstep = 1;
        }
        for (let i = index + 1; i < snake.tails.length; i++) {
            if (el.x === snake.tails[i].x && el.y === snake.tails[i].y) {
                refreshGame();
        }
    }
    });
}
function drawBerry() {
context.beginPath(); //начало рисования
context.fillStyle = "#008000";
context.arc(berry.x + (config.sizeCell / 2), berry.y + (config.sizeCell / 2), config.sizeBerry, 0, 2 * Math.PI);
context.fill();     
}

// увеличивает кол-во очков на 1

function incScore() {
    score++;
    drawScore();
}

// отображает очки на странице

function drawScore() {
    scoreBlock.innerHTML = score;
}

// создаем случайные числа внутри поля

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomPositionBerry() {
    berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
    berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
}

function collisionBorder() {
    if (snake.x < 0) {
        snake.x = canvas.width - config.sizeCell;
    }
    else if (snake.x >= canvas.width) {
        snake.x = 0;
    }
    if (snake.y < 0) {
        snake.y = canvas.height - config.sizeCell;
    }
    else if (snake.y >= canvas.height) {
        snake.y = 0;
    }
}

function refreshGame() {
    score = 0;
    drawScore();

    snake.x = 160;
    snake.y = 160;
    snake.tails = [];
    snake.maxTails = 3;
    snake.dx = config.sizeCell;
    snake.dy = 0;

    randomPositionBerry();
}

//прослушивать события элемента
document.addEventListener('keydown', (e) => {
    console.log (e);
    if(e.code == 'KeyW') {
        snake.dy = -config.sizeCell;
        snake.dx = 0;
    }

    else if(e.code == 'KeyA') {
        snake.dx = -config.sizeCell;
        snake.dy = 0;  
    }

    else if(e.code == 'KeyS') {
        snake.dy = config.sizeCell;
        snake.dx = 0;
    }

    else if(e.code == 'KeyD') {
        snake.dx = config.sizeCell;
        snake.dy = 0;
    }
});
