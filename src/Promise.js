const STATUS = require('./util/status');
const nextTick = require('./util/nextTick');

class Promise {
  constructor (executor) {
    if (typeof executor !== 'function') {
      throw TypeError(`Promise constructor argument ${executor} is not a function`);
    }
    // ES6原生的Promise构造函数中，若不通过`new`调用Promise的构造函数，会抛出TypeError异常。此处与其一致
    if (!(this instanceof Promise)) {
      throw new TypeError('TypeError: undefined is not a promise');
    }
    this._status = STATUS.PENDING;
    this._value = null;
    this._reason = null;
    this._onFulfilleds = [];
    this._onRejecteds = [];
    this._defferredQueue = [];
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (e) {
      this._reject(e);
    }
  }

  _resolve (value) {
    if (this._status !== STATUS.PENDING) return;
    if (value instanceof Promise) {
      // 检测到无限递归，抛出的异常与 ES6 原生 Promise 保持一致
      if (value === this) throw TypeError('chaining cycle detected for promise');
      return value.then(this._resolve.bind(this), this._reject.bind(this));
    }
    this._status = STATUS.FULFILLED;
    this._value = value;
    nextTick(() => {
      this._onFulfilleds.forEach(onFulfilled => onFulfilled(value));
    });
  }

  _reject (reason) {
    if (this._status !== STATUS.PENDING) return;
    this._status = STATUS.REJECTED;
    this._reason = reason;
    nextTick(() => {
      this._onRejecteds.forEach(onRejected => onRejected(reason));
      // 对于 promise 链末端抛异常，却未捕获的情况，可以在此处理，同 ES6 原生 Promise
      // if (!this._onRejecteds.length) {
      //   console.error('Uncaught (in promise)', reason);
      // }
    });
  }

  then (onFulfilled, onRejected) {
    if (this.constructor !== Promise && !Promise.isPrototypeOf(this.constructor)) {
      throw TypeError('incorrect-subclassing');
    }
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
      throw reason;
    };
    let promise2 = new Promise((resolve, reject) => {
      let onFulfilledWrapped = value => {
        try {
          let x = onFulfilled(value);
          this._resolutionProcedure(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      };
      let onRejectedWrapped = reason => {
        try {
          let x = onRejected(reason);
          this._resolutionProcedure(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      };
      if (this._status === STATUS.PENDING) {
        this._onFulfilleds.push(onFulfilledWrapped);
        this._onRejecteds.push(onRejectedWrapped);
      }
      if (this._status === STATUS.FULFILLED) {
        nextTick(() => onFulfilledWrapped(this._value));
      }
      if (this._status === STATUS.REJECTED) {
        nextTick(() => onRejectedWrapped(this._reason));
      }
    });
    return promise2;
  }

  _resolutionProcedure (promise2, x, resolve, reject) {
    // 检测到无限递归，抛出的异常与 ES6 原生 Promise 保持一致
    if (promise2 === x) {
      throw TypeError('chaining cycle detected for promise');
    }

    // 规范2.3.2，实际下面的 then.call 判断逻辑其实已经覆盖了这段逻辑，按照规范实现的 Promise 必然是 thenable
    if (x instanceof Promise) {
      x.then(y => this._resolutionProcedure(promise2, y, resolve, reject), reject);
      return;
    }

    if (x && (typeof x === 'object' || typeof x === 'function')) {
      let promiseHandled = false;
      try {
        let then = x.then;
        if (typeof then !== 'function') {
          resolve(x);
          return;
        }

        let resolvePromise = y => {
          if (promiseHandled) return;
          promiseHandled = true;
          this._resolutionProcedure(promise2, y, resolve, reject);
        };
        let rejectPromise = r => {
          if (promiseHandled) return;
          promiseHandled = true;
          reject(r);
        };
        then.call(x, resolvePromise, rejectPromise);
      } catch (e) {
        if (promiseHandled) return;
        promiseHandled = true;
        reject(e);
      }
    } else {
      resolve(x);
    }
  }

  catch (onRejected) {
    return this.then(null, onRejected);
  }

  finally (cb) {
    return this.then(
      value => Promise.resolve(cb()).then(() => value),
      reason => Promise.resolve(cb()).then(() => {
        throw reason;
      })
    );
  }

  static resolve (value) {
    if (this !== Promise && !Promise.isPrototypeOf(this)) {
      throw TypeError('incorrect-subclassing');
    }
    if (value instanceof Promise) {
      return value;
    }
    return new Promise(resolve => resolve(value));
  }

  static reject (reason) {
    if (this !== Promise && !Promise.isPrototypeOf(this)) {
      throw TypeError('incorrect-subclassing');
    }
    return new Promise((resolve, reject) => reject(reason));
  }

  static race (iterable) {
    if (this !== Promise && !Promise.isPrototypeOf(this)) {
      throw TypeError('incorrect-subclassing');
    }
    if (iterable.length === undefined) {
      return Promise.reject(new TypeError('argument is not iterable'));
    }
    if (iterable.length === 0) {
      return new Promise(() => {
      });
    }
    return new Promise((resolve, reject) => {
      iterable.forEach(p => {
        Promise.resolve(p).then(resolve, reject);
      });
    });
  }

  static all (iterable) {
    if (this !== Promise && !Promise.isPrototypeOf(this)) {
      throw TypeError('incorrect-subclassing');
    }
    if (iterable.length === undefined) {
      return Promise.reject(new TypeError('argument is not iterable'));
    }
    if (iterable.length === 0) {
      return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
      let length = iterable.length;
      iterable.forEach((v, i) => {
        try {
          Promise.resolve(v).then(value => {
            iterable[i] = value;
            if (--length === 0) {
              resolve(iterable);
            }
          }, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  static deferred () {
    let defer = {};
    defer.promise = new Promise((resolve, reject) => {
      defer.resolve = resolve;
      defer.reject = reject;
    });
    return defer;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Promise;
} else {
  window.Promise = Promise;
}
