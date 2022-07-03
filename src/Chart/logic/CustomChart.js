import collectionValueByKey from "./utils/collectionValueByKey";
import css from "./utils/css";

class Camera {
  constructor(RETINA_WIDTH, FULL_WIDTH) {
    this.x = 0
    this.RETINA_WIDTH = RETINA_WIDTH;
    this.FULL_WIDTH = FULL_WIDTH;
  }

  get getX() {
    return this.x
  }

  init = (elementEvent) => {
    const prevX = this.x;

    const mouseMove = (documentEvent) => {
      const deltaX = elementEvent.clientX - documentEvent.clientX;

      if (deltaX > 0) this.x = prevX + deltaX;
      else this.x = prevX + deltaX;

      if (this.x + this.RETINA_WIDTH > this.FULL_WIDTH) {
        this.x = this.FULL_WIDTH - this.RETINA_WIDTH;
      }

      if (this.x + this.RETINA_WIDTH < this.RETINA_WIDTH) {
        this.x = 0;
      }
    };

    const mouseUp = () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };

    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mousemove", mouseMove);
  };
}

class Chart {
  rfa = null;

  constructor(options) {
    this.options = options;
  }

  calcByChart({ retina, data, height, padding, paddingLeft, domElement, viewElements, keyX, keyY, }) {
    this.WIDTH = parseInt(window.getComputedStyle(domElement.parentElement).width)
    this.PADDING = padding * retina;
    this.PADDING_LEFT = paddingLeft * retina;
    this.RETINA_HEIGHT = height * retina;
    this.RETINA_WIDTH = this.WIDTH * retina;
    this.VIEW_HEIGHT = this.RETINA_HEIGHT - this.PADDING - this.PADDING_LEFT
    this.DISTANCE = this.RETINA_WIDTH / viewElements;
    this.FULL_WIDTH = this.DISTANCE * (data.length - 1) + paddingLeft
    const maxYValue = Math.max(...collectionValueByKey(data, keyY));
    this.yRatio = this.VIEW_HEIGHT / maxYValue;
  }

  prepareData({ data, keyY, keyX  }) {
    this.DATA = data.map((element, idx) => {
      if (idx === 0) {
        return ({
          x: this.DISTANCE * idx + this.PADDING_LEFT,
          y: element[keyY],
          dataX: element[keyX],
        })
      }

      return ({
        x: this.DISTANCE * idx,
        y: element[keyY],
        dataX: element[keyX],
      })
    });
  }

  initCanvas({ domElement }) {
    const $canvas = domElement.querySelector("canvas");
    $canvas.height = this.RETINA_HEIGHT;
    $canvas.width = this.RETINA_WIDTH;

    css($canvas, {
      border: '1px solid'
    });

    this.$canvas = $canvas
    this.ctx = $canvas.getContext("2d");
  }

  init() {
    this.rfa = requestAnimationFrame(this.render);

    this.calcByChart(this.options)
    this.prepareData(this.options)
    this.initCanvas(this.options)

    this.camera = new Camera(this.RETINA_WIDTH, this.FULL_WIDTH)
    this.$canvas.addEventListener('mousedown', this.camera.init)

    this.options.getDistance(this.DISTANCE)
  }

  canvasTranslate() {
    this.ctx.translate(-this.camera.getX, 0)
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.FULL_WIDTH, this.RETINA_HEIGHT);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  // reInit(options = {}) {
  //   cancelAnimationFrame(this.rfa);
  //   this.clearCanvas();
  //
  //   new Chart(Object.assign(this.options, options));
  // }

  drawLine() {
    this.ctx.beginPath();
    for (const { x, y } of this.DATA) {
      this.ctx.lineTo(x, this.RETINA_HEIGHT - this.PADDING - y * this.yRatio);
    }
    this.ctx.lineWidth = 4;
    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = "#5CBA7C";
    this.ctx.stroke();
  }

  render = () => {
    this.clearCanvas()

    this.canvasTranslate()
    this.drawLine()

    this.rfa = requestAnimationFrame(this.render);
  };
}

export default Chart;
