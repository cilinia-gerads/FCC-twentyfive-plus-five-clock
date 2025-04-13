import { useEffect, useRef, useState } from 'react'
import beep from './assets/beep-freecodecamp.wav'
import './App.css'

function App() {
  const [breakLength, setBreakLength] = useState(5)
  const [sessionLength, setSessionLength] = useState(25)
  const [play, setPlay] = useState(false)
  const [mode, setMode] = useState("SESSION")
  const [timeLeft, setTimeLeft] = useState(1500)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (play) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 0) {
            const audio = document.getElementById('beep')
            if (mode === "SESSION") {
              setMode("BREAK")
              audio.play()
              return breakLength * 60
            } else {
              setMode("SESSION")
              audio.pause()
              audio.currentTime = 0
              return sessionLength * 60
            }
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [play, mode, breakLength, sessionLength])

  const handlePlay = () => {
    setPlay(prev => !prev)
  }

  const handleReset = () => {
    clearInterval(intervalRef.current)
    setPlay(false)
    setBreakLength(5)
    setSessionLength(25)
    setTimeLeft(1500)
    setMode("SESSION")

    const audio = document.getElementById('beep')
    audio.pause()
    audio.currentTime = 0
  }

  const handleBreakDecrement = () => {
    if (breakLength > 1 && !play) setBreakLength(prev => prev - 1)
  }

  const handleBreakIncrement = () => {
    if (breakLength < 60 && !play) setBreakLength(prev => prev + 1)
  }

  const handleSessionDecrement = () => {
    if (sessionLength > 1 && !play) {
      setSessionLength(prev => prev - 1)
      setTimeLeft((sessionLength - 1) * 60)
    }
  }

  const handleSessionIncrement = () => {
    if (sessionLength < 60 && !play) {
      setSessionLength(prev => prev + 1)
      setTimeLeft((sessionLength + 1) * 60)
    }
  }

  const timeFormatter = () => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      <div className='wrapper'>
        <h1>25 + 5 Clock</h1>
        <div className='break-session-length'>
          <div>
            <h2 id="break-label">Break Length</h2>
            <div className='btn-break'>
              <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
              <div id="break-length">{breakLength}</div>
              <button id="break-increment" onClick={handleBreakIncrement}>+</button>
            </div>
          </div>
          <div>
            <h2 id="session-label">Session Length</h2>
            <div className='btn-session'>
              <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
              <div id="session-length">{sessionLength}</div>
              <button id="session-increment" onClick={handleSessionIncrement}>+</button>
            </div>
          </div>
        </div>

        <div className='timer'>
          <h2 id="timer-label">{mode === "SESSION" ? "Session" : "Break"}</h2>
          <div id="time-left">{timeFormatter()}</div>
          <div className='btn-timer'>
            <button id="start_stop" onClick={handlePlay}>start/stop</button>
            <button id="reset" onClick={handleReset}>reset</button>
          </div>
        </div>
      </div>
      <audio id="beep" preload="auto" src={beep}></audio>
    </>
  )
}

export default App

