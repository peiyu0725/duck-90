import Phaser from 'phaser'
const WIDTH = 1200
const HEIGHT = 900
const BALLWIDTH = 110
const BALLHEIGHT = 110
const BOSS1WIDTH = 385
const BOSS1HEIGHT = 316
const BOSS2WIDTH = 600
const BOSS2HEIGHT = 422
const STARWIDTH = 90
const STARHEIGHT = 74

const getRandom = (min = 0, max) => {
    return Math.floor(Math.random() * max) + min;
};

export default class Game extends Phaser.Scene {
    preload() {
        this.load.image('background', '/images/img_bg.svg');
        this.load.spritesheet('duck',
            '/images/duck/duck.png',
            { frameWidth: 130, frameHeight: 230 }
        );
        this.load.spritesheet('duck-super',
            '/images/duckSuper/duck-super.png',
            { frameWidth: 130, frameHeight: 230 }
        );
        for (let i = 1; i <= 5; i++) {
            this.load.image(`ball-${i}`, `/images/ball/ball_${i}.svg`);
        }
        this.load.image('boss-1', '/images/boss_1.svg');
        this.load.image('boss-2', '/images/boss_2.svg');
        this.load.image('star', '/images/super_star.svg');
        this.load.image('btn', './images/btn_start_off.svg')
        this.load.image('btn-click', './images/btn_start_off_click.svg')
    }

    create() {
        // tileSprite(x, y, w, h, key)
        this.background = this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 'background')
        this.player = this.physics.add.sprite(WIDTH / 2, HEIGHT - 80, 'duck')
        this.physics.add.existing(this.player)
        this.player.setSize(110, 210)
        this.player.setCollideWorldBounds(false)
        this.player.setInteractive()

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('duck', { start: 1, end: 3 }),
            frameRate: 5,
            repeat: -1
        })
        this.anims.create({
            key: 'super',
            frames: this.anims.generateFrameNumbers('duck-super', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        })
        this.anims.create({
            key: 'dead',
            frames: this.anims.generateFrameNumbers('duck', { start: 0, end: 0 }),
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
        this.star = createPhysics(0, -STARHEIGHT, STARWIDTH, STARHEIGHT, 'boss-1')
        for (let num = 0; num < 5; num++) {
            // 寬高：110px
            this[`ball${num + 1}`] = createPhysics(230 + 154 * num, -BALLHEIGHT, BALLWIDTH, BALLHEIGHT, `ball${num + 1}`);
            this.physics.add.collider(this.player, this[`ball${num + 1}`])	
        }

    }

    update() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.anims.play('run', true)

    }
}