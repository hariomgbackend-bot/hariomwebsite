'use client'

import { useState, useEffect, useRef, useCallback, Fragment } from 'react'

var COLS = 32
var ROWS = 18
var CW = 640
var CH = 360
var CELL = CW / COLS   // 20px per cell
var TICK = 140
var STORAGE_KEY = 'hariom_snake_lb'

var FOOD_EMOJIS = ['📺', '📱', '💻', '🖥️', '🔊', '🎮', '🎧', '📷', '🖨️', '🔋', '⌚', '⌨️', '🖱️', '📡', '🔌', '🎙️']

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
  for (var i = 0; i < COLS; i++) {
    for (var j = 0; j < ROWS; j++) {
      if (!snake.some(function (s) { return s.x === i && s.y === j })) {
        free.push({ x: i, y: j })
      }
    }
  }
  if (free.length === 0) return null
  var pos = { ...free[Math.floor(Math.random() * free.length)] }
  pos.emoji = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]
  return pos
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

export default function SnakeGame() {
  var canvasRef = useRef(null)
  var [phase, setPhase] = useState('menu')
  var [score, setScore] = useState(0)
  var [leaderboard, setLeaderboard] = useState([])
  var stateRef = useRef(null)
  var tickRef = useRef(null)

  useEffect(function () { setLeaderboard(getLeaderboard()) }, [])

  // ── HiDPI canvas init ──────────────────────────────────────────────────────
  var initCanvas = useCallback(function () {
    var canvas = canvasRef.current
    if (!canvas) return null
    var dpr = window.devicePixelRatio || 1
    canvas.width = CW * dpr
    canvas.height = CH * dpr
    var ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    return ctx
  }, [])

  // ── Drawing helpers ────────────────────────────────────────────────────────
  var drawBackground = useCallback(function (ctx) {
    ctx.fillStyle = '#0B1F4B'
    ctx.fillRect(0, 0, CW, CH)
    ctx.fillStyle = 'rgba(255,255,255,0.035)'
    for (var x = 0; x < COLS; x++) {
      for (var y = 0; y < ROWS; y++) {
        ctx.beginPath()
        ctx.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }, [])

  var drawFrame = useCallback(function (ctx, s) {
    if (!ctx || !s) return
    drawBackground(ctx)

    s.snake.forEach(function (seg, i) {
      var px = seg.x * CELL, py = seg.y * CELL
      var isHead = i === 0
      ctx.fillStyle = isHead ? '#FF5E1A' : (i % 2 === 0 ? '#FF7A3D' : '#FF8C4A')
      var pad = isHead ? 1 : 2
      var rad = isHead ? 5 : 3
      roundRect(ctx, px + pad, py + pad, CELL - pad * 2, CELL - pad * 2, rad)
      ctx.fill()
      if (isHead) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.beginPath(); ctx.arc(px + 6, py + 6, 2, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(px + CELL - 6, py + 6, 2, 0, Math.PI * 2); ctx.fill()
      }
    })

    if (s.food) {
      var fx = Math.round(s.food.x * CELL + CELL / 2)
      var fy = Math.round(s.food.y * CELL + CELL / 2)
      ctx.save()
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.font = Math.round(CELL * 1.05) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.food.emoji, fx, fy + 1)
      ctx.restore()
    }
  }, [drawBackground])

  // ── Start game ────────────────────────────────────────────────────────────
  var startGame = useCallback(function () {
    var mx = Math.floor(COLS / 2), my = Math.floor(ROWS / 2)
    var snake = [{ x: mx, y: my }, { x: mx - 1, y: my }, { x: mx - 2, y: my }]
    stateRef.current = {
      snake: snake,
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: randomFood(snake),
      alive: true,
      score: 0,
    }
    setScore(0)
    setPhase('playing')
  }, [])

  // ── Game loop ─────────────────────────────────────────────────────────────
  useEffect(function () {
    if (phase !== 'playing') return
    var ctx = initCanvas()
    if (!ctx) return

    function tick() {
      var s = stateRef.current
      if (!s || !s.alive) return

      s.dir = s.nextDir
      var head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y }

      if (
        head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
        s.snake.some(function (seg) { return seg.x === head.x && seg.y === head.y })
      ) {
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

      drawFrame(ctx, s)
    }

    drawFrame(ctx, stateRef.current)
    tickRef.current = setInterval(tick, TICK)
    return function () { clearInterval(tickRef.current) }
  }, [phase, initCanvas, drawFrame])

  // ── Draw static bg on menu / gameover ────────────────────────────────────
  useEffect(function () {
    if (phase === 'playing') return
    var ctx = initCanvas()
    if (ctx) drawBackground(ctx)
  }, [phase, initCanvas, drawBackground])

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(function () {
    function handleKey(e) {
      if (phase === 'gameover' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault(); startGame(); return
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

  // ── Touch swipe ───────────────────────────────────────────────────────────
  useEffect(function () {
    if (phase !== 'playing') return
    var canvas = canvasRef.current
    if (!canvas) return
    var tx = 0, ty = 0

    function onStart(e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY }
    function onEnd(e) {
      var dx = e.changedTouches[0].clientX - tx
      var dy = e.changedTouches[0].clientY - ty
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return
      var key = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft')
        : (dy > 0 ? 'ArrowDown' : 'ArrowUp')
      var d = DIRECTIONS[key]
      if (!d || !stateRef.current) return
      var cur = stateRef.current.dir
      if (d.x === -cur.x && d.y === -cur.y) return
      stateRef.current.nextDir = d
    }

    canvas.addEventListener('touchstart', onStart, { passive: true })
    canvas.addEventListener('touchend', onEnd, { passive: true })
    return function () {
      canvas.removeEventListener('touchstart', onStart)
      canvas.removeEventListener('touchend', onEnd)
    }
  }, [phase])

  // ── Canvas element (shared across phases) ────────────────────────────────
  var canvasEl = (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      className="rounded-xl border-2 border-[#0B1F4B]"
    />
  )

  // ── MENU ──────────────────────────────────────────────────────────────────
  if (phase === 'menu') {
    return (
      <div className="flex flex-col items-center gap-4 py-6 w-full">
        <div className="flex items-center justify-between w-full max-w-[660px] px-1">
          <span className="text-xs font-bold text-[#FF5E1A] uppercase tracking-widest">Hariom Electronics</span>
          <span className="text-xs text-gray-400 font-medium">Best: {leaderboard.length ? leaderboard[0].score : 0}</span>
        </div>

        <div className="relative w-full max-w-[660px]">
          {canvasEl}
          <div className="absolute inset-0 bg-[#0B1F4B]/88 rounded-xl flex flex-col items-center justify-center gap-3">
            <div className="text-4xl font-extrabold text-[#FF5E1A] tracking-wider">SNAKE</div>
            <div className="text-sm text-white/55">Eat the electronics. Don't crash.</div>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-[#FF5E1A] text-white font-bold rounded-xl text-base hover:bg-[#e85518] transition-colors mt-1"
            >
              ▶ Play
            </button>
            {leaderboard.length > 0 && (
              <div className="w-full max-w-[280px] mt-1">
                <div className="text-[11px] font-bold text-white/40 uppercase tracking-widest text-center mb-2">Top Scores</div>
                {leaderboard.slice(0, 5).map(function (e, i) {
                  return (
                    <div key={i} className="grid grid-cols-[20px_1fr_auto] gap-2 px-2 py-1 rounded-lg text-sm" style={{ background: i === 0 ? 'rgba(255,94,26,0.18)' : 'transparent' }}>
                      <span className={i === 0 ? 'text-[#FF5E1A] font-bold' : 'text-white/40'}>{i + 1}</span>
                      <span className={i === 0 ? 'text-[#FF8C4A] font-bold' : 'text-white/80'}>{e.name}</span>
                      <span className="text-white font-bold">{e.score}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400">Arrow keys to move · swipe on mobile</p>
      </div>
    )
  }

  // ── GAME OVER ─────────────────────────────────────────────────────────────
  if (phase === 'gameover') {
    var isNewHigh = leaderboard.length > 0 && leaderboard[0].score === score && leaderboard.filter(function (e) { return e.score === score }).length === 1
    return (
      <div className="flex flex-col items-center gap-4 py-6 w-full">
        <div className="relative w-full max-w-[660px]">
          <div className="opacity-40">{canvasEl}</div>
          <div className="absolute inset-0 bg-[#0B1F4B]/88 rounded-xl flex flex-col items-center justify-center gap-3">
            <div className="text-2xl font-extrabold text-[#FF5E1A]">Game Over</div>
            {isNewHigh && <div className="text-sm font-bold text-yellow-400">🏆 New High Score!</div>}
            <div className="text-6xl font-extrabold text-white leading-none">{score}</div>
            <div className="flex gap-3 mt-1">
              <button onClick={startGame}
                className="px-6 py-2.5 bg-[#FF5E1A] text-white font-bold rounded-xl hover:bg-[#e85518] transition-colors text-sm">
                Play Again
              </button>
              <button onClick={function () { setPhase('menu'); setLeaderboard(getLeaderboard()) }}
                className="px-6 py-2.5 text-white font-bold rounded-xl text-sm border border-white/25 hover:border-white/60 transition-colors">
                Menu
              </button>
            </div>
            <div className="w-full max-w-[280px]">
              <div className="text-[11px] font-bold text-white/40 uppercase tracking-widest text-center mb-2">Leaderboard</div>
              {leaderboard.length === 0
                ? <p className="text-xs text-white/40 text-center">No scores yet</p>
                : (
                  <div className="grid grid-cols-[20px_1fr_auto] gap-x-2 text-sm">
                    {leaderboard.map(function (e, i) {
                      return (
                        <Fragment key={i}>
                          <div className={'py-0.5 ' + (i === 0 ? 'text-[#FF5E1A] font-bold' : 'text-white/40')}>{i + 1}</div>
                          <div className={'py-0.5 ' + (i === 0 ? 'text-[#FF8C4A] font-bold' : 'text-white/80')}>{e.name}</div>
                          <div className={'py-0.5 text-right font-bold ' + (i === 0 ? 'text-[#FF5E1A]' : 'text-white')}>{e.score}</div>
                        </Fragment>
                      )
                    })}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── PLAYING ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-2 py-4 w-full">
      <div className="flex items-center justify-between w-full max-w-[660px] px-1">
        <span className="text-sm font-bold text-[#0B1F4B]">Score: {score}</span>
        <span className="text-xs font-bold text-[#FF5E1A] uppercase tracking-widest">Hariom Electronics</span>
        <span className="text-xs text-gray-400 font-medium">Best: {leaderboard.length ? leaderboard[0].score : 0}</span>
      </div>
      <div className="w-full max-w-[660px]">{canvasEl}</div>
    </div>
  )
}
