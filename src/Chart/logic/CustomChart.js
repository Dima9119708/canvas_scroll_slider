import collectionValueByKey from "./utils/collectionValueByKey";
import css from "./utils/css";

class Camera {
  constructor(DPI_WIDTH, FULL_WIDTH) {
    this.x = 0;
    this.DPI_WIDTH = DPI_WIDTH;
    this.FULL_WIDTH = FULL_WIDTH;
  }

  translateX = (elementEvent) => {
    const prevX = this.x;

    const mouseMove = (documentEvent) => {
      const deltaX = elementEvent.clientX - documentEvent.clientX;

      if (deltaX > 0) {
        this.x = prevX + deltaX;
      } else {
        this.x = prevX + deltaX;
      }

      if (this.x + this.DPI_WIDTH > this.FULL_WIDTH) {
        this.x = this.FULL_WIDTH - this.DPI_WIDTH;
      }

      if (this.x + this.DPI_WIDTH < this.DPI_WIDTH) {
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
  AXIS_Y_WIDTH = 50;
  ARROW_RIGHT = 50;
  rfa = null;

  constructor(options) {
    this.options = options;

    const {
      ctx,
      DPI,
      HEIGHT,
      WIDTH,
      PADDING,
      $canvas,
      $axisX,
      DPI_HEIGHT,
      DPI_WIDTH,
      VIEW_ELEMENTS,
      DISTANCE,
      FULL_WIDTH,
      DATA,
      yRatio,
    } = this.init(options);

    this.ctx = ctx;
    this.DPI = DPI;
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    this.PADDING = PADDING;
    this.$canvas = $canvas;
    this.$axisX = $axisX;
    this.DPI_HEIGHT = DPI_HEIGHT;
    this.DPI_WIDTH = DPI_WIDTH;
    this.VIEW_ELEMENTS = VIEW_ELEMENTS;
    this.DISTANCE = DISTANCE;
    this.FULL_WIDTH = FULL_WIDTH;
    this.DATA = DATA;
    this.yRatio = yRatio;
    options.getDistance(DISTANCE);

    this.CAMERA = new Camera(DPI_WIDTH, FULL_WIDTH);

    this.initEventListener();

    this.rfa = requestAnimationFrame(this.render);
  }

  init(options) {
    const {
      dpi = 1,
      data = [],
      height = 0,
      padding = { left: 0, right: 0, top: 0, bottom: 0 },
      domElement = null,
      viewElements = 0,
      keyX,
      keyY,
    } = options;

    const WIDTH =
      parseInt(window.getComputedStyle(domElement.parentElement).width) -
      this.AXIS_Y_WIDTH -
      this.ARROW_RIGHT;

    const PADDING = {
      top: padding.top * dpi,
      bottom: padding.bottom * dpi,
      left: padding.left * dpi,
      right: padding.right * dpi,
    };

    const DPI_HEIGHT = height * dpi;
    const DPI_WIDTH = WIDTH * dpi;
    const DISTANCE = DPI_WIDTH / viewElements;
    const FULL_WIDTH =
      DISTANCE * (data.length - 1) +
      PADDING.right +
      PADDING.right +
      PADDING.left;

    const maxYValue = Math.max(...collectionValueByKey(data, keyY));

    const yRatio = DPI_HEIGHT / maxYValue;
    const DATA = data.map((element, idx) => ({
      x: DISTANCE * idx + PADDING.left,
      y: element[keyY],
      dataX: element[keyX],
    }));

    const $canvas = domElement.querySelector("canvas");
    const $axisX = domElement.querySelector(".axis_x");
    const $axisY = domElement.querySelector(".axis_y");

    css($axisY, {
      height: height + "px",
      paddingTop: padding.top + "px",
      paddingBottom: padding.bottom + "px",
    });

    css($canvas, {
      height: height + "px",
      width: WIDTH + "px",
    });

    $canvas.height = DPI_HEIGHT;
    $canvas.width = DPI_WIDTH;

    const ctx = $canvas.getContext("2d");

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
      DATA,
      yRatio,
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.FULL_WIDTH, this.DPI_HEIGHT);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  reInit(options = {}) {
    cancelAnimationFrame(this.rfa);
    this.clearCanvas();
    this.removeEventsListener();

    new Chart(Object.assign(this.options, options));
  }

  resize() {}

  removeEventsListener() {
    this.$canvas.removeEventListener("mousedown", this.CAMERA.translateX);
    this.$axisX.removeEventListener("mousedown", this.CAMERA.translateX);
  }

  initEventListener() {
    this.$canvas.addEventListener("mousedown", this.CAMERA.translateX);
    this.$axisX.addEventListener("mousedown", this.CAMERA.translateX);
  }

  calcYValue(value) {
    return this.DPI_HEIGHT - value * this.yRatio;
  }

  calcY(value) {
    const result = this.calcYValue(value);
    const percent = (result / this.DPI_HEIGHT) * 100;

    if (percent > 90) return result - this.PADDING.bottom;
    if (percent < 10) return result + this.PADDING.top;

    return result;
  }

  render = () => {
    this.clearCanvas();

    this.ctx.translate(-this.CAMERA.x, 0);

    css(this.$axisX, {
      transform: `translateX(-${this.CAMERA.x}px)`,
    });

    const [first] = this.DATA;

    this.ctx.beginPath();
    this.ctx.moveTo(first.x, this.calcY(first.y));

    for (let idx = 1; idx < this.DATA.length; idx++) {
      this.ctx.lineTo(this.DATA[idx].x, this.calcY(this.DATA[idx].y));
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(this.DATA[idx].x, this.calcY(this.DATA[idx].y), 10, 10);
    }

    this.ctx.lineWidth = 4;
    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = "#5CBA7C";
    this.ctx.stroke();

    this.rfa = requestAnimationFrame(this.render);
  };
}

export default Chart;
