// 场景1： 有三个请求 req1、req2、req3
// req2的请求依赖req1的请求响应结果 ， req3的请求依赖req1与req2的响应结果
// p1 - req1 , p2 - req2 , p3 - req3

let p1 = params => new Promise(resolve => {
});
let p2 = params => new Promise(resolve => {
});
let p3 = params => new Promise(resolve => {
});


// 错误
p1().then(r1 => {
  return p2(r1)
    .then(r2 => {
      return p3(r1, r2);
    });
});

// 正确
p1()
  .then(r1 => Promise.all([r1, p2(r1)]))
  .then(r12 => p3(r12));


// 场景2： 有两个请求 req1、req2、我们需要取req1请求响应结果中的一个数组，然后循环去取这个数组中的每一项作为req2请求的参数,  ui同步操作

// 错误
p1().then(r => {
  r.list.forEach(item => {
    p2(item);
  });
});

// 正确
p1.then(r => {
  let pArr = r.list.map(item => p2(item));
  return Promise.all(pArr);
});
