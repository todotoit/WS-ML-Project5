const SSD_MOBILENETV1 = 'ssd_mobilenetv1'
const TINY_FACE_DETECTOR = 'tiny_face_detector'
const MTCNN = 'mtcnn'

let selectedFaceDetector = SSD_MOBILENETV1

// ssd_mobilenetv1 options
const minConfidence = 0.5

// tiny_face_detector options
const inputSize = 512
const scoreThreshold = 0.5

// mtcnn options
const minFaceSize = 20

function getFaceDetectorOptions () {
  return selectedFaceDetector === SSD_MOBILENETV1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : (
      selectedFaceDetector === TINY_FACE_DETECTOR
        ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
        : new faceapi.MtcnnOptions({ minFaceSize })
    )
}

function getCurrentFaceDetectionNet () {
  if (selectedFaceDetector === SSD_MOBILENETV1) {
    return faceapi.nets.ssdMobilenetv1
  }
  if (selectedFaceDetector === TINY_FACE_DETECTOR) {
    return faceapi.nets.tinyFaceDetector
  }
  if (selectedFaceDetector === MTCNN) {
    return faceapi.nets.mtcnn
  }
}

function isFaceDetectionModelLoaded () {
  return !!getCurrentFaceDetectionNet().params
}

async function changeFaceDetector (detector) {
  selectedFaceDetector = detector

  if (!isFaceDetectionModelLoaded()) {
    await getCurrentFaceDetectionNet().load('/')
  }
}

async function onSelectedFaceDetectorChanged (e) {
  selectedFaceDetector = e.target.value

  await changeFaceDetector(e.target.value)
  updateResults()
}
