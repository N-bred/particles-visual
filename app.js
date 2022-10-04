// Elements

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

// Constants and Variables

const width = Number(canvas.dataset.width)
const height = Number(canvas.dataset.height)
const circles = []
const numberOfCircles = 200
const acceleration = 1
const gAcceleration = 0.98 * 2
const possibleColors = ['rgba(83,0,162,1)', 'green']

let circleColor = 'rgba(255,255,255,.5)'
let lineColor = 'rgba(0,0,0,.1)'
let backgroundColor = 'white'
let maxPoint
let minPoint
let maxDistance = 100
let maxRadius = 5

// Auxiliary Functions

function distanceBetweenPoints(point1, point2) {
  return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2)
}

function makePoint(x, y) {
  return { x, y }
}

// Functions

function clear() {
  ctx.clearRect(0, 0, width, height)
}

function drawRect(props) {
  const { point1, point2, color } = props
  ctx.fillStyle = color
  ctx.fillRect(point1.x, point1.y, point2.x, point2.y)
}

function drawCircle(props) {
  const { x, y, r, color } = props
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fill()
}

function drawLine(props) {
  const { point1, point2, color } = props
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.moveTo(point1.x, point1.y)
  ctx.lineTo(point2.x, point2.y)
  ctx.stroke()
}

function createCircle(props) {
  const { radius, point, color, id } = props
  const r = Math.floor(Math.random() * radius)
  const x = Math.floor(Math.random() * point.x)
  const y = Math.floor(Math.random() * point.y)
  const vx = acceleration * r
  const vy = gAcceleration
  return { x, y, r, vx, vy, color, id }
}

function moveCircle(circle, maxPoint) {
  const { x, y, vx, vy, r } = circle
  let newVx = vx
  let newVy = vy

  if (x >= maxPoint.x - r) {
    newVx = -vx
  } else if (x <= 0 + r) {
    newVx = Math.abs(vx)
  }

  if (y >= maxPoint.y - r) {
    newVy = -vy
  } else if (y <= 0 + r) {
    newVy = Math.abs(vy)
  }

  let newX = x + newVx
  let newY = y + newVy

  return { newX, newY, newVx, newVy }
}

function moveCircles(circles) {
  const newCircles = [...circles]
  for (let circle of newCircles) {
    const newCircle = moveCircle(circle, maxPoint)
    circle.x = newCircle.newX
    circle.y = newCircle.newY
    circle.vx = newCircle.newVx
    circle.vy = newCircle.newVy
  }
  return newCircles
}

function setup() {
  canvas.width = width
  canvas.height = height
  maxPoint = makePoint(width, height)
  minPoint = makePoint(0, 0)

  for (let i = 0; i < numberOfCircles; ++i) {
    circles.push(createCircle({ radius: maxRadius, point: maxPoint, color: circleColor, id: i }))
  }
}

function draw() {
  //   clear()
  //   drawRect({ point1: minPoint, point2: maxPoint, color: backgroundColor })

  const newCircles = moveCircles([...circles])

  for (let circle of newCircles) {
    drawCircle(circle)
  }

  for (let circle of newCircles) {
    const point1 = makePoint(circle.x, circle.y)
    for (let otherCircle of newCircles) {
      const point2 = makePoint(otherCircle.x, otherCircle.y)
      const distance = distanceBetweenPoints(point1, point2)
      if (distance === 0) continue

      if (distance <= maxDistance) {
        drawLine({ point1, point2, color: lineColor })
      }
    }
  }

  requestAnimationFrame(draw)
}

// Function calls
setup()
drawRect({ point1: minPoint, point2: maxPoint, color: backgroundColor })

requestAnimationFrame(draw)
