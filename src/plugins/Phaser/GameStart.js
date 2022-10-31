import Phaser from 'phaser'

const LINEWIDTH = 1200
const LINEHEIGHT = 121
const WIDTH = 1200
const HEIGHT = window.innerHeight
const GOALWIDTH = 200
const GOALHEIGHT = 200
const DUCKWIDTH = 130
const DUCKHEIGHT = 230
const SUPERDUCKWIDTH = 185
const SUPERDUCKHEIGHT = 230
const BALLWIDTH = 110
const BALLHEIGHT = 110
const BOSS1WIDTH = 385
const BOSS1HEIGHT = 316
const BOSS2WIDTH = 600
const BOSS2HEIGHT = 422
const STARWIDTH = 90
const STARHEIGHT = 74
const GAMETIME = 5

const getRandom = (min = 0, max) => {
    return Math.floor(Math.random() * max) + min;
};

const transTime = (val) => {
    const min = parseInt(val / 60)
    const sec = val % 60 > 9 ? val % 60 : `0${val % 60}`
    return `0${min}:${sec}`
}


export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'GameStart' })
    }
    preload() {
        this.load.image('start-line', '/images/img_start_line.svg');
        this.load.image('end-line', '/images/img_end_line.svg');
        this.load.image('background', '/images/img_bg.svg');
        this.load.image('goal', '/images/goal.svg');
        this.load.spritesheet('duck',
            '/images/duck/duck.png',
            { frameWidth: DUCKWIDTH, frameHeight: DUCKHEIGHT }
        );
        this.load.spritesheet('duck-super',
            '/images/duckSuper/duck-super.png',
            { frameWidth: SUPERDUCKWIDTH, frameHeight: SUPERDUCKHEIGHT }
        );
        for (let i = 1; i <= 5; i++) {
            this.load.image(`ball-${i}`, `/images/ball/ball_${i}.svg`);
        }
        this.load.image('boss-1', '/images/boss_1.svg');
        this.load.image('boss-2', '/images/boss_2.svg');
        this.load.image('star', '/images/super_star.svg');
        this.load.image('btn', './images/btn/btn_start_off.svg')
        this.load.image('btn-click', './images/btn/btn_start_off_click.svg')
        this.load.image('clear-1', './images/img_clear_1.svg')
        this.load.image('clear-2', './images/img_clear_2.svg')
        this.load.image('clear-3', './images/img_clear_3.svg')
        this.countdown = GAMETIME
        this.superStarTime = false
        this.timer = null
        this.speed = 3
        this.gameEnd = false
    }

    create() {
        // tileSprite(x, y, w, h, key)
        this.startLine = this.add.tileSprite(WIDTH / 2, HEIGHT - LINEHEIGHT / 2, LINEWIDTH, LINEHEIGHT, 'start-line')
        this.background = this.add.tileSprite(WIDTH / 2, HEIGHT / 2 - LINEHEIGHT, WIDTH, HEIGHT, 'background')
        this.endLine = this.add.tileSprite(WIDTH / 2, -LINEHEIGHT / 2, LINEWIDTH, LINEHEIGHT, 'end-line')
        this.goal = this.add.tileSprite(WIDTH / 2, -(GOALHEIGHT / 3 + LINEHEIGHT), GOALWIDTH, GOALHEIGHT, 'goal')
        this.player = this.physics.add.sprite(WIDTH / 2, HEIGHT - DUCKHEIGHT / 2 - LINEHEIGHT - 20, 'duck')
        this.physics.add.existing(this.player)
        this.player.setCollideWorldBounds(false)
        this.player.setInteractive()

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('duck', { start: 1, end: 3 }),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'dead',
            frames: this.anims.generateFrameNumbers('duck', { start: 0, end: 0 }),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'super',
            frames: this.anims.generateFrameNumbers('duck-super', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        })

        const createPhysics = (x, y, w, h, key) => {
            const object = this.add.tileSprite(x, y, w, h, key)
            this.physics.add.existing(object);
            object.body.immovable = true;
            object.body.moves = false;
            return object
        }

        const boss1RangeX = [230, WIDTH / 2, WIDTH - 230 - BOSS1WIDTH]
        const boss2RangeX = [230, WIDTH - 230 - BOSS2WIDTH]
        this.boss1 = createPhysics(boss1RangeX[getRandom(0, 2)], -BOSS1HEIGHT, BOSS1WIDTH, BOSS1HEIGHT, 'boss-1')
        this.boss1.setVisible(false)
        this.physics.add.collider(this.player, this.boss1)
        this.boss2 = createPhysics(boss2RangeX[getRandom(0, 1)], -BOSS2HEIGHT, BOSS2WIDTH, BOSS2HEIGHT, 'boss-2')
        this.boss2.setVisible(false)
        this.physics.add.collider(this.player, this.boss2)
        this.star = createPhysics(0, -STARHEIGHT, STARWIDTH, STARHEIGHT, 'star')
        this.physics.add.collider(this.player, this.star)
        for (let num = 0; num < 5; num++) {
            // 寬高：110px
            this[`ball${num + 1}`] = createPhysics(230 + 154 * num, -BALLHEIGHT, BALLWIDTH, BALLHEIGHT, `ball${num + 1}`);
            this.physics.add.collider(this.player, this[`ball${num + 1}`])
        }

        // Timer
        let timerWrapper = this.add.container(WIDTH - 190, 0)
        timerWrapper.setSize(190, 135)

        let timerBgShadow = this.add.graphics()
        timerBgShadow.fillStyle(0x535353, 1)
        timerBgShadow.fillRoundedRect(0, 0, 190, 135, {
            tl: 0, tr: 0, bl: 30, br: 30
        })

        let timerBg = this.add.graphics()
        timerBg.fillStyle(0x262626, 1)
        timerBg.fillRoundedRect(0, 0, 190, 130, {
            tl: 0, tr: 0, bl: 30, br: 30
        })

        let timeText = this.add.text(23, 17, 'TIME', {
            fontFamily: 'Roboto-Regular',
            fontSize: 14,
            color: 'white'
        })

        let countdownText = this.add.text(23, 40, transTime(this.countdown), {
            fontFamily: 'Roboto-Regular',
            fontSize: 58,
            color: 'white'
        })

        timerWrapper.add([timerBgShadow, timerBg, timeText, countdownText])
        this.timer = setInterval(() => {
            this.countdown--
            countdownText.setText(transTime(this.countdown))
            if (this.countdown <= 0) {
                clearInterval(this.timer)
                return
            }
        }, 1000)
    }

    update() {
        if (this.gameEnd) return
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.anims.play('run', true)
        this.player.setSize(DUCKWIDTH, DUCKHEIGHT)
        if (this.background.y < HEIGHT / 2) {
            // 起步
            this.startLine.y += this.speed
            if (HEIGHT / 2 - this.background.y < this.speed) {
                this.background.y = HEIGHT / 2
            }
            else {
                this.background.y += this.speed
            }
        }
        else if (this.countdown > 0) {
            // 進行
            if (this.countdown < 2) {
                this.endLine.y += 2
                this.background.y += 2
                this.goal.y += 6.2
            }
            else {
                this.background.tilePositionY -= this.speed
            }

            if (this.cursors.right.isDown && this.player.x <= WIDTH - 215) {
                this.player.x += this.speed * 1.5
            } else if (this.cursors.left.isDown && this.player.x >= 215) {
                this.player.x -= this.speed * 1.5
            }
        }
        else if (this.countdown <= 0) {
            // 結束
            if (this.player.y > LINEHEIGHT + GOALHEIGHT * 2 / 3 + DUCKHEIGHT / 2 - 26) {
                this.player.y -= this.speed * 1.5
            }
            else {
                this.player.anims.play('run', false)
                // this.scene.start('gameEnd')
                this.gameOver = true
            }

            if (this.player.x > WIDTH / 2) {
                if (this.player.x - WIDTH / 2 < this.speed * 1.5) {
                    this.player.x = WIDTH / 2
                    return
                }
                this.player.x -= this.speed * 1.5
            }
            else {
                if (WIDTH / 2 - this.player.x < this.speed * 1.5) {
                    this.player.x = WIDTH / 2
                    return
                }
                this.player.x += this.speed * 1.5
            }
        }
    }
}