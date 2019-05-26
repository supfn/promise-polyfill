let p1 = () => new Promise(resolve => setTimeout(resolve, 100, 'p1'));
let p2 = () => new Promise(resolve => setTimeout(resolve, 100, 'p2'));


p1()
  .then(() => {
    return p2();
  })
  .then(r => console.log('log1', r));     // 200ms - p2


p1()
  .then(() => {
    p2();
  })
  .then(r => console.log('log2', r));     //100ms - undefined


p1()
  .then(p2())
  .then(r => console.log('log3', r));     //100ms - p1


p1()
  .then(p2)
  .then(r => console.log('log4', r));     //200ms - p2


// 思考以上代码打印结果, why, 解释说明

