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