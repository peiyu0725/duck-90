import { useState, useEffect, useRef } from 'react';
import FinishDialog from './components/FinishDailog';
import Overlay from './components/Overlay';

const GAMETIME = 20
const DUCKWIDTH = 130
const BACKGROUNDWIDTH = 1200
const BACKGROUNDHEIGHT = 900
const SPEED = 8

const Home = () => {
  const [showFinish, setShowFinish] = useState(false)
  const [duckPos, setDuckPos] = useState(0)
  const [duckImage, setDuckImage] = useState(1)
  const counter = useRef(GAMETIME)
  const gamePlaying = useRef(false)
  const duck = useRef()
  const background = useRef()
  let isLeft = false
  let isRight = false
  let ctx = null
  const timer = null
  const countTimer = null

  const handleUserKeyDown = (event) => {
    const { keyCode } = event;
    switch (keyCode) {
      case 32:
        event.preventDefault();
        gamePlaying.current = true
        break;
      case 37:
        event.preventDefault();
        isLeft = true
        break;
      case 39:
        event.preventDefault();
        isRight = true
        break;
    }
  };

  const handleUserKeyUp = (event) => {
    const { keyCode } = event;
    if (keyCode === 37) {
      event.preventDefault();
      isLeft = false
    } else if (keyCode === 39) {
      event.preventDefault();
      isRight = false
    }
  };

  const startCount = () => {
    countTimer = setInterval(() => {
      if (!gamePlaying.current) return
      if (counter.current === 0) {
        gamePlaying.current = false
        setTimeout(() => {
          setShowFinish(true)
        }, 2000)
        return
      }
      if (counter.current % 2 === 0) {
        const readomNum = getRandom(0, 3)
        drawRandomBall(readomNum)
      }
      counter.current -= 1
      setDuckImage(val => val < 3 ? val + 1 : 1)
    }, 1000)
  }

  const startDuckTimer = () => {
    timer = setInterval(() => {
      if (!gamePlaying.current || counter.current === 0) return
      if (isLeft) {
        if (duck.current.offsetLeft <= background.current.offsetLeft + 121) return
        setDuckPos(pos => pos - 8)
      }
      if (isRight) {
        if (duck.current.offsetLeft >= background.current.offsetLeft + BACKGROUNDWIDTH - 121 - DUCKWIDTH) return
        setDuckPos(pos => pos + 8)
      }
    }, 15)
  }

  const resizeView = () => {
    setDuckPos(background.current.offsetLeft + BACKGROUNDWIDTH / 2 - DUCKWIDTH / 2)
  }

  const transTime = (val) => {
    const min = parseInt(val / 60)
    const sec = val % 60 > 9 ? val % 60 : `0${val % 60}`
    return `0${min}:${sec}`
  }
  const getRandom = (min, max) => {
    return Math.floor(Math.random() * max) + min;
  };
  const loadImage = src =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    })
    ;

  const drawRandomBall = (ballNum) => {
    const ballArray = Array.from({ length: ballNum }, (v, i) => `/images/ball_${getRandom(1, 5)}.svg`);
    console.log(ballArray)
    Promise.all(ballArray.map(loadImage)).then(images => {
      console.log(images)
      images.forEach((image, i) =>
        ctx.drawImage(image, i * 110, 400, image.width, image.height)
      );
    })
  }

  const draw = () => {
    var img = new Image();
    img.src = '/images/img_bg.svg';
    img.onload = function () {
      var y = 0;
      var timer = setInterval(function () {
        ctx.clearRect(0, 0, background.current.width, background.current.height);
        if (gamePlaying.current && counter.current >= 1 && counter.current < (GAMETIME - 1)) {
          y++;
        }
        if (y >= BACKGROUNDHEIGHT) {
          y = 0;
        }
        ctx.drawImage(img, 0, y);
        ctx.drawImage(img, 0, 0, BACKGROUNDWIDTH, y + BACKGROUNDHEIGHT, 0,
          -BACKGROUNDHEIGHT + y, BACKGROUNDWIDTH, y + BACKGROUNDHEIGHT);
      }, SPEED)
    }
  }

  const onRestart = () => {
    window.location.reload(false)
  }

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      ctx = background.current.getContext('2d')
      draw()
      setDuckPos(background.current.offsetLeft + BACKGROUNDWIDTH / 2 - DUCKWIDTH / 2)
      startCount()
      startDuckTimer()
      window.addEventListener('resize', resizeView)
      window.addEventListener("keydown", handleUserKeyDown);
      window.addEventListener("keyup", handleUserKeyUp);
    }
    return () => {
      clearInterval(timer)
      clearInterval(countTimer)
      window.removeEventListener('resize', resizeView)
      window.removeEventListener("keydown", handleUserKeyDown);
      window.removeEventListener("keyup", handleUserKeyUp);
      isMounted = false
    };
  }, []);

  return (
    <div className="container">
      <title>Duck 90!</title>
      <main>
        <div className={'pool ' + (counter.current < GAMETIME && counter.current >= 1 ? 'playing ' : '') + (counter.current < 1 ? 'end' : '')}>
          <img ref={duck} id="duck"
            className={(gamePlaying.current && counter.current <= (GAMETIME - 2) ? 'game-playing ' : '') + (counter.current < 1 ? 'game-finish ' : '')}
            src={`/images/duck_normal_${duckImage}.svg`}
            alt="img_duck" style={{ left: `${duckPos}px` }} draggable="false" />
          <div className={'goal ' + (counter.current < 1 ? 'game-finish' : '')}></div>
          <div className="end-line"></div>
          <canvas ref={background} width={BACKGROUNDWIDTH} height={BACKGROUNDHEIGHT}></canvas>
          <div className="start-line"></div>
        </div>
        <div className="counter" style={{ right: background.current ? `calc((100% - ${background.current.width}px) / 2` : 0 }}>
          <div className="counter-title">TIME</div>
          <div className="counter-number">{transTime(counter.current)}</div>
        </div>
      </main>
      {showFinish &&
        <>
          <Overlay></Overlay>
          <FinishDialog show={showFinish} onRestart={onRestart}></FinishDialog>
        </>
      }

    </div>
  )
}

export default Home
