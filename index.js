function drawMap() {
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
                var healthWidth = 100; // calculate health
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
    }
});

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
            // updateInventory();

        } else if (item === 3) {
            // Персонаж нашел зелье здоровья
            map[newY][newX] = 0; // Удаляем зелье здоровья с карты
            map[characterY][characterX] = 0; // Убираем персонажа с текущей позиции
            characterX = newX;
            characterY = newY;
            map[characterY][characterX] = 4; // Персонаж
        }
        // Обновляем отображение карты
        drawMap();
    }
}

function updateInventory() {
    var inventoryElement = document.getElementById('inventory');
    inventoryElement.innerHTML = ''; // Очистка инвентаря
    // Перебираем предметы в инвентаре и добавляем их в отображение
    for (var i = 0; i < inventory.length; i++) {
        var itemElement = document.createElement('div');
        itemElement.textContent = inventory[i];
        inventoryElement.appendChild(itemElement);
    }
}
