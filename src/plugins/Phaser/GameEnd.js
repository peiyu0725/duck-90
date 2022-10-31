const LINEWIDTH = 1200
const LINEHEIGHT = 121
const WIDTH = 1200
const HEIGHT = window.innerHeight
const GOALWIDTH = 200
const GOALHEIGHT = 200
const DUCKWIDTH = 130
const DUCKHEIGHT = 230
const FINALWIDTH = 700
const FINALHEIGHT = 350
const BUTTONWIDTH = 150
const BUTTONHEIGHT = 55
const CLEARWIDTH = 190
const CLEARHEIGHT = 155

const gameEnd = {
    key: 'gameEnd',
    preload() {
        this.load.image('start-line', '/images/img_start_line.svg');
        this.load.image('end-line', '/images/img_end_line.svg');
        this.load.image('background', '/images/img_bg.svg');
        this.load.image('goal', '/images/goal.svg');
        this.load.spritesheet('duck',
            '/images/duck/duck.png',
            { frameWidth: DUCKWIDTH, frameHeight: DUCKHEIGHT }
        );
        this.load.image('btn', './images/btn/btn_start_off.svg')
        this.load.image('btn-click', './images/btn/btn_start_off_click.svg')
        this.load.image('clear-1', './images/img_clear_1.svg')
        this.load.image('clear-2', './images/img_clear_2.svg')
        this.load.image('clear-3', './images/img_clear_3.svg')
    },
    create() {
        this.startLine = this.add.tileSprite(WIDTH / 2, HEIGHT - LINEHEIGHT / 2, LINEWIDTH, LINEHEIGHT, 'start-line')
        this.background = this.add.tileSprite(WIDTH / 2, HEIGHT / 2 - LINEHEIGHT, WIDTH, HEIGHT, 'background')
        this.endLine = this.add.tileSprite(WIDTH / 2, -LINEHEIGHT / 2, LINEWIDTH, LINEHEIGHT, 'end-line')
        this.goal = this.add.tileSprite(WIDTH / 2, -(GOALHEIGHT / 3 + LINEHEIGHT), GOALWIDTH, GOALHEIGHT, 'goal')
        this.player = this.physics.add.sprite(WIDTH / 2, HEIGHT - DUCKHEIGHT / 2 - LINEHEIGHT - 20, 'duck')
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('duck', { start: 1, end: 3 }),
            frameRate: 5,
            repeat: -1
        })

        this.player.anims.play('run')
        this.tweens.add({
            targets: this.player,
            async onComplete() {
                console.log('end')
                alphaShow(this.finalWrapper)
                alphaShow(clear1, 1000)
                alphaShow(clear2, 1000)
                alphaShow(clear3, 1000)
                alphaShow(againBtnWrapper, 1000)
            },
            duration: 3000,
            loop: 0
        })

        this.finalWrapper = this.add.container((WIDTH - FINALWIDTH) / 2, (HEIGHT - FINALHEIGHT) / 2)
        this.finalWrapper.setSize(FINALWIDTH, FINALHEIGHT)
        let finalBg = this.add.graphics()
        finalBg.fillStyle(0xFFFFFF, 1)
        finalBg.fillRoundedRect(0, 0, FINALWIDTH, FINALHEIGHT, {
            tl: 30, tr: 30, bl: 30, br: 30
        })
        let finalTitle = this.add.text(161, 20, 'Congratulations! 恭喜過關!', {
            fontFamily: 'NotoSansTC-Medium',
            fontSize: 30,
            color: '#FF952B'
        })

        let againBtnWrapper = this.add.container(275, 261)
        let againBtn = this.add.tileSprite(75, 55 / 2, BUTTONWIDTH, BUTTONHEIGHT, 'btn')
        let againBtnText = this.add.text(27, 13, '再來一次...', {
            fontFamily: 'NotoSansTC-Medium',
            fontSize: 20,
        })
        againBtn.setInteractive({ cursor: 'pointer' })
        againBtn.on('pointerdown', function (event) {
            this.setTexture('btn-click');
            this.setSize(BUTTONWIDTH, BUTTONHEIGHT - 5);
            againBtnText.setPosition(27, 15)
        });
        againBtn.on('pointerup', function (event) {
            this.setTexture('btn');
            this.setSize(BUTTONWIDTH, BUTTONHEIGHT);
            againBtnText.setPosition(27, 13)
        });
        againBtnWrapper.add([againBtn, againBtnText])

        let clear1 = this.add.tileSprite(45 + CLEARWIDTH / 2, 78 + CLEARHEIGHT / 2, CLEARWIDTH, CLEARHEIGHT, 'clear-1')
        let clear2 = this.add.tileSprite(255 + CLEARWIDTH / 2, 78 + CLEARHEIGHT / 2, CLEARWIDTH, CLEARHEIGHT, 'clear-2')
        let clear3 = this.add.tileSprite(465 + CLEARWIDTH / 2, 78 + CLEARHEIGHT / 2, CLEARWIDTH, CLEARHEIGHT, 'clear-3')
        clear1.setAlpha(0)
        clear2.setAlpha(0)
        clear3.setAlpha(0)
        const alphaShow = (obj, time = 500) => {
            return new Promise((res) => {
                this.tweens.add({
                    targets: obj,
                    onComplete: res,
                    duration: time,
                    loop: 0,
                    ease: 'linear',
                    yoyo: false,
                    alpha: {
                        getStart: () => 0,
                        getEnd: () => 1
                    }
                })
            })
        }

        this.finalWrapper.add([finalBg, finalTitle, againBtnWrapper, clear1, clear2, clear3])
    },
    update() {

    }

}