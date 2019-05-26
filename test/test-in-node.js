const Promise = require("../src/Promise");
console.log("code start");

let p1 = new Promise(resolve => {
  setTimeout(() => {
    resolve(new Promise(resolve => {
      setTimeout(resolve, 2000, 666);
    }));
  }, 2000);
});

let p2 = new Promise(resolve => {
  setTimeout(resolve, 2000, 1666);
});

let p3 = new Promise(resolve => {
  setTimeout(resolve, 3000, 2666);
});

let p4 = Promise.resolve(1).then(v => {
  return v + 2;
});

let start = +new Date;

Promise.all([p1, p2, p3, p4, 5]).then(val => console.log(`${+new Date - start}ms later:`, val));

Promise.resolve('promise1, resolve at once').then(Promise.resolve).then(console.log);

Promise.resolve('promise2, resolve at once').then(console.log);

console.log("code ending");
