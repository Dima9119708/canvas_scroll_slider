const data = [
    { date: '12-09-2022', result: 7000 },
    { date: '14-09-2022', result: 6800 },
    { date: '15-09-2022', result: 6000 },
    { date: '15-09-2022', result: 10 },
    { date: '15-09-2022', result: 6000 },
    { date: '15-09-2022', result: 50000 },
    { date: '15-09-2022', result: 6800 },
    { date: '15-09-2022', result: 6500 },
    { date: '15-09-2022', result: 70000 },
    { date: '15-09-2022', result: 70000 },
    { date: '15-09-2022', result: 70000 },
    { date: '15-09-2022', result: 70000 },
    { date: '15-09-2022', result: 70000 },
    { date: '15-09-2022', result: 70000 },
    { date: '16-09-2022', result: 40000 },
    { date: '16-09-2022', result: 40000 },
    { date: '16-09-2022', result: 40000 },
    { date: '16-09-2022', result: 40000 },
    { date: '16-09-2022', result: 40000 },
    { date: '16-09-2022', result: 40000 },
    { date: '16-09-2022', result: 40000 },
    { date: '16-09-2022', result: 40000 },
    { date: '16-09-2022', result: 70000 },
]

const AXIS_Y_WIDTH = 50
const ARROW_RIGHT = 50

const init = (args) => {
    const {
        dpi = 1,
        data = [],
        height = 0,
        padding = { left: 0, right: 0, top: 0, bottom: 0 },
        domElement = null,
        viewElements = 0,
        keyX,
        keyY,
    } = args

    const WIDTH = parseInt(window.getComputedStyle(domElement.parentElement).width) - AXIS_Y_WIDTH - ARROW_RIGHT

    const PADDING = {
        top: padding.top * dpi,
        bottom: padding.bottom * dpi,
        left: padding.left * dpi,
        right: padding.right * dpi,
    }
    const DPI_HEIGHT = height * dpi
    const DPI_WIDTH = WIDTH * dpi
    const DISTANCE = DPI_WIDTH / viewElements
    const FULL_WIDTH = DISTANCE * (data.length - 1) + PADDING.right + PADDING.left

    const collectionValueByKey = (data, key) => data.map(element => element[key])
    const maxYValue = Math.max(...collectionValueByKey(data, keyY))
    const yRatio = DPI_HEIGHT / maxYValue
    const prepareData = data.map((element, idx) => ({
        x: (DISTANCE * idx) + PADDING.left,
        y: element[keyY],
        dataX: element[keyX]
    }))

    const $canvas = domElement.querySelector('canvas')
    const $axisX = domElement.querySelector('.axis_x')
    const $axisY = domElement.querySelector('.axis_y')

    $axisY.style.height = height + 'px'
    $axisY.style.paddingTop = padding.top + 'px'
    $axisY.style.paddingBottom = padding.bottom + 'px'

    $canvas.style.height = height + 'px'
    $canvas.style.width = WIDTH + 'px'

    $canvas.height = DPI_HEIGHT
    $canvas.width = DPI_WIDTH

    const ctx = $canvas.getContext('2d')

    return {
        ctx,
        DPI: dpi,
        HEIGHT: height,
        WIDTH,
        PADDING,
        $canvas,
        $axisX,
        DPI_HEIGHT,
        DPI_WIDTH,
        VIEW_ELEMENTS: viewElements,
        DISTANCE,
        FULL_WIDTH,
        DATA: prepareData,
        yRatio,
    }
}

const {
    ctx,
    DPI,
    HEIGHT,
    WIDTH,
    DATA,
    PADDING,
    $canvas,
    $axisX,
    yRatio,
    DPI_HEIGHT,
    DPI_WIDTH,
    FULL_WIDTH
} = init({
    dpi: 1 ,
    data,
    height: 265,
    padding: { left: 56, right: 56, top: 5, bottom: 5 },
    domElement: document.querySelector('#chart'),
    viewElements: 13,
    keyX: 'date',
    keyY: 'result'
})

$canvas.addEventListener('mousedown', translateX)
$axisX.addEventListener('mousedown', translateX)

const CAMERA = {
  x: 0,
}

function translateX(elementEvent) {
    $canvas.style.cursor = 'grabbing'
    $axisX.style.cursor = 'grabbing'
    document.addEventListener('mouseup', mouseUp)
    document.addEventListener('mousemove', mouseMove)

    const prevX = CAMERA.x

    function mouseMove(documentEvent) {
        const deltaX = elementEvent.clientX - documentEvent.clientX

        if (deltaX > 0) {
            CAMERA.x = prevX + deltaX
        } else {
            CAMERA.x = prevX + deltaX
        }

        if (CAMERA.x + DPI_WIDTH > FULL_WIDTH) {
            CAMERA.x = FULL_WIDTH - DPI_WIDTH
        }

        if (CAMERA.x + DPI_WIDTH < DPI_WIDTH) {
            CAMERA.x = 0
        }
    }

    function mouseUp() {
        $canvas.style.cursor = 'default'
        $axisX.style.cursor = 'default'
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
    }
}

const calcYValue = (value) => DPI_HEIGHT - value * yRatio

const calcY = (value) => {
    const result = calcYValue(value)
    const percent = (result / DPI_HEIGHT) * 100

    if (percent > 90) return result - PADDING.bottom
    if (percent < 10) return result + PADDING.top

    return result
}

function render() {
    ctx.clearRect(0, 0, FULL_WIDTH, DPI_HEIGHT)

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(-CAMERA.x, 0);
    $axisX.style.transform = `translateX(-${CAMERA.x}px)`

    const [first] = DATA

    ctx.beginPath()
    ctx.moveTo(first.x, calcY(first.y))

    for (let idx = 1; idx < DATA.length; idx++) {
      ctx.lineTo(DATA[idx].x, calcY(DATA[idx].y))
        ctx.fillStyle = "green";
        ctx.fillRect(DATA[idx].x, calcY(DATA[idx].y), 10, 10);
    }

    ctx.lineWidth = 4;
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#5CBA7C';
    ctx.stroke()

    requestAnimationFrame(render)
}

requestAnimationFrame(render)

