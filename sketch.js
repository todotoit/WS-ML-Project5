const debug = true

let x = -100

const expressions = ['happy', 'sad', 'neutral', 'angry', 'surprised']
const FACTOR_MLT = 3
let exprLeft = ''
let exprRight = ''

let videoEl = null
const canvas = document.querySelector('#overlay')
let options
let interval
let steps

function startGame () {
  clearInterval(interval)
  x = 290
  steps = 0
  changeExpr()
  interval = setInterval(changeExpr, 1000 * 10)
  draw()
}

function changeExpr () {
  const cloned = JSON.parse(JSON.stringify(expressions))
  const pickLeft = parseInt(Math.random() * cloned.length)
  exprLeft = cloned[pickLeft]
  cloned.splice(pickLeft, 1)
  const pickRight = parseInt(Math.random() * cloned.length)
  exprRight = cloned[pickRight]
  document.querySelector('.left').innerHTML = exprLeft
  document.querySelector('.right').innerHTML = exprRight
  steps++
  if (steps > 6) {
    endGame()
  }
}

function endGame () {
  console.log('end game')
  document.querySelector('.left').innerHTML = ''
  document.querySelector('.right').innerHTML = ''
  clearInterval(interval)
}

async function draw () {
  const result = await faceapi.detectAllFaces(videoEl, options).withFaceExpressions()

  if (result) {
    const dims = faceapi.matchDimensions(canvas, videoEl, true)
    const resizedResult = faceapi.resizeResults(result, dims)

    if (debug) {
      const minConfidence = 0.05
      faceapi.draw.drawDetections(canvas, resizedResult)
      faceapi.draw.drawFaceExpressions(canvas, resizedResult, minConfidence)
    }

    result.forEach(f => {
      x -= f.expressions[exprLeft] * FACTOR_MLT
      x += f.expressions[exprRight] * FACTOR_MLT
      $('.ball').css('left', x + 'px')
    })
  }

  setTimeout(() => draw())
}

async function onReady () {
  options = getFaceDetectorOptions()
  await faceapi.detectAllFaces(videoEl, options).withFaceExpressions()
  console.log('Ready for real')
}

async function init () {
  await changeFaceDetector(TINY_FACE_DETECTOR)
  await faceapi.loadFaceExpressionModel('/')
  changeInputSize(224)

  const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
  videoEl = document.querySelector('#inputVideo')
  videoEl.srcObject = stream
}

init()

document.body.addEventListener('keypress', e => {
  if (e.code === 'Space') {
    startGame()
  }
})
