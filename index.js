"use strict";
function fillWall() {
    for (var i = 0; i < 24; i++) {
        var row = [];
        for (var j = 0; j < 40; j++) {
            row.push(1);
        }
        map.push(row);
    }
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
                map[i][j] = 0; 
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
                map[passageY][x] = 0; 
            }
        } else {
            var passageX = Math.floor(Math.random() * 38) + 1; // Случайная позиция по горизонтали
            for (var y = 0; y < 24; y++) {
                map[y][passageX] = 0; 
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
        map[y][x] = 2; // меч
    }
    for (var i = 0; i < healthPotions; i++) {
        var x, y;
        do {
            x = Math.floor(Math.random() * 40);
            y = Math.floor(Math.random() * 24);
        } while (map[y][x] !== 0);
        map[y][x] = 3; // пузырь
    }
}

function placeEnemies() {
    for (var i = 0; i < 10; i++) { // Create 10 unique enemies
        var x, y;
        do {
            x = Math.floor(Math.random() * 40);
            y = Math.floor(Math.random() * 24);
        } while (map[y][x] !== 0 && map[y][x]!==2 && map[y][x]!==3 && map[y][x]!==4); 
        var uniqueEnemy = {
            id: i + 1, // unique ID
            type: 5,
            hp: 10,
        };
        map[y][x] = uniqueEnemy;
    }
}

function spawnCharacter() {
    do {
        var characterX = 0;
        var characterY = 0;
        characterX = Math.floor(Math.random() * 40);
        characterY = Math.floor(Math.random() * 24);
    } while (map[characterY][characterX] !== 0);
    map[characterY][characterX] = character;
}

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
            } else if (map[i][j].attack) { 
                createTileWithHealth(tile, map[i][j].health, 0);
            } else if (map[i][j].id) { 
                createTileWithHealth(tile, map[i][j].hp, 1);
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

function createTileWithHealth(tile, healthValue,type) {
    if (type) {
        tile.classList.add('tileE'); // или 'tileE' 
    }else{
        tile.classList.add('tileP'); // или 'tileE'  
    };
    var healthElement = document.createElement('div');
    healthElement.classList.add('health');
    var healthWidth = (healthValue / 10) * 100;
    healthElement.style.width = healthWidth + '%';
    tile.appendChild(healthElement);
}

function characterAttack() {
    var positions = [
        { dx: 0, dy: -1 }, 
        { dx: -1, dy: 0 }, 
        { dx: 1, dy: 0 },  
        { dx: 1, dy: 1 }, 
        { dx: 0, dy: 1 }, 
        { dx: 0, dy: 0 }
    ];

    for (var i = 0; i < positions.length; i++) {
        var xOffset = characterX + positions[i].dx;
        var yOffset = characterY + positions[i].dy;
        if (xOffset >= 0 && xOffset < 40 && yOffset >= 0 && yOffset < 24) {
            var tile = map[yOffset][xOffset];
            if (tile && tile.id && tile.type === 5) {
                    tile.hp -= 3 + inventory.length * 3.5;
                if (tile.hp <= 0) {
                    map[yOffset][xOffset] = 0;
                }
            }
            
        }
    }
    moveEnemies();
    drawMap();
}

function moveCharacter(dx, dy) {
    var newX = characterX + dx;
    var newY = characterY + dy;

    function updateCharacterPosition(newX, newY) {
        map[characterY][characterX] = 0;
        characterX = newX;
        characterY = newY;
        map[characterY][characterX] = character;
        moveEnemies();
        drawMap();
    }

    // Проверяем, можно ли переместить персонажа на новую позицию
    if (newX >= 0 && newX < 40 && newY >= 0 && newY < 24) {
        var item = map[newY][newX];
        if (item === 0) {
            updateCharacterPosition(newX, newY);
        } else if (item === 2) { // меч
            inventory.push('Меч');
            map[newY][newX] = 0;
            updateCharacterPosition(newX, newY);
            updateInventory();
        } else if (item === 3) { // пузырь
            character.health = 10;
            map[newY][newX] = 0;
            updateCharacterPosition(newX, newY);
        }
    }
}

function moveEnemies() {
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            var cell = map[i][j];
            if (cell && cell.id) {
                var playerNearby = isPlayerNearby(i, j);
                if (playerNearby) {
                    attackPlayer();
                } else {
                    var randomDirection = Math.floor(Math.random() * 4); // (0: Up, 1: Down, 2: Left, 3: Right)
                    var newX = j;
                    var newY = i;
                    if (randomDirection === 0 && i > 0 && map[i - 1] && map[i - 1][j] === 0) {
                        newY = i - 1; 
                    } else if (randomDirection === 1 && i < 24 && map[i + 1] && map[i + 1][j] === 0) {
                        newY = i + 1; 
                    } else if (randomDirection === 2 && j > 0 && map[i][j - 1] === 0) {
                        newX = j - 1; 
                    } else if (randomDirection === 3 && j < 39 && map[i][j + 1] === 0) {
                        newX = j + 1; 
                    }
                    if (newX >= 0 && newX < 40 && newY >= 0 && newY < 24) {
                        map[i][j] = 0;
                        map[newY][newX] = cell;
                    }
                }
            }
        }
    }
}

function isPlayerNearby(enemyY, enemyX) {
    if (Math.abs(characterX - enemyX) + Math.abs(characterY - enemyY) === 1) {
        return true;
    }
    return false;
}

function attackPlayer() {
    character.health -= 1   ; 
    if (character.health <= 0) {
        alert("Вы проиграли игра перезагрузится");
        reload(); 
    }
    drawMap(); 
}

function reload() {
    location.reload();
}

function updateInventory() {
    var inventoryContainer = document.querySelector('.inventory');
    inventoryContainer.innerHTML = ''; 
    for (var i = 0; i < inventory.length; i++) {
        var imageElement = document.createElement('img');
        imageElement.src = 'images/tile-SW.png';
        imageElement.style.height = '32px';
        inventoryContainer.appendChild(imageElement);
    }
}

document.addEventListener('keydown', function (event) {
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

