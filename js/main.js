const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');
const keys = {
    ArrowUp : false,
    ArrowDown : false,
    ArrowRight: false,
    ArrowLeft: false
};
const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
}
const enemiesBG = ['enemyDPS', 'enemyTank'];

car.classList.add('car', 'player');
function getQuantityElements(elementHeight){
    return document.documentElement.clientHeight / elementHeight +1;
}
function startGame(){
    start.classList.add('hide');
    for (let i=0; i< getQuantityElements(100); i++){
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = i * 100 + 'px';
        gameArea.appendChild(line);
        line.y = i * 100;
    }
    for (let i=0; i< getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        enemy.classList.add('car', 'enemy', enemiesBG[Math.round(Math.random())]);
        enemy.y = -100 * setting.traffic * (i+1);
        enemy.style.left = Math.floor(Math.random()  * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        gameArea.appendChild(enemy);
    }
    setting.start = true;
    gameArea.appendChild(car);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}
function playGame(){
    
    if (setting.start) {
        moveRoad();
        moveEnemy();
        if(keys.ArrowLeft && setting.x > 0){
            setting.x-=setting.speed;
        }
        if(keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth){
            setting.x+=setting.speed;
        }
        if(keys.ArrowDown && setting.y < gameArea.offsetHeight - car.offsetHeight) {
            setting.y+=setting.speed;
        }
        if(keys.ArrowUp && setting.y > 0){
            setting.y-=setting.speed;
        }
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }
}
function startRun(event){
    event.preventDefault();
    keys[event.key] = true;
}
function stopRun(event){
    event.preventDefault();
    keys[event.key] = false;
}
function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(line => {
            line.y += setting.speed;
            line.style.top = line.y + 'px';
            if (line.y >= document.documentElement.clientHeight){
                line.y = -100;
            }
        }
    )
}
function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        enemy.y += setting.speed / 2;
        enemy.style.top = enemy.y + 'px';
        if (enemy.y >= document.documentElement.clientHeight){
            enemy.y = -100 * setting.traffic;
            enemy.style.left = Math.floor(Math.random()  * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
    
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);