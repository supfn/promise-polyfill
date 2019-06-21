# promise-polyfill

[![Build Status](https://travis-ci.org/supfn/promise-polyfill.svg?branch=master)](https://travis-ci.org/supfn/promise-polyfill)
[![Coverage Status](https://coveralls.io/repos/github/supfn/promise-polyfill/badge.svg?branch=master)](https://coveralls.io/github/supfn/promise-polyfill?branch=master)

这是一个遵循 Promise/A+ 规范的 promise 实现，并参考了 ES6 提供的原生 Promise 对象实现了接口方式。

## 使用

支持如下方法：

1. Promise.prototype.then

2. Promise.prototype.catch

3. Promise.prototype.finally

4. Promise.all

5. Promise.race

6. Promise.resolve

7. Promise.reject

该 Promise 的使用方法与 ES6 原生 Promise 一致， ES6 Promise 使用详见 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


## 测试

测试是否遵循 Promise/A+ 规范

```
npm run test-aplus
```

测试是否按照 ES6 接口实现

```
npm run test-es6
```

## Promise/A+ 规范

[Promise/A+ 规范翻译](https://github.com/supfn/promise-polyfill/blob/master/doc/promise-aplus.md)
