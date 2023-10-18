function drawMap() {
    moveEnemies();
    var field = document.querySelector('.field');
    field.innerHTML = ''; // Очистка поля
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            var tile = document.createElement('div');
            tile.classList.add('tile');
            if (map[i][j] == 1) {
                tile.classList.add('tileW'); // Стена
            } else if (map[i][j] == 2) {
                tile.classList.add('tileSW'); // Меч
            } else if (map[i][j] == 3) {
                tile.classList.add('tileHP'); // Зелье здоровья
            } else if (map[i][j] == 4) { 
                tile.classList.add('tileP');
                var healthElement = document.createElement('div');
                healthElement.classList.add('health');
                var healthWidth = 100;
                healthElement.style.width = healthWidth + '%';
                tile.appendChild(healthElement);
            } else if (map[i][j] === enemy) { 
                tile.classList.add('tileE');
                var healthElement = document.createElement('div');
                healthElement.classList.add('health');
                var healthWidth = (enemy.hp / 10) * 100; // Подразумевая, что максимальное HP - 10
                healthElement.style.width = healthWidth + '%';
                tile.appendChild(healthElement);
            } else {
                tile.classList.add('tile-.'); //
            }
            tile.style.left = j * 25.6 + 'px';
            tile.style.top = i * 26.67 + 'px';
            field.appendChild(tile);
        }
    }
    console.log(map)
}

function fillWall() {
    for (var i = 0; i < 24; i++) {
        var row = [];
        for (var j = 0; j < 40; j++) {
            row.push(1);
        }
        map.push(row);
    }
    genRooms();
    genPassages();
}

function genRooms() {
    var numRooms = Math.floor(Math.random() * 6) + 5; // 5-10 rooms
    for (var k = 0; k < numRooms; k++) {
        var roomWidth = Math.floor(Math.random() * 6) + 3; // width 3-8
        var roomHeight = Math.floor(Math.random() * 6) + 3; // height 3-8
        var roomX = Math.floor(Math.random() * (40 - roomWidth)); // horizontal
        var roomY = Math.floor(Math.random() * (24 - roomHeight)); // vertical
        for (var i = roomY; i < roomY + roomHeight; i++) {
            for (var j = roomX; j < roomX + roomWidth; j++) {
                map[i][j] = 0; // Устанавливаем клетки комнаты как пол (0)
            }
        }
    }
}

function genPassages() {
    var numPassages = Math.floor(Math.random() * 6) + 3; // Случайное количество проходов (от 3 до 5)
    for (var p = 0; p < numPassages; p++) {
        var direction = Math.floor(Math.random() * 2); // 0 - вертикальный, 1 - горизонтальный
        if (direction === 0) {
            var passageY = Math.floor(Math.random() * 22) + 1; // Случайная позиция по вертикали
            for (var x = 0; x < 40; x++) {
                map[passageY][x] = 0; // Устанавливаем клетки вертикального прохода как пол (0)
            }
        } else {
            var passageX = Math.floor(Math.random() * 38) + 1; // Случайная позиция по горизонтали
            for (var y = 0; y < 24; y++) {
                map[y][passageX] = 0; // Устанавливаем клетки горизонтального прохода как пол (0)
            }
        }
    }
}

function placeItems() {
    for (var i = 0; i < swords; i++) {
        var x, y;
        do {
            x = Math.floor(Math.random() * 40);
            y = Math.floor(Math.random() * 24);
        } while (map[y][x] !== 0);
        map[y][x] = 2; // Устанавливаем меч
    }
    for (var i = 0; i < healthPotions; i++) {
        var x, y;
        do {
            x = Math.floor(Math.random() * 40);
            y = Math.floor(Math.random() * 24);
        } while (map[y][x] !== 0);
        map[y][x] = 3; // Устанавливаем зелье здоровья
    }
}

function spawnCharacter() {
    do {
        characterX = Math.floor(Math.random() * 40);
        characterY = Math.floor(Math.random() * 24);
    } while (map[characterY][characterX] !== 0);
    map[characterY][characterX] = 4; // Устанавливаем персонажа
}

document.addEventListener('keydown', function (event) {
    // Обработка нажатия клавиш
    switch (event.key) {
        case 'w':
        case 'W':
            moveCharacter(0, -1); // Двигаться вверх
            break;
        case 'a':
        case 'A':
            moveCharacter(-1, 0); // Двигаться влево
            break;
        case 's':
        case 'S':
            moveCharacter(0, 1); // Двигаться вниз
            break;
        case 'd':
        case 'D':
            moveCharacter(1, 0); // Двигаться вправо
            break;
        case ' ':
            characterAttack();
    }
});

    function characterAttack() {
        // Найдем врага рядом с персонажем
        var enemy = map[characterY][characterX + 1];
        if (enemy && enemy.type === 5) { //
            enemy.hp -= 5; 
            if (enemy.hp <= 0) {
                map[characterY][characterX + 1] = 0;
            }
            drawMap();
        }
    }
    
function moveCharacter(dx, dy) {
    var newX = characterX + dx;
    var newY = characterY + dy;
    // Проверяем, можно ли переместить персонаж на новую позицию
    if (newX >= 0 && newX < 40 && newY >= 0 && newY < 24) {
        var item = map[newY][newX];
        if (item === 0) {
            // Персонаж двигается на свободное поле
            map[characterY][characterX] = 0;
            characterX = newX;
            characterY = newY;
            map[characterY][characterX] = 4; // Персонаж
        } else if (item === 2) {
            // Персонаж нашел меч
            inventory.push('Меч'); // Добавляем меч в инвентарь
            map[newY][newX] = 0; // Удаляем меч с карты
            map[characterY][characterX] = 0; // Убираем персонажа с текущей позиции
            characterX = newX;
            characterY = newY;
            map[characterY][characterX] = 4; // Персонаж
            updateInventory();

        } else if (item === 3) {
            // Персонаж нашел зелье здоровья
            map[newY][newX] = 0; // Удаляем зелье здоровья с карты
            map[characterY][characterX] = 0; // Убираем персонажа с текущей позиции
            characterX = newX;
            characterY = newY;
            map[characterY][characterX] = 4; // Персонаж
        }
        // Обновляем отображение карты
        console.log(inventory);
        drawMap();
    }
}



function updateInventory() {
    var inventoryContainer = document.querySelector('.inventory');
    inventoryContainer.innerHTML = ''; // Очищаем содержимое инвентаря
    for (var i = 0; i < inventory.length; i++) {
        var imageElement = document.createElement('img');
        imageElement.src = 'images/tile-SW.png';
        imageElement.style.height = '32px';
        inventoryContainer.appendChild(imageElement);
    }
}

function placeEnemies() {
    for (var i = 0; i < 10; i++) { // Создаем 10 противников
        var x, y;
        do {
            // Генерируем случайные координаты
            x = Math.floor(Math.random() * 40);
            y = Math.floor(Math.random() * 24);
        } while (map[y][x] !== 0); // Проверяем, что это пустое место
        // var enemy = { type: 5, hp: 20 }; // Например, враг с HP 20
        map[y][x] = enemy;
    }
}

function moveEnemies() {
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            if (map[i][j] === enemy) {
                var randomDirection = Math.floor(Math.random() * 4);// (0: Up, 1: Down, 2: Left, 3: Right)
                var newX = j;
                var newY = i;
                if (randomDirection === 0 && i > 0 && map[i - 1][j] === 0) {
                    newY = i - 1; // Up
                } else if (randomDirection === 1 && i < 24 && map[i + 1][j] === 0) {
                    newY = i + 1; // Down
                } else if (randomDirection === 2 && j > 0 && map[i][j - 1] === 0) {
                    newX = j - 1; // Left
                } else if (randomDirection === 3 && j < 39 && map[i][j + 1] === 0) {
                    newX = j + 1; // Right
                }
                // Check if the new position is different from the current position
                if (newX !== j || newY !== i) {
                    // Update the enemy's position
                    map[i][j] = 0;
                    map[newY][newX] = enemy;
                }
            }
        }
    }
}
