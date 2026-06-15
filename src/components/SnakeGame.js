'use client'

import { useState, useEffect, useRef, useCallback, Fragment } from 'react'

var GRID = 20
var CELL = 18
var CANVAS = GRID * CELL
var TICK = 150
var STORAGE_KEY = 'hariom_snake_lb'

var FOOD_EMOJIS = ['📺', '📱', '💻', '🖥️', '🧺', '🔊', '🎮', '🎧', '📷', '🖨️', '🌀', '🔋', '⌚', '⌨️', '🖱️', '🎙️']

var NAMES = [
  'TechNinja', 'CircuitPro', 'ByteMaster', 'PixelWizard', 'GigaChad',
  'ElectroKing', 'VoltViper', 'NanoFlex', 'CyberAce', 'DigiRacer',
  'LogicLord', 'ChipWhiz', 'DataDuke', 'QuBit', 'ZenByte',
  'TurboCore', 'FluxHero', 'SparkRider', 'WattWave', 'EchoBit',
  'MegaNode', 'HexaFuse', 'PlasmaJet', 'OhmRunner', 'SyncWave',
]

var DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
}

function getLeaderboard() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) { return [] }
}

function saveLeaderboard(board) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(board.slice(0, 10))) } catch (e) {}
}

function getRandomName() {
  return NAMES[Math.floor(Math.random() * NAMES.length)]
}

function randomFood(snake) {
  var free = []
  for (var i = 0; i < GRID; i++) {
    for (var j = 0; j < GRID; j++) {
      if (!snake.some(function (s) { return s.x === i && s.y === j })) {
        free.push({ x: i, y: j })
      }
    }
  }
  if (free.length === 0) return null
  var pos = free[Math.floor(Math.random() * free.length)]
  pos.emoji = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]
  return pos
}

export default function SnakeGame() {
  var canvasRef = useRef(null)
  var [phase, setPhase] = useState('menu')
  var [score, setScore] = useState(0)
  var [leaderboard, setLeaderboard] = useState([])
  var stateRef = useRef(null)
  var tickRef = useRef(null)

  useEffect(function () { setLeaderboard(getLeaderboard()) }, [])

  var startGame = useCallback(function () {
    var mid = Math.floor(GRID / 2)
    var snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }]
    stateRef.current = { snake: snake, dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, food: randomFood(snake), alive: true, score: 0 }
    setScore(0)
    setPhase('playing')
  }, [])

  useEffect(function () {
    if (phase !== 'playing') return
    var canvas = canvasRef.current
    if (!canvas) return
    var ctx = canvas.getContext('2d')

    function drawBackground() {
      ctx.fillStyle = '#0B1F4B'
      ctx.fillRect(0, 0, CANVAS, CANVAS)
      ctx.strokeStyle = '#1a3366'
      ctx.lineWidth = 0.5
      for (var x = 0; x < GRID; x++) {
        for (var y = 0; y < GRID; y++) {
          if (Math.random() > 0.7) {
            ctx.beginPath()
            ctx.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, 1.5, 0, Math.PI * 2)
            ctx.stroke()
          }
        }
      }
    }

    function tick() {
      var s = stateRef.current
      if (!s || !s.alive) return

      s.dir = s.nextDir
      var head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y }

      if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
          s.snake.some(function (seg) { return seg.x === head.x && seg.y === head.y })) {
        s.alive = false
        var finalScore = s.score
        var lb = getLeaderboard()
        lb.push({ name: getRandomName(), score: finalScore, date: new Date().toISOString().slice(0, 10) })
        lb.sort(function (a, b) { return b.score - a.score })
        saveLeaderboard(lb)
        setLeaderboard(lb)
        setScore(finalScore)
        setPhase('gameover')
        return
      }

      s.snake.unshift(head)

      if (s.food && head.x === s.food.x && head.y === s.food.y) {
        s.score += 10
        setScore(s.score)
        s.food = randomFood(s.snake)
      } else {
        s.snake.pop()
      }

      drawBackground()

      s.snake.forEach(function (seg, i) {
        ctx.fillStyle = i === 0 ? '#FF5E1A' : '#FF8C4A'
        var pad = i === 0 ? 1 : 2
        ctx.fillRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2)

        if (i === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.4)'
          ctx.fillRect(seg.x * CELL + 4, seg.y * CELL + 4, 3, 3)
          ctx.fillRect(seg.x * CELL + CELL - 7, seg.y * CELL + CELL - 7, 3, 3)
        }
      })

      if (s.food) {
        ctx.font = '14px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(s.food.emoji, s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2 + 1)
      }
    }

    drawBackground()
    tickRef.current = setInterval(tick, TICK)
    return function () { clearInterval(tickRef.current) }
  }, [phase])

  useEffect(function () {
    function handleKey(e) {
      if (phase === 'gameover' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        startGame()
        return
      }
      if (phase !== 'playing' || !stateRef.current || !stateRef.current.alive) return
      var d = DIRECTIONS[e.key]
      if (!d) return
      var cur = stateRef.current.dir
      if (d.x === -cur.x && d.y === -cur.y) return
      stateRef.current.nextDir = d
      e.preventDefault()
    }

    window.addEventListener('keydown', handleKey)
    return function () { window.removeEventListener('keydown', handleKey) }
  }, [phase, startGame])

  if (phase === 'menu') {
    return (
      <div className="flex flex-col items-center gap-5 py-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-[#FF5E1A] tracking-wider">SNAKE</div>
          <div className="text-sm text-[#0B1F4B] font-semibold mt-1">Hariom Electronics</div>
        </div>

        <canvas ref={canvasRef} width={CANVAS} height={CANVAS}
          className="rounded-xl shadow-md border-2 border-[#0B1F4B] max-w-full" />

        <button onClick={startGame}
          className="px-8 py-3 bg-[#FF5E1A] text-white font-bold rounded-xl text-lg hover:bg-[#e85518] transition-colors shadow-lg">
          Play Snake
        </button>

        {leaderboard.length > 0 && (
          <div className="w-full max-w-[360px]">
            <div className="text-sm font-bold text-[#0B1F4B] mb-2 text-center">High Scores</div>
            {leaderboard.slice(0, 5).map(function (e, i) {
              return (
                <div key={i} className="flex justify-between text-sm px-2 py-1 border-b border-gray-100">
                  <span className={i === 0 ? 'text-[#FF5E1A] font-bold' : 'text-gray-700'}>
                    {i + 1}. {e.name}
                  </span>
                  <span className="font-semibold text-[#0B1F4B]">{e.score}</span>
                </div>
              )
            })}
          </div>
        )}

        <p className="text-xs text-gray-500">Use arrow keys to move</p>
      </div>
    )
  }

  if (phase === 'gameover') {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="text-center">
          <div className="text-xl font-bold text-[#FF5E1A]">Game Over!</div>
          <div className="text-3xl font-bold text-[#0B1F4B] mt-1">{score}</div>
        </div>

        <canvas ref={canvasRef} width={CANVAS} height={CANVAS}
          className="rounded-xl shadow-md border-2 border-[#0B1F4B] max-w-full opacity-60" />

        <div className="flex gap-3">
          <button onClick={startGame}
            className="px-6 py-2.5 bg-[#FF5E1A] text-white font-bold rounded-xl hover:bg-[#e85518] transition-colors shadow-md">
            Play Again
          </button>
          <button onClick={function () { setPhase('menu'); setLeaderboard(getLeaderboard()) }}
            className="px-6 py-2.5 bg-[#0B1F4B] text-white font-bold rounded-xl hover:bg-[#122b63] transition-colors shadow-md">
            Menu
          </button>
        </div>

        <div className="w-full max-w-[360px]">
          <div className="text-sm font-bold text-[#0B1F4B] mb-2 text-center">Top 10</div>
          {leaderboard.length === 0 ? (
            <p className="text-xs text-gray-500 text-center">No scores yet</p>
          ) : (
            <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 text-sm">
              <div className="font-bold text-gray-400 text-xs pb-1">#</div>
              <div className="font-bold text-gray-400 text-xs pb-1">Name</div>
              <div className="font-bold text-gray-400 text-xs pb-1 text-right">Score</div>
              {leaderboard.map(function (e, i) {
                return (
                  <Fragment key={i}>
                    <div className={'py-0.5 ' + (i === 0 ? 'text-[#FF5E1A] font-bold' : 'text-gray-500')}>{i + 1}</div>
                    <div className={'py-0.5 ' + (i === 0 ? 'text-[#FF5E1A] font-bold' : 'text-gray-700')}>{e.name}</div>
                    <div className={'py-0.5 text-right ' + (i === 0 ? 'text-[#FF5E1A] font-bold' : 'text-[#0B1F4B] font-semibold')}>{e.score}</div>
                  </Fragment>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="flex items-center justify-between w-full max-w-[360px]">
        <span className="text-sm font-bold text-[#0B1F4B]">Score: {score}</span>
      </div>
      <canvas ref={canvasRef} width={CANVAS} height={CANVAS}
        className="rounded-xl shadow-md border-2 border-[#0B1F4B] max-w-full" />
    </div>
  )
}
