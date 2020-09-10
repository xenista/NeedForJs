const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    startButton =  document.querySelector('.startButton'),
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
const audio = new Audio('sound/jvla - Such a Whore.mp3');
const playAudioButton = document.querySelector('.playMusic');
//для каждой машинки свой background
const enemiesBG = ['enemyDPS', 'enemyTank', 'enemySport'];

//добавляем класс для машинки игрока
car.classList.add('car', 'player');
//рассчитываем количество элементов от высоты экрана и высоты элемента
function getQuantityElements(elementHeight){
    return document.documentElement.clientHeight / elementHeight +1;
}
function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }
function startGame(){
    if(localStorage.bestScore === undefined){
        localStorage.bestScore = 0;
    }
    
    start.classList.add('hide');
    gameArea.innerHTML = '';
    audio.play();
    playAudioButton.classList.add('play');
    //добавляем линии на дорогу
    for (let i=0; i< getQuantityElements(100); i++){
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = i * 100 + 'px';
        gameArea.appendChild(line);
        line.y = i * 100;
    }
    // добавляем врагов
    for (let i=0; i< getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        enemy.classList.add('car', 'enemy', enemiesBG[randomInteger(0, enemiesBG.length-1)]);
        enemy.y = -100 * setting.traffic * (i+1);
        enemy.style.left = Math.floor(Math.random()  * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        gameArea.appendChild(enemy);
    }
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + 'px';
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}
function playGame(){
    
    if (setting.start) {
        
        
        setting.score+=setting.speed;
        score.textContent = 'SCORE: '+ setting.score;
        moveRoad();
        moveEnemy();
        //отслеживаем нажатие стрелок на клавиатуре
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
        //перемещаем машинку
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }
}
function startRun(event){
    event.preventDefault();
    //В объект keys не должно добавляться новых свойств, для этого добавить условия
    if (Object.keys(keys).indexOf(event.key) != -1 ){
        keys[event.key] = true;
    }
}
function stopRun(event){
    event.preventDefault();
    //В объект keys не должно добавляться новых свойств, для этого добавить условия
    if (Object.keys(keys).indexOf(event.key) != -1 ){
        keys[event.key] = false;
    }
}
//анимация движения дороги
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
//рандомное перемещение врагов
function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = enemy.getBoundingClientRect();
        if (carRect.top <= enemyRect.bottom && 
            carRect.right>= enemyRect.left && 
            carRect.left <= enemyRect.right &&
            carRect.bottom  >= enemyRect.top){
            // console.log('ДТП');
            setting.start = false;
            start.classList.remove('hide');
            audio.pause();
            audio.currentTime = 0;
            playAudioButton.classList.remove('play');
            if (setting.score > localStorage.bestScore){
                localStorage.bestScore = setting.score;
                alert('NEW BEST SCORE: ' + setting.score); 
            }

        }
        enemy.y += setting.speed / 2;
        enemy.style.top = enemy.y + 'px';
        if (enemy.y >= document.documentElement.clientHeight){
            enemy.y = -100 * setting.traffic;
            enemy.style.left = Math.floor(Math.random()  * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
    
}
function playMusic(){
    if (playAudioButton.classList.contains('play')) {
        audio.pause();
        playAudioButton.classList.remove('play');

    }
    else {
        audio.play();
        playAudioButton.classList.add('play');
    }
}
startButton.addEventListener('click', startGame);
playAudioButton.addEventListener('click', playMusic);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

document.querySelectorAll('input[type=radio]').forEach( item => {
    item.addEventListener('click', function(){
        setting.speed = parseInt(this.value);
    })
})