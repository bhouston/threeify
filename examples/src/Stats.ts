export class Stats {
  private mode = 0;
  private container: HTMLDivElement;
  private beginTime: number;
  private prevTime: number;
  private frames = 0;
  private fpsPanel: Panel;
  private msPanel: Panel;
  public REVISION = 16;

  constructor(document: Document) {
    this.container = document.createElement('div');
    this.container.style.cssText =
      'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
    this.container.addEventListener(
      'click',
      (event: Event) => {
        event.preventDefault();
        this.showPanel(++this.mode % this.container.children.length);
      },
      false
    );

    this.beginTime = (performance || Date).now();
    this.prevTime = this.beginTime;

    this.fpsPanel = this.addPanel(new Panel('FPS', '#0ff', '#002'));
    this.msPanel = this.addPanel(new Panel('MS', '#0f0', '#020'));

    this.showPanel(0);
  }

  public get dom(): HTMLDivElement {
    return this.container;
  }

  public addPanel(panel: Panel) {
    this.container.appendChild(panel.dom);
    return panel;
  }

  public showPanel(id: number) {
    for (let i = 0; i < this.container.children.length; i++) {
      (this.container.children[i] as HTMLDivElement).style.display =
        i === id ? 'block' : 'none';
    }

    this.mode = id;
  }

  public begin() {
    this.beginTime = (performance || Date).now();
  }

  public end() {
    this.frames++;

    const time = (performance || Date).now();

    this.msPanel.update(time - this.beginTime, 200);

    if (time >= this.prevTime + 1000) {
      this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 100);

      this.prevTime = time;
      this.frames = 0;
    }

    return time;
  }

  public update() {
    this.beginTime = this.end();
  }

  public get domElement(): HTMLDivElement {
    return this.container;
  }

  public setMode(id: number) {
    this.showPanel(id);
  }
}

const round = Math.round;
const PR = round(window.devicePixelRatio || 1);
const WIDTH = 80 * PR;
const HEIGHT = 48 * PR;
const TEXT_X = 3 * PR;
const TEXT_Y = 2 * PR;
const GRAPH_X = 3 * PR;
const GRAPH_Y = 15 * PR;
const GRAPH_WIDTH = 74 * PR;
const GRAPH_HEIGHT = 30 * PR;

export class Panel {
  private min = Number.POSITIVE_INFINITY;
  private max = 0;
  private canvas: HTMLCanvasElement;

  constructor(public name: string, public fg: string, public bg: string) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = WIDTH;
    this.canvas.height = HEIGHT;
    this.canvas.style.cssText = 'width:80px;height:48px';

    const context = this.canvas.getContext('2d');
    if (context === null) return;
    context.font = 'bold ' + 9 * PR + 'px Helvetica,Arial,sans-serif';
    context.textBaseline = 'top';

    context.fillStyle = this.bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.fillStyle = this.fg;
    context.fillText(name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    context.fillStyle = this.bg;
    context.globalAlpha = 0.9;
  }

  public get dom(): HTMLCanvasElement {
    return this.canvas;
  }

  public update(value: number, maxValue: number) {
    this.min = Math.min(this.min, value);
    this.max = Math.max(this.max, value);
    const context = this.canvas.getContext('2d');
    if (context === null) return;
    context.fillStyle = this.bg;
    context.globalAlpha = 1;
    context.fillRect(0, 0, WIDTH, GRAPH_Y);
    context.fillStyle = this.fg;
    context.fillText(
      round(value) +
        ' ' +
        this.name +
        ' (' +
        round(this.min) +
        '-' +
        round(this.max) +
        ')',
      TEXT_X,
      TEXT_Y
    );

    context.drawImage(
      this.canvas,
      GRAPH_X + PR,
      GRAPH_Y,
      GRAPH_WIDTH - PR,
      GRAPH_HEIGHT,
      GRAPH_X,
      GRAPH_Y,
      GRAPH_WIDTH - PR,
      GRAPH_HEIGHT
    );

    context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);
    context.fillStyle = this.bg;
    context.globalAlpha = 0.9;
    context.fillRect(
      GRAPH_X + GRAPH_WIDTH - PR,
      GRAPH_Y,
      PR,
      round((1 - value / maxValue) * GRAPH_HEIGHT)
    );
  }
}
