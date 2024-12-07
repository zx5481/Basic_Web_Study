class EventEmitter {
    constructor()
    {
        this.listeners = {};
    }
    on(message, listener)
    {
        if (!this.listeners[message])
        {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }
    emit(message, payload = null)
    {
        if (this.listeners[message])
        {
            this.listeners[message].forEach((l) => l(message, payload));
        }
    }
    clear()
    {
        this.listeners = {};
    }
}

class GameObject
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.dead = false; // 객체가 파괴되었는지 여부
        this.type = ""; // 객체 타입 (영웅/적)
        this.width = 0; // 객체의 폭
     this.height = 0; // 객체의 높이
        this.img = undefined; // 객체의 이미지
    }
    rectFromGameObject() {
        return {
        top: this.y,
        left: this.x,
        bottom: this.y + this.height,
        right: this.x + this.width,
        };
    }
    
    draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // 캔버스에 이미지 그리기
    }
}

class Hero extends GameObject {
    constructor(x, y) {
    super(x, y);
    (this.width = 99), (this.height = 75);
    this.type = 'Hero';
    this.speed = { x: 0, y: 0 };
    this.cooldown = 0;
    this.life = 3;
    this.points = 0;
    this.kill = 0;

    }
    fire() {
        if (this.canFire()) {
        gameObjects.push(new LaserRed(this.x + 45, this.y - 10)); // 레이저 발사
        this.cooldown = 500; // 쿨다운 500ms
        let id = setInterval(() => {
            if (this.cooldown > 0) {
                this.cooldown -= 100;
            }
            else {
                clearInterval(id);
            }
        }, 100);
        }
    }

    canFire() {
        return this.cooldown === 0; // 쿨다운이 끝났는지 확인
    }
     
    decrementLife() {
        this.life--;
        if (this.life === 0) {
        this.dead = true;
        }
        if(this.life <= 1)
        {
            this.img = heroDamagedImg;
            heroSub1.img = heroDamagedImg;
            heroSub2.img = heroDamagedImg;
        }
       }

    incrementPoints() {
        this.points += 100;
        }
}

class HeroSub extends GameObject {
    constructor(x, y) {
    super(x, y);
    (this.width = 33), (this.height = 25);
    this.type = 'HeroSub';
    this.speed = { x: 0, y: 0 };
    this.cooldown = 0;
    }   
    fire() {
        if (this.canFire()) {
        gameObjects.push(new LaserRed(this.x + 12, this.y - 10)); // 레이저 발사
        this.cooldown = 500; // 쿨다운 500ms
        let id = setInterval(() => {
            if (this.cooldown > 0) {
                this.cooldown -= 100;
            }
            else {
                clearInterval(id);
            }
        }, 100);
        }
    }

    canFire() {
        return this.cooldown === 0; // 쿨다운이 끝났는지 확인
    }
}

class Laser extends GameObject{
    constructor(x, y) {
        super(x,y);
        (this.width = 9), (this.height = 33);
        this.type = 'Laser';
    }
}

class LaserRed extends Laser {
    constructor(x, y) {
    super(x,y);
    this.img = laserRedImg;
    let id = setInterval(() => {
        if (this.y > 0)
        {
            this.y -= 15;
        } else
        {
            this.dead = true;
            clearInterval(id);
        }
    }, 100)
    }
}

class LaserGreen extends Laser {
    constructor(x, y) {
    super(x,y);
    this.img = laserGreenImg;
    this.type = "enemyLaser";
    let id = setInterval(() => {
        if (this.y < canvas.height)
        {
            this.y += 15;
        } else
        {
            this.dead = true;
            clearInterval(id);
        }
    }, 100)
    }
}

class LaserShot extends GameObject {
    constructor(x, y) {
        super(x,y);
        (this.width = 98), (this.height = 98);
        this.type = 'LaserShot';
        let id = setInterval(() => {
            if (setTimeout(1000) > 0) {
                this.dead = true;
                clearInterval(id);
            }
        }, 100)
    }
}

class LaserRedShot extends LaserShot {
    constructor(x, y) {
        super(x,y);
        this.img = laserRedShotImg;
    }
}

class LaserGreenShot extends LaserShot {
    constructor(x, y) {
        super(x, y);
        this.img = laserGreenShotImg;
    }
}

class Enemy extends GameObject
{
    constructor(x, y)
    {
        super(x, y);
        this.type = "Enemy";
        this.deadCount = 0;
        this.isShotable = false;
        this.lastFire = Date.now();
        this.speed = 15;
        // 적 캐릭터의 자동 이동 (Y축 방향)
        let id = setInterval(() =>
        {
            if (this.y < canvas.height - this.height)
            {
                this.y += this.speed; // 아래로 이동
            }
        }, 300);
    }
}

class Enemy_greenShip extends Enemy {
    constructor(x, y)
    {
        super(x, y);
        this.width = 98;
        this.height = 50;
        this.isShotable = true;
        this.speed = 10;
    }
    fire() {
        const now = Date.now();
        if (this.isShotable && now - this.lastFire > 3000)
        {
            gameObjects.push(new LaserGreen(this.x + 45, this.y + 30)); // 레이저 발사
            this.lastFire = now; // 공격 시간 초기화
        }
    }
}

class Enemy_UFO extends Enemy {
    constructor(x, y) {
    super(x, y);
    this.width = 91;
    this.height = 91;
    }
    fire() {
        const now = Date.now();
        if (this.isShotable && now - this.lastFire > 4000)
        {
            gameObjects.push(new LaserGreen(this.x + 50, this.y + 10)); // 레이저 발사
            this.lastFire = now; // 공격 시간 초기화
        }
    }
}

class EnemyBoss extends GameObject
{
    constructor(x, y)
    {
        super(x, y);
        this.type = "EnemyBoss";
        this.deadCount = 0;
        this.isShotable = false;
        this.lastFire = Date.now();
        this.speed = 50;
        this.life = 30;
        this.movecicle = "Left";
        // 적 캐릭터의 자동 이동 (Y축 방향)
    }
}

class Enemy_BossTwin1 extends EnemyBoss {
    constructor(x, y) {
        super(x, y)
        this.type = "enemy_BossTwin1";
        this.width = 256;
        this.height = 256;
        this.isShotable = true;
        let id = setInterval(() =>
            {
                if (this.x - this.speed > 0 && this.movecicle == "Left")
                {
                    this.x -= this.speed;
                }
                else if(this.x + this.width + this.speed < canvas.width / 2)
                {
                    this.movecicle = "Right";
                    this.x += this.speed;
                }
                else
                {
                    this.movecicle = "Left";
                }
            }, 300);
    }
    fire() {
        const now = Date.now();
        if (this.isShotable && now - this.lastFire > 1500)
        {
            gameObjects.push(new LaserGreen(this.x + 128, this.y + 236)); // 레이저 발사
            this.lastFire = now; // 공격 시간 초기화
        }
    }
    
}

class Enemy_BossTwin2 extends EnemyBoss {
    constructor(x, y) {
        super(x, y)
        this.type = "enemy_BossTwin2";
        this.width = 256;
        this.height = 256;
        this.isShotable = true;
        this.movecicle = "Right";
        let id = setInterval(() =>
            {
                if (this.x + this.width + this.speed < canvas.width && this.movecicle == "Right")
                {
                    this.x += this.speed;
                }
                else if(this.x - this.speed > canvas.width / 2)
                {
                    this.movecicle = "Left";
                    this.x -= this.speed;
                }
                else
                {
                    this.movecicle = "Right";
                }
            }, 300);
    }
    fire() {
        const now = Date.now();
        if (this.isShotable && now - this.lastFire > 1500)
        {
            gameObjects.push(new LaserGreen(this.x + 128, this.y + 236)); // 레이저 발사
            this.lastFire = now; // 공격 시간 초기화
        }
    }
}

let onKeyDown = function (e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
    case 37: // 왼쪽 화살표
    case 39: // 오른쪽 화살표
    case 38: // 위쪽 화살표
    case 40: // 아래쪽 화살표
    case 32: // 스페이스바
    e.preventDefault();
    break;
    default:
    break;
    }
};

const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
    COLLISION_ENEMYBOSS_LASER: "COLLISION_ENEMYBOSS_LASER",
    COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
    COLLISION_ENEMYBOSS_HERO: "COLLISION_ENEMYBOSS_HERO",
    CoLLISION_ENEMY_CANVAS: "COLLISION_ENEMY_CANVAS",
    COLLISION_HERO_LASER: "COLLISION_HERO_LASER",
    DAMAGED_HERO: "DAMAGED_HERO",
    GAME_END_LOSS: "GAME_END_LOSS",
    GAME_END_WIN: "GAME_END_WIN",
    KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
};

let heroImg,
    heroLeftImg,
    heroRightImg,
    heroDamagedImg,
    enemyShipImg,
    enemyUFOImg,
    enemyBossTwinImg1,
    enemyBossTwinImg2,
    lifeImg,
    laserRedImg,
    laserRedShotImg,
    laserGreenImg,
    laserGreenShotImg,
    backgroundImg;

let canvas, ctx, 
    gameObjects = [], 
    hero,
    enemy,
    stageCount,
    MONSTER_TOTAL,
    MONSTER_greenShip,
    MONSTER_UFO,
    MONSTER_BOSS,
    eventEmitter = new EventEmitter();

let scoreHero = 0;

window.addEventListener('keydown', onKeyDown);

window.addEventListener("keydown", (evt) => {
    if (evt.key === "ArrowUp") {
    eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (evt.key === "ArrowDown") {
    eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (evt.key === "ArrowLeft") {
    eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (evt.key === "ArrowRight") {
    eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    } else if(evt.keyCode === 32) {
    eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    }
    else if(evt.key === "Enter") {
        eventEmitter.emit(Messages.KEY_EVENT_ENTER);
       }
       
});

function drawText(message, x, y)
{
    ctx.fillText(message, x, y);
}

function drawLife() {
    const START_POS = canvas.width - 180;
    for(let i=0; i < hero.life; i++ ) {
    ctx.drawImage(
    lifeImg, 
    START_POS + (45 * (i+1) ), 
    canvas.height - 37);
    }
   }

function drawPoints()
{
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    drawText("Points: " + hero.points, 10, canvas.height-20);
}

function drawKill()
{
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    drawText("Kill: " + hero.kill, 10, canvas.height-50)
}

function drawStage()
{
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    drawText("Stage: " + stageCount, 10, 30)
}

function drawDeadCount()
{
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    drawText("EnemyDead: " + enemy.deadCount, 10, 60)
}

function drawInterface()
{
    drawLife();
    drawPoints();
    drawKill();
    drawStage();
    drawDeadCount();
}

function drawResult(color)
{
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    drawText("Points: " + hero.points, canvas.width / 2 - 50, canvas.height / 2 + 30)
}

function isHeroDead()
{
    return hero.life <= 0;
}

function isEnemiesDead()
{
    const enemies = gameObjects.filter((go) => go.type === "Enemy" && !go.dead);
    return enemy.deadCount === MONSTER_TOTAL;
}

function displayMessage(message, color = "red")
{
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function loadTexture(path)
{
    return new Promise
    ((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () =>
        {
            resolve(img);
        };
    })
}
   
function intersectRect(r1, r2) {
    return !(
    r2.left > r1.right || // r2가 r1의 오른쪽에 있음
    r2.right < r1.left || // r2가 r1의 왼쪽에 있음
    r2.top > r1.bottom || // r2가 r1의 아래에 있음
    r2.bottom < r1.top // r2가 r1의 위에 있음
    );
   }


function updateGameObjects() {
    const hero_Current = gameObjects.filter((go) => go.type === "Hero");
    const enemies = gameObjects.filter((go) => go.type === "Enemy");
    const lasers = gameObjects.filter((go) => go.type === "Laser");
    const lasers_enemy = gameObjects.filter((go) => go.type === "enemyLaser");
    const enemies_BossTwin1 = gameObjects.filter((go) => go.type === "enemy_BossTwin1");
    const enemies_BossTwin2 = gameObjects.filter((go) => go.type === "enemy_BossTwin2");

    hero_Current.forEach((hero_Current) => {
        if(hero_Current.life <= 1)
        {
            eventEmitter.emit(Messages.DAMAGED_HERO, {hero_Current});
        }
    });

    enemies.forEach((enemy) => enemy.fire());
    enemies_BossTwin1.forEach((enemy_Boss) => enemy_Boss.fire());
    enemies_BossTwin2.forEach((enemy_Boss) => enemy_Boss.fire());

    lasers.forEach((l) => {
        enemies.forEach((m) => {
            if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
                first: l,
                second: m,
                });
                let ShotSpot_x = m.x;
                let ShotSpot_y = m.y;
                laserRedShot = new LaserRedShot(ShotSpot_x, ShotSpot_y);
                laserRedShot.img = laserRedShotImg;
                gameObjects.push(laserRedShot);
            }
        });
        enemies_BossTwin1.forEach((enemy_Boss) => {
            if (intersectRect(l.rectFromGameObject(), enemy_Boss.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMYBOSS_LASER, {
                    first: l,
                    second: enemy_Boss,
                    });
                    let ShotSpot_x = l.x;
                    let ShotSpot_y = l.y - 80;
                    laserRedShot = new LaserRedShot(ShotSpot_x, ShotSpot_y);
                    laserRedShot.img = laserRedShotImg;
                    gameObjects.push(laserRedShot);
            }
        })
        enemies_BossTwin2.forEach((enemy_Boss) => {
            if (intersectRect(l.rectFromGameObject(), enemy_Boss.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMYBOSS_LASER, {
                    first: l,
                    second: enemy_Boss,
                    });
                    let ShotSpot_x = l.x;
                    let ShotSpot_y = l.y - 80;
                    laserRedShot = new LaserRedShot(ShotSpot_x, ShotSpot_y);
                    laserRedShot.img = laserRedShotImg;
                    gameObjects.push(laserRedShot);
            }
        })
    });

    lasers_enemy.forEach((laser_enemy) => {
        hero_Current.forEach((hero_Current) => {
            if(intersectRect(laser_enemy.rectFromGameObject(), hero_Current.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_HERO_LASER, {
                    first: laser_enemy,
                    second: hero_Current,
                    });
                let ShotSpot_x = hero_Current.x;
                let ShotSpot_y = hero_Current.y;
                laserGreenShot = new LaserGreenShot(ShotSpot_x, ShotSpot_y);
                laserGreenShot.img = laserGreenShotImg;
                gameObjects.push(laserGreenShot);
            }
        })
    })

    enemies.forEach(enemy => {
        const heroRect = hero.rectFromGameObject();
        if (intersectRect(heroRect, enemy.rectFromGameObject()))
        {
            eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
        }

        if (enemy.y > canvas.height - enemy.height)
        {
            eventEmitter.emit(Messages.CoLLISION_ENEMY_CANVAS, {enemy});
        }
    });

    enemies_BossTwin1.forEach(enemy_Boss => {
        const heroRect = hero.rectFromGameObject();
        if (intersectRect(heroRect, enemy_Boss.rectFromGameObject()))
        {
            eventEmitter.emit(Messages.COLLISION_ENEMYBOSS_HERO, { enemy_Boss })
        }
    })

    enemies_BossTwin2.forEach(enemy_Boss => {
        const heroRect = hero.rectFromGameObject();
        if (intersectRect(heroRect, enemy_Boss.rectFromGameObject()))
        {
            eventEmitter.emit(Messages.COLLISION_ENEMYBOSS_HERO, { enemy_Boss })
        }
    })

    gameObjects = gameObjects.filter((go) => !go.dead);
}

window.onload = async() =>
{
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    heroImg = await loadTexture("assets/player.png");
    heroLeftImg = await loadTexture("assets/playerLeft.png");
    heroRightImg = await loadTexture("assets/playerRight.png");
    heroDamagedImg = await loadTexture("assets/playerDamaged.png")
    enemyShipImg = await loadTexture("assets/enemyShip.png");
    enemyUFOImg = await loadTexture("assets/enemyUFO.png");
    enemyBossTwinImg1 = await loadTexture("assets/enemyBossTwin1.png");
    enemyBossTwinImg2 = await loadTexture("assets/enemyBossTwin2.png");
    laserRedImg = await loadTexture("assets/laserRed.png");
    laserRedShotImg = await loadTexture("assets/laserRedShot.png");
    laserGreenImg = await loadTexture("assets/laserGreen.png");
    laserGreenShotImg = await loadTexture("assets/laserGreenShot.png");
    lifeImg = await loadTexture("assets/life.png");
    backgroundImg = await loadTexture("assets/starBackground.png")
    
    const pattern = ctx.createPattern(backgroundImg, 'repeat');

    stageCount = 1;
    MONSTER_TOTAL = stageCount;

    function initGame() {
        gameObjects = [];
        createEnemiesDraw();
        createHero();
        hero.points = scoreHero;
        
        let controlSpeed = 20;
        enemy.deadCount = 0;

        eventEmitter.on(Messages.KEY_EVENT_UP, () => {
            if(hero.y + controlSpeed - 25 > 0)
            {
                hero.y -=controlSpeed;
                heroSub1.y -= controlSpeed;
                heroSub2.y -= controlSpeed;
            }
        })
        eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
            if(hero.y + hero.width < canvas.height)
            {
                hero.y += controlSpeed;
                heroSub1.y += controlSpeed;
                heroSub2.y += controlSpeed;
            }
        });
        eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
            if(hero.x - controlSpeed > 0)
            {
                hero.x -= controlSpeed;
                heroSub1.x -= controlSpeed;
                heroSub2.x -= controlSpeed;
            }
        });
        eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
            if(hero.x + hero.width + controlSpeed < canvas.width)
                {
                    hero.x += controlSpeed;
                    heroSub1.x += controlSpeed;
                    heroSub2.x += controlSpeed;
                }
        });
        eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
            if (hero.canFire()) {
                hero.fire();
                heroSub1.fire();
                heroSub2.fire();
            }
        });

        eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
            resetGame();
           });
        
        eventEmitter.on(Messages.CoLLISION_ENEMY_CANVAS, (_, {enemy}) => {
            enemy.dead = true;
            hero.decrementLife();
            enemy.deadCount += 1;

            if (isHeroDead()) {
                eventEmitter.emit(Messages.GAME_END_LOSS);
                return; // loss before victory
                }
        });

        eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
            first.dead = true;
            second.dead = true;

            enemy.deadCount += 1;
            hero.kill += 1;
            hero.incrementPoints();
            if (isEnemiesDead())
            {
                eventEmitter.emit(Messages.GAME_END_WIN);
            }
        });

        eventEmitter.on(Messages.COLLISION_ENEMYBOSS_LASER, (_, { first, second }) => {
            first.dead = true;
            second.life -= 1;

            hero.incrementPoints();


            if(second.life == 0)
            {
                second.dead = true;
                enemy.deadCount += 1;
                hero.kill += 1;
                if (isEnemiesDead())
                    {
                        eventEmitter.emit(Messages.GAME_END_WIN);
                    }
            }
        });

        eventEmitter.on(Messages.COLLISION_HERO_LASER, (_, { first, second }) => {
            first.dead = true;

            hero.decrementLife();
            if (isHeroDead()) {
                eventEmitter.emit(Messages.GAME_END_LOSS);
                return; // loss before victory
                }
            eventEmitter.on(Messages.GAME_END_LOSS, () => {
                endGame(false);
               });
        });

        eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy: enemy_Current }) => {
            enemy.deadCount += 1;
            enemy_Current.dead = true;
            
            hero.decrementLife();
            if (isHeroDead()) {
            eventEmitter.emit(Messages.GAME_END_LOSS);
            return; // loss before victory
            }
            if (isEnemiesDead()) {
            eventEmitter.emit(Messages.GAME_END_WIN);
            }
           });
           eventEmitter.on(Messages.GAME_END_WIN, () => {
            endGame(true);
           });
            
           eventEmitter.on(Messages.GAME_END_LOSS, () => {
            endGame(false);
           });

        eventEmitter.on(Messages.COLLISION_ENEMYBOSS_HERO, (_, { enemy_Boss }) => {
            
            hero.decrementLife();
            if (isHeroDead()) {
            eventEmitter.emit(Messages.GAME_END_LOSS);
            return; // loss before victory
            }
           });
           
           eventEmitter.on(Messages.GAME_END_LOSS, () => {
            endGame(false);
           });
        
    }

    function createEnemies_greenShip(x)
    {
        const y = 0;
        
        const enemy_greenShip = new Enemy_greenShip(x, y);
        enemy_greenShip.img = enemyShipImg;
        gameObjects.push(enemy_greenShip);

    }

    function createEnemies_UFO(x)
    {
        const y = 0;
        
        const enemy_UFO = new Enemy_UFO(x, y);
        enemy_UFO.img = enemyUFOImg;
        gameObjects.push(enemy_UFO);
    }

    function createEnemies_BossTwin(x)
    {
        const y = 0;

        const enemy_BossTwin1 = new Enemy_BossTwin1(x - 256, y);
        const enemy_BossTwin2 = new Enemy_BossTwin2(x, y);
        enemy_BossTwin1.img = enemyBossTwinImg1;
        enemy_BossTwin2.img = enemyBossTwinImg2;

        gameObjects.push(enemy_BossTwin1);
        gameObjects.push(enemy_BossTwin2);
    }

    function createEnemiesDraw()
    {
        let delay = 0;
        enemy = new Enemy();
        enemy.deadCount = 0;
        MONSTER_greenShip = stageCount * 2;
        MONSTER_UFO = stageCount * 3;
        MONSTER_BOSS = 0;
        if (stageCount == 5)
        {
            MONSTER_BOSS = 2;
        }
        MONSTER_TOTAL = MONSTER_UFO + MONSTER_greenShip + MONSTER_BOSS;

        if(stageCount == 5)
        {
            createEnemies_BossTwin(canvas.width / 2);
        }

        for (let x = 0; x < MONSTER_UFO; x++)
        {
            let Enemy_greenShipX = Math.floor(Math.random() * (canvas.width - 98))
            let Enemy_UFOX = Math.floor(Math.random() * (canvas.width - 98))
            if(x < MONSTER_greenShip)
            {
                setTimeout(() => {
                    createEnemies_greenShip(Enemy_greenShipX);}
                    , delay);
            }
            setTimeout(() => {
                createEnemies_UFO(Enemy_UFOX);}
                , delay);
            delay += 2000
        }
    }

    function createHero() {
        hero = new Hero(
        canvas.width / 2 - 45,
        canvas.height - canvas.height / 4
        );

        heroSub1 = new HeroSub(
            canvas.width / 2 + 75,
            canvas.height - (canvas.height / 4) + 30
        );

        heroSub2 = new HeroSub(
            canvas.width / 2 - 100,
            canvas.height - (canvas.height / 4) + 30
        );

        if(hero.life > 1)
        {
            hero.img = heroImg;
            heroSub1.img = heroImg;
            heroSub2.img = heroImg;
        }
        else
        {
            hero.img = heroDamagedImg;
            heroSub1.img = heroDamagedImg;
            heroSub2.img = heroDamagedImg;
        }
        

        gameObjects.push(hero);
        gameObjects.push(heroSub1);
        gameObjects.push(heroSub2);
    }

    function drawGameObjects(ctx) {
        gameObjects.forEach(go => go.draw(ctx));
    }

    function endGame(win)
    {
        clearInterval(gameLoopId);
        // 게임 화면이 겹칠 수 있으니, 200ms 지연
        setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (win)
        {
            if (stageCount == 5)
            {
                displayMessage(
                    "Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew",
                    "green"
                );
                drawResult("green");
                stageCount = 1;
            }
            else
            {
                stageCount++;
                scoreHero = hero.points;
                resetGame()
            }
        } else {
        displayMessage(
        "You died !!! Press [Enter] to start a new game Captain Pew Pew"
        );
        drawResult("red");
        stageCount = 1;
        }
        }, 200) 
    }

    function resetGame()
    {
        if (gameLoopId)
        {
            clearInterval(gameLoopId); // 게임 루프 중지, 중복 실행 방지
            eventEmitter.clear(); // 모든 이벤트 리스너 제거, 이전 게임 세션 충돌 방지
            initGame(); // 게임 초기 상태 실행
            gameLoopId = setInterval(() => { // 100ms 간격으로 새로운 게임 루프 시작
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawInterface();
                updateGameObjects();
                drawGameObjects(ctx);
            }, 100);
        }
    }

    initGame();
    
    let gameLoopId = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGameObjects(ctx);
        updateGameObjects();
        drawInterface();
    }, 100);
};