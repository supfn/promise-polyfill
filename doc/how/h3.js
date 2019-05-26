// 错误
new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(resolve, 1000, 1000);
}).then(r => {
    // success
  },
  e => {
    // error
    // 仅处理promise运行时发生的错误。无法处理回调中的错误
    // console.log(e)
  });


// 正确
new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(resolve, 1000, 1000);
}).then(r => {
  // success
  throw Error("error");
}).catch(e => {
  console.log(e);
});
