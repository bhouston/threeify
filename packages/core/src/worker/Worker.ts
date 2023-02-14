// this is the worker in the background, it receives messages from the main thread.

interface IWorkerRequest {
  id: number;
  type: string;
  parameters: any;
}

interface IWorkerResponse {
  requestId: number;
  result: any;
  buffers?: ArrayBuffer[];
}

self.onmessage = (event) => {
  const request = event.data as IWorkerRequest;
  //console.log('Worker: received request', request.id);
  try {
    const response = processRequest(request);
    //console.log('Worker: completed task', request.id);
    const message = {
      type: 'completed',
      requestId: response.requestId,
      result: response.result
    };
    self.postMessage(message);
  } catch (error: any) {
    //console.error('Worker: error processing task', request, error);
    self.postMessage({
      type: 'error',
      requestId: request.id,
      message: (error as Error).message || 'no message'
    });
  }
};

function processRequest(request: IWorkerRequest): IWorkerResponse {
  switch (request.type) {
    case 'delay': {
      const delay = request.parameters.delay;
      const start = Date.now();
      while (Date.now() - start < delay) {
        // do nothing
      }
      return { requestId: request.id, result: delay, buffers: undefined };
    }

    default:
      throw new Error(`Unknown task type ${request.type}`);
  }
}
