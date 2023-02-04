import {
  EXT_disjoint_timer_query_webgl2,
  RenderingContext
} from '@threeify/core';

// TypeScript conversion and refactor of THREE.js stats.module.js
export class Stats {
  private currentPanel = 0;
  private container: HTMLDivElement;
  private beginTime: number;
  private prevTime: number;
  private frames = 0;
  private fpsPanel: Panel;
  private msPanel: Panel;
  public REVISION = 16;

  constructor() {
    if (document === undefined) throw new Error('Stats: document is undefined');

    this.container = document.createElement('div');
    this.container.style.cssText =
      'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
    this.container.addEventListener(
      'click',
      (event: Event) => {
        event.preventDefault();
        this.showPanel(++this.currentPanel % this.container.children.length);
      },
      false
    );
    document.body.appendChild(this.container);

    this.beginTime = (performance || Date).now();
    this.prevTime = this.beginTime;

    this.msPanel = this.addPanel(new Panel('MS', '#0f0', '#020'));
    this.fpsPanel = this.addPanel(new Panel('FPS', '#0ff', '#002'));

    this.showPanel(0);
  }

  get dom(): HTMLDivElement {
    return this.container;
  }

  addPanel(panel: Panel) {
    if (panel.error) return panel;
    this.container.appendChild(panel.dom);
    this.showPanel(this.currentPanel);
    return panel;
  }

  showPanel(panelIndex: number) {
    for (let i = 0; i < this.container.children.length; i++) {
      (this.container.children[i] as HTMLDivElement).style.display =
        i === panelIndex ? 'block' : 'none';
    }

    this.currentPanel = panelIndex;
  }

  begin() {
    this.beginTime = (performance || Date).now();
  }

  end() {
    this.frames++;

    const time = (performance || Date).now();

    this.msPanel.update(time - this.beginTime, 200);

    this.fpsPanel.update(1000 / (time - this.prevTime), 100);

    this.prevTime = time;

    return time;
  }

  time(body: () => void) {
    this.begin();
    body();
    this.end();
  }

  update() {
    this.beginTime = this.end();
  }

  get domElement(): HTMLDivElement {
    return this.container;
  }

  setMode(id: number) {
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
  private smoothedValue = 0;
  private canvas: HTMLCanvasElement;
  public error = false;

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

  get dom(): HTMLCanvasElement {
    return this.canvas;
  }

  update(value: number, maxValue: number) {
    this.min = Math.min(this.min, value);
    this.max = Math.max(this.max, value);
    const context = this.canvas.getContext('2d');
    if (context === null) return;
    context.fillStyle = this.bg;
    context.globalAlpha = 1;
    context.fillRect(0, 0, WIDTH, GRAPH_Y);
    context.fillStyle = this.fg;
    this.smoothedValue = this.smoothedValue * 0.95 + value * 0.05;
    context.fillText(
      round(this.smoothedValue) +
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

export class GPUTimerPanel extends Panel {
  private ext: EXT_disjoint_timer_query_webgl2 | null;
  private currentQuery?: WebGLQuery;
  private queryQueue: WebGLQuery[] = [];

  constructor(public context: RenderingContext, name = 'GPU') {
    super(' % ' + name, '#fff', '#000');

    const extension = context.glxo.EXT_disjoint_timer_query_webgl2;
    if (extension === null) {
      console.warn('GPUTimerPanel requires EXT_disjoint_timer_query_webgl2');
      this.error = true;
    }
    this.ext = extension;
  }

  private checkForQueryResult() {
    if (this.queryQueue.length === 0) return;
    const { gl } = this.context;
    const { ext, queryQueue } = this;
    if (ext === null) return;
    while (queryQueue.length > 0) {
      const query = queryQueue[0];
      if (gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) {
        if (!gl.getParameter(ext.GPU_DISJOINT_EXT)) {
          // pop off first query from query queue
          const nanoSeconds = gl.getQueryParameter(query, gl.QUERY_RESULT);
          const framePercentage = (100 * (nanoSeconds / 1000000)) / (1000 / 60);
          super.update(framePercentage, 100);
          queryQueue.shift();
          gl.deleteQuery(query);
          continue;
        }
      }
      return;
    }
  }

  begin() {
    const { ext } = this;
    if (ext === null) return;
    this.checkForQueryResult();
    const { gl } = this.context;
    const newQuery = gl.createQuery();
    if (newQuery === null) throw new Error('Failed to create query');
    gl.beginQuery(ext.TIME_ELAPSED_EXT, newQuery);
    this.currentQuery = newQuery;
  }

  end() {
    const { ext, queryQueue } = this;
    if (ext === null) return;
    if (this.currentQuery === undefined) throw new Error('No current query');
    const { gl } = this.context;
    gl.endQuery(ext.TIME_ELAPSED_EXT);
    queryQueue.push(this.currentQuery);
    this.currentQuery = undefined;
  }

  time(body: () => void) {
    this.begin();
    body();
    this.end();
  }
}
