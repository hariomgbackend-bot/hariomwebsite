'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

var GRID = 20
var CELL = 18
var CANVAS = GRID * CELL
var TICK = 150

var DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
}

function randomApple(snake) {
  var free = []
  for (var i = 0; i < GRID; i++) {
    for (var j = 0; j < GRID; j++) {
      if (!snake.some(function (s) { return s.x === i && s.y === j })) {
        free.push({ x: i, y: j })
      }
    }
  }
  if (free.length === 0) return null
  return free[Math.floor(Math.random() * free.length)]
}

export default function SnakeGame() {
  var canvasRef = useRef(null)
  var [score, setScore] = useState(0)
  var [gameOver, setGameOver] = useState(false)
  var [playing, setPlaying] = useState(false)
  var stateRef = useRef({ snake: [], dir: { x: 1, y: 0 }, apple: null, nextDir: { x: 1, y: 0 }, alive: true, score: 0 })
  var tickRef = useRef(null)

  var startGame = useCallback(function () {
    var mid = Math.floor(GRID / 2)
    var snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }]
    stateRef.current = { snake: snake, dir: { x: 1, y: 0 }, apple: randomApple(snake), nextDir: { x: 1, y: 0 }, alive: true, score: 0 }
    setScore(0)
    setGameOver(false)
    setPlaying(true)
  }, [])

  useEffect(function () {
    startGame()
    var canvas = canvasRef.current
    if (!canvas) return
    var ctx = canvas.getContext('2d')

    function draw() {
      var s = stateRef.current
      ctx.clearRect(0, 0, CANVAS, CANVAS)

      ctx.fillStyle = '#0B1F4B'
      ctx.fillRect(0, 0, CANVAS, CANVAS)

      for (var x = 0; x < GRID; x++) {
        for (var y = 0; y < GRID; y++) {
          ctx.fillStyle = '#132a5e'
          ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2)
        }
      }

      s.snake.forEach(function (seg, i) {
        ctx.fillStyle = i === 0 ? '#FF5E1A' : '#FF8C4A'
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2)
      })

      if (s.apple) {
        ctx.fillStyle = '#FFD700'
        ctx.beginPath()
        ctx.arc(s.apple.x * CELL + CELL / 2, s.apple.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function tick() {
      var s = stateRef.current
      if (!s.alive) return

      s.dir = s.nextDir

      var head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y }

      if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
          s.snake.some(function (seg) { return seg.x === head.x && seg.y === head.y })) {
        s.alive = false
        setGameOver(true)
        setPlaying(false)
        draw()
        return
      }

      s.snake.unshift(head)

      if (s.apple && head.x === s.apple.x && head.y === s.apple.y) {
        s.score += 10
        setScore(s.score)
        s.apple = randomApple(s.snake)
      } else {
        s.snake.pop()
      }

      draw()
    }

    draw()
    tickRef.current = setInterval(tick, TICK)

    return function () { clearInterval(tickRef.current) }
  }, [startGame])

  useEffect(function () {
    function handleKey(e) {
      if (!playing && gameOver && (e.key === 'Enter' || e.key === ' ')) {
        startGame()
        return
      }

      if (!stateRef.current.alive) return

      var d = DIRECTIONS[e.key]
      if (!d) return

      var cur = stateRef.current.dir
      if (d.x === -cur.x && d.y === -cur.y) return

      stateRef.current.nextDir = d
      e.preventDefault()
    }

    window.addEventListener('keydown', handleKey)
    return function () { window.removeEventListener('keydown', handleKey) }
  }, [playing, gameOver, startGame])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-between w-full max-w-[360px]">
        <span className="text-sm font-bold text-[#0B1F4B]">Score: {score}</span>
        {gameOver && (
          <span className="text-sm font-bold text-[#FF5E1A]">Game Over!</span>
        )}
        {!playing && gameOver && (
          <span className="text-xs text-gray-500">Press Enter or Space to restart</span>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS}
        height={CANVAS}
        className="rounded-xl shadow-md border-2 border-[#0B1F4B]"
      />
      <p className="text-xs text-gray-500">Use arrow keys to move</p>
    </div>
  )
}
