const Promise = require("../src/Promise");

setTimeout(() => console.log('setTimeout 0'), 0);

console.log('start');

let promise = new Promise(resolve => {
  setTimeout(resolve, 100, 100);
  // resolve(0);
});

promise.then(value => { // 1
  console.log(1);
  promise.then(value => { //4
    console.log(4);
    promise.then(value => { //6
      console.log(6);
    });
  });
  promise.then(value => { //5
    console.log(5);
  });
});
promise.then(value => { // 2
  console.log(2);
});
promise.then(value => { // 3
  console.log(3);
});


console.log('end');

setTimeout(() => {
  console.log('promise._onFulfilleds.length: ', promise._onFulfilleds.length);
}, 200);


// EventLoop，JS代码运行机制，可以手动操作下面的队列或状态，模拟代码运行时的状况

// Main Thread:  ~
// MicroTask:
// MacroTask:
// timer:
// promise status:
// promise onFulfilledQueue:
// log: start, end, setTimeout 0, 1, 2, 3, 4, 5, 6,
