// Elements

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

const menuElement = document.querySelector('#menu')
const backgroundElement = document.querySelector('#backgroundColorInput')
const particleColorElement = document.querySelector('#particleColorInput')
const lineColorElement = document.querySelector('#lineColorInput')
const particlesElement = document.querySelector('#particlesInput')
const distanceElement = document.querySelector('#distanceInput')
const radiusElement = document.querySelector('#radiusInput')
const xAccelerationElement = document.querySelector('#xAccelerationInput')
const yAccelerationElement = document.querySelector('#yAccelerationInput')

particleColorElement.value = 'green'
lineColorElement.value = 'rgba(0,0,0,.1)'
backgroundElement.value = 'white'
particlesElement.value = 200
distanceElement.value = 100
radiusElement.value = 5
xAccelerationElement.value = 1
yAccelerationElement.value = 0.98

// Constants and Variables

const width = window.innerWidth
const height = window.innerHeight
let circles = []
let newCircles = []
let numberOfCircles = particlesElement.value
let acceleration = xAccelerationElement.value
let gAcceleration = yAccelerationElement.value * 2
let circleColor = particleColorElement.value
let lineColor = lineColorElement.value
let backgroundColor = backgroundElement.value
let maxPoint
let minPoint
let maxDistance = distanceElement.value
let maxRadius = radiusElement.value
let isPaused = false

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

function setupWindow() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  maxPoint = makePoint(window.innerWidth, window.innerHeight)
  minPoint = makePoint(0, 0)
}

function reset() {
  isPaused = true
  drawRect({ point1: minPoint, point2: maxPoint, color: backgroundColor })
  circles = []
  isPaused = false
}

function setup() {
  reset()

  for (let i = 0; i < numberOfCircles; ++i) {
    circles.push(createCircle({ radius: maxRadius, point: maxPoint, color: circleColor, id: i }))
  }
}

function draw() {
  if (isPaused) return requestAnimationFrame(draw)
  newCircles = moveCircles([...circles])

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
setupWindow()
setup()
drawRect({ point1: minPoint, point2: maxPoint, color: backgroundColor })
let animationRequest = requestAnimationFrame(draw)

// Event Listeners and UI

window.addEventListener('keyup', (e) => {
  if (e.key === 'm') {
    menuElement.classList.toggle('active')
  }
  if (e.key === 'p') {
    isPaused = !isPaused
  }

  if (e.key === 'r') {
    drawRect({ point1: minPoint, point2: maxPoint, color: backgroundColor })
  }
})

$(backgroundElement).spectrum({
  type: 'component',
  showAlpha: true,
  change: (color) => {
    backgroundColor = color.toRgbString()
    drawRect({ point1: minPoint, point2: maxPoint, color: backgroundColor })
  },
})

$(particleColorElement).spectrum({
  type: 'component',
  showAlpha: true,
  change: (color) => {
    circleColor = color.toRgbString()
    for (let i = 0; i < newCircles.length; ++i) {
      newCircles[i].color = color.toRgbString()
    }
  },
})

$(lineColorElement).spectrum({
  type: 'component',
  showAlpha: true,
  change: (color) => {
    lineColor = color.toRgbString()
  },
})

particlesElement.addEventListener('change', (e) => {
  numberOfCircles = Number(e.target.value)
  setup()
})

distanceElement.addEventListener('change', (e) => {
  maxDistance = Number(e.target.value)
  setup()
})

radiusElement.addEventListener('change', (e) => {
  maxRadius = Number(e.target.value)
  setup()
})

xAccelerationElement.addEventListener('change', (e) => {
  acceleration = Number(e.target.value)
  setup()
})

yAccelerationElement.addEventListener('change', (e) => {
  gAcceleration = Number(e.target.value)
  setup()
})

window.addEventListener('resize', (e) => {
  setupWindow()
  setup()
})
