import { useState, useEffect, useRef } from 'react';

const Home = () => {
  const [duckPos, setDuckPos] = useState(0)
  const [duckImage, setDuckImage] = useState(1)
  const counter = useRef(90)
  const gamePlaying = useRef(false)
  const duck = useRef()
  const background = useRef()
  let isLeft = false
  let isRight = false
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
        return
      }
      counter.current -= 1
      setDuckImage(val => val < 3 ? val + 1 : 1)
    }, 1000)
  }

  const resizeView = () => {
    setDuckPos(background.current.offsetLeft + 600 - 130 / 2)
  }

  const transTime = (val) => {
    const min = parseInt(val / 60)
    const sec = val % 60 > 9 ? val % 60 : `0${val % 60}`
    return `0${min}:${sec}`
  }

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setDuckPos(background.current.offsetLeft + 600 - 130 / 2)
      startCount()
      timer = setInterval(() => {
        if (!gamePlaying.current || counter.current === 0) return
        if (isLeft) {
          if (duck.current.offsetLeft <= background.current.offsetLeft + 121) return
          setDuckPos(pos => pos - 8)
        }
        if (isRight) {
          if (duck.current.offsetLeft >= background.current.offsetLeft + 1200 - 121 - 130) return
          setDuckPos(pos => pos + 8)
        }
      }, 15)
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
      <link rel="icon" href="/icon.png" />
      <main>
        <div className={'pool ' + (counter.current < 90 && counter.current >= 1 ? 'playing ' : '') + (counter.current < 1 ? 'end' : '')}>
          <img ref={duck} id="duck" src={`/images/duck_normal_${duckImage}.svg`} alt="img_duck" style={{ left: `${duckPos}px`, bottom: gamePlaying.current && counter.current <= 88 ? '160px' : '130px' }} draggable="false" />
          <div className="end-line"></div>
          <div ref={background} className={'page-bg ' + (!gamePlaying.current || counter.current === 0 ? 'stop' : '')}></div>
          <div className="start-line"></div>
        </div>
        <div className="counter" style={{ right: background.current ? `calc((100% - ${background.current.width}px) / 2` : 0 }}>
          <div className="counter-title">TIME</div>
          <div className="counter-number">{transTime(counter.current)}</div>
        </div>
      </main>
    </div>
  )
}

export default Home
