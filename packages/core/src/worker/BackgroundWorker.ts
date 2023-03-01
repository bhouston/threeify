// this is the worker in the background, it receives messages from the main thread.

export interface IBackgroundRequest {
  id: number;
  type: string;
  parameters: any;
  buffers?: ArrayBuffer[];
}

export interface IBackgroundResponse {
  requestId: number;
  result: any;
  buffers?: ArrayBuffer[];
}

export type WorkerRequestHandler = (
  request: IBackgroundRequest
) => IBackgroundResponse;

// self.onmessage = (event) => this.onMessage(event);

export class BackgroundWorker {
  public handlers = new Map<
    string,
    (request: IBackgroundRequest) => Promise<IBackgroundResponse>
  >();

  constructor() {}

  onMessage(event: MessageEvent<any>) {
    const request = event.data as IBackgroundRequest;
    //console.log('Worker: received request', request.id);
    this.processRequest(request)
      .then((response) => {
        const message = {
          type: 'completed',
          requestId: response.requestId,
          result: response.result
        };
        self.postMessage(message);
        //console.log('Worker: completed task', request.id);
        return;
      })
      .catch((error: any) => {
        //console.error('Worker: error processing task', request, error);
        self.postMessage({
          type: 'error',
          requestId: request.id,
          message: (error as Error).message || 'no message'
        });
      });
  }

  processRequest(request: IBackgroundRequest): Promise<IBackgroundResponse> {
    const handler = this.handlers.get(request.type);
    if (handler === undefined)
      throw new Error(`Unknown task type ${request.type}`);
    return handler(request);
  }
}
