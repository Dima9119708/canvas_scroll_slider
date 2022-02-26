const DATA = [
    { date: '12-09-2022', result: 7000 },
    { date: '14-09-2022', result: 6800 },
    { date: '15-09-2022', result: 6000 },
    { date: '15-09-2022', result: 10 },
    { date: '15-09-2022', result: 6000 },
    { date: '15-09-2022', result: 50000 },
    { date: '15-09-2022', result: 6800 },
    { date: '15-09-2022', result: 6500 },
    { date: '15-09-2022', result: 70000 },
    { date: '16-09-2022', result: 40000 }
]

const DPI = 1.5
const HEIGHT = 300
const WIDTH = 600
const DPI_HEIGHT = HEIGHT * DPI
const DPI_WIDTH = WIDTH * DPI
const MAX_X_VALUE = 3000
const FULL_WIDTH = DPI_WIDTH + MAX_X_VALUE

const $canvas = document.querySelector('canvas')

$canvas.style.height = HEIGHT + 'px'
$canvas.style.width = WIDTH + 'px'
$canvas.style.border = '1px solid black'
$canvas.style.cursor = 'grabbing'

$canvas.height = DPI_HEIGHT
$canvas.width = DPI_WIDTH

const ctx = $canvas.getContext('2d')

$canvas.addEventListener('mousedown', mouseDown)

const CAMERA = {
  x: 0,
}

function mouseDown(canvasEvent) {
    document.addEventListener('mouseup', mouseUp)
    document.addEventListener('mousemove', mouseMove)

    const prevX = CAMERA.x

    function mouseMove(documentEvent) {
        const deltaX = canvasEvent.clientX - documentEvent.clientX

        if (deltaX > 0) {
            CAMERA.x = prevX + deltaX
        } else {
            CAMERA.x = prevX + deltaX
        }

        if (CAMERA.x + DPI_WIDTH > MAX_X_VALUE) {
            CAMERA.x = MAX_X_VALUE - DPI_WIDTH
        }

        if (CAMERA.x + DPI_WIDTH < DPI_WIDTH) {
            CAMERA.x = 0
        }
    }

    function mouseUp() {
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
    }
}

function render() {
    ctx.clearRect(0, 0, FULL_WIDTH, DPI_HEIGHT)

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(-CAMERA.x, 0);

    ctx.beginPath()
    ctx.moveTo( 5, DPI_HEIGHT - 6)
    ctx.lineTo(100, DPI_HEIGHT - 200)
    ctx.lineTo(150, DPI_HEIGHT - 150)
    ctx.lineTo(200, DPI_HEIGHT - 150)
    ctx.lineTo(300, DPI_HEIGHT - 160)
    ctx.lineTo(400, DPI_HEIGHT - 170)
    ctx.lineTo(500, DPI_HEIGHT - 110)
    ctx.lineTo(600, DPI_HEIGHT - 190)
    ctx.lineTo(700, DPI_HEIGHT - 170)
    ctx.lineTo(800, DPI_HEIGHT - 170)
    ctx.lineTo(900, DPI_HEIGHT - 280)
    ctx.lineTo(1000, DPI_HEIGHT - 300)
    ctx.lineTo(1200, DPI_HEIGHT - 200)
    ctx.lineTo(1400, DPI_HEIGHT - 100)
    ctx.lineTo(1500, DPI_HEIGHT - 200)
    ctx.lineTo(1600, DPI_HEIGHT - 100)
    ctx.lineTo(1700, DPI_HEIGHT - 300)
    ctx.lineTo(1800, DPI_HEIGHT - 175)
    ctx.lineTo(1900, DPI_HEIGHT - 175)
    ctx.lineTo(2500, DPI_HEIGHT - 175)
    ctx.lineTo(2600, DPI_HEIGHT - 180)
    ctx.lineTo(2700, DPI_HEIGHT - 162)
    ctx.lineTo(2800, DPI_HEIGHT - 174)
    ctx.lineTo(2900, DPI_HEIGHT - 130)
    ctx.lineTo(3000, DPI_HEIGHT - 190)
    ctx.stroke()

    requestAnimationFrame(render)
}

requestAnimationFrame(render)

