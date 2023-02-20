How do web workers work?

Check if they are available....

```js
if (window.Worker) {
  // …
}
```

Create a web worker...

```js
const myWorker = new Worker('worker.js');
```

Send messages from main window

```js
first.onchange = () => {
  myWorker.postMessage([first.value, second.value]);
  console.log('Message posted to worker');
}

second.onchange = () => {
  myWorker.postMessage([first.value, second.value]);
  console.log('Message posted to worker');
}
```

And receive messages on the main thread

```js
myWorker.onmessage = (e) => {
  result.textContent = e.data;
  console.log('Message received from worker');
}
```

receive messages in worker

```js
onmessage = (e) => {
  console.log('Message received from main script');
  const workerResult = `Result: ${e.data[0] * e.data[1]}`;
  console.log('Posting message back to main script');
  postMessage(workerResult);
}
```

Terminate the worker thread

```js
myWorker.terminate();
```


The draco webworker in Three.js uses efficient transfer of ArrayBuffers via using the
transferable objects parameter of the web workers message passing system.


Ideas for Web Workers:
- It may be useful to have the HDR decoder work within a web worker?
- Can I uplaod webgl2 stuff in a web worker?



The way that the web worker works in Three.js is this:
- imports from three the geometry type.
- has 4 workers.
- acts like a queue.
- sends tasks to the worker, the worker responds when they are done.


A nice interface:
- Have a promise-based interface for decoding.
- There should be a non-worker-based queue.
- It should initialize the workers.
- Tasks and the promises go into a queue.
- If a worker is free, the first item from the queue goes into the worker.
- When a worker is done, we complete the promise, then check the queue, and fill any empty workers.

Data structure:
- Queue of tasks (name + data + promise callbacks)
- An array of waiting workers and an array of pending workers.

One type of web worker for all background tasks.  Then I do not overload background CPUs.

Question:
- How do I listen to messages posted back to the main thread?


Update, the above all works!

