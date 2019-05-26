!function (e) {
  var t = {};

  function n(r) {
    if (t[r]) return t[r].exports;
    var i = t[r] = { i: r, l: !1, exports: {} };
    return e[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports;
  }

  n.m = e, n.c = t, n.d = function (e, t, r) {
    n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
  }, n.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
  }, n.t = function (e, t) {
    if (1 & t && (e = n(e)), 8 & t) return e;
    if (4 & t && "object" == typeof e && e && e.__esModule) return e;
    var r = Object.create(null);
    if (n.r(r), Object.defineProperty(r, "default", {
      enumerable: !0,
      value: e
    }), 2 & t && "string" != typeof e) for (var i in e) n.d(r, i, function (t) {
      return e[t];
    }.bind(null, i));
    return r;
  }, n.n = function (e) {
    var t = e && e.__esModule ? function () {
      return e.default;
    } : function () {
      return e;
    };
    return n.d(t, "a", t), t;
  }, n.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }, n.p = "", n(n.s = 2);
}([function (e, t) {
  var n;
  n = function () {
    return this;
  }();
  try {
    n = n || new Function("return this")();
  } catch (e) {
    "object" == typeof window && (n = window);
  }
  e.exports = n;
}, function (e, t) {
  var n, r, i = e.exports = {};

  function o() {
    throw new Error("setTimeout has not been defined");
  }

  function s() {
    throw new Error("clearTimeout has not been defined");
  }

  function c(e) {
    if (n === setTimeout) return setTimeout(e, 0);
    if ((n === o || !n) && setTimeout) return n = setTimeout, setTimeout(e, 0);
    try {
      return n(e, 0);
    } catch (t) {
      try {
        return n.call(null, e, 0);
      } catch (t) {
        return n.call(this, e, 0);
      }
    }
  }

  !function () {
    try {
      n = "function" == typeof setTimeout ? setTimeout : o;
    } catch (e) {
      n = o;
    }
    try {
      r = "function" == typeof clearTimeout ? clearTimeout : s;
    } catch (e) {
      r = s;
    }
  }();
  var u, a = [], l = !1, f = -1;

  function h() {
    l && u && (l = !1, u.length ? a = u.concat(a) : f = -1, a.length && d());
  }

  function d() {
    if (!l) {
      var e = c(h);
      l = !0;
      for (var t = a.length; t;) {
        for (u = a, a = []; ++f < t;) u && u[f].run();
        f = -1, t = a.length;
      }
      u = null, l = !1, function (e) {
        if (r === clearTimeout) return clearTimeout(e);
        if ((r === s || !r) && clearTimeout) return r = clearTimeout, clearTimeout(e);
        try {
          r(e);
        } catch (t) {
          try {
            return r.call(null, e);
          } catch (t) {
            return r.call(this, e);
          }
        }
      }(e);
    }
  }

  function p(e, t) {
    this.fun = e, this.array = t;
  }

  function m() {
  }

  i.nextTick = function (e) {
    var t = new Array(arguments.length - 1);
    if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
    a.push(new p(e, t)), 1 !== a.length || l || c(d);
  }, p.prototype.run = function () {
    this.fun.apply(null, this.array);
  }, i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.version = "", i.versions = {}, i.on = m, i.addListener = m, i.once = m, i.off = m, i.removeListener = m, i.removeAllListeners = m, i.emit = m, i.prependListener = m, i.prependOnceListener = m, i.listeners = function (e) {
    return [];
  }, i.binding = function (e) {
    throw new Error("process.binding is not supported");
  }, i.cwd = function () {
    return "/";
  }, i.chdir = function (e) {
    throw new Error("process.chdir is not supported");
  }, i.umask = function () {
    return 0;
  };
}, function (e, t, n) {
  const r = n(3), i = n(4);

  class o {
    constructor(e) {
      if ("function" != typeof e) throw TypeError(`Promise constructor argument ${e} is not a function`);
      this._status = r.PENDING, this._value = null, this._reason = null, this._onFulfilleds = [], this._onRejecteds = [], this._defferredQueue = [];
      try {
        e(this._resolve.bind(this), this._reject.bind(this));
      } catch (e) {
        this._reject(e);
      }
    }

    _resolve(e) {
      if (this._status === r.PENDING) {
        if (e instanceof o) return e.then(this._resolve.bind(this), this._reject.bind(this));
        this._status = r.FULFILLED, this._value = e, i(() => {
          this._onFulfilleds.forEach(t => t(e));
        });
      }
    }

    _reject(e) {
      this._status === r.PENDING && (this._status = r.REJECTED, this._reason = e, i(() => {
        this._onRejecteds.forEach(t => t(e));
      }));
    }

    then(e, t) {
      if (this.constructor !== o && !o.isPrototypeOf(this.constructor)) throw TypeError("incorrect-subclassing");
      e = "function" == typeof e ? e : e => e, t = "function" == typeof t ? t : e => {
        throw e;
      };
      let n = new o((o, s) => {
        let c = t => {
          try {
            let r = e(t);
            this._resolutionProcedure(n, r, o, s);
          } catch (e) {
            s(e);
          }
        }, u = e => {
          try {
            let r = t(e);
            this._resolutionProcedure(n, r, o, s);
          } catch (e) {
            s(e);
          }
        };
        this._status === r.PENDING && (this._onFulfilleds.push(c), this._onRejecteds.push(u)), this._status === r.FULFILLED && i(() => c(this._value)), this._status === r.REJECTED && i(() => u(this._reason));
      });
      return n;
    }

    _resolutionProcedure(e, t, n, r) {
      if (e === t) throw new TypeError("promise2 === x is not allowed");
      if (t && "object" == typeof t || "function" == typeof t) {
        let i = !1;
        try {
          let o = t.then;
          if ("function" != typeof o) return void n(t);
          let s = t => {
            i || (i = !0, this._resolutionProcedure(e, t, n, r));
          }, c = e => {
            if (!i) return i = !0, r(e);
          };
          o.call(t, s, c);
        } catch (e) {
          if (i) return;
          i = !0, r(e);
        }
      } else n(t);
    }

    catch(e) {
      return this.then(null, e);
    }

    finally(e) {
      return this.then(t => o.resolve(e()).then(() => t), t => o.resolve(e()).then(() => {
        throw t;
      }));
    }

    static resolve(e) {
      if (this !== o && !o.isPrototypeOf(this)) throw TypeError("incorrect-subclassing");
      return e instanceof o ? e : new o(t => t(e));
    }

    static reject(e) {
      if (this !== o && !o.isPrototypeOf(this)) throw TypeError("incorrect-subclassing");
      return new o((t, n) => n(e));
    }

    static race(e) {
      if (this !== o && !o.isPrototypeOf(this)) throw TypeError("incorrect-subclassing");
      return void 0 === e.length ? o.reject(new TypeError("argument is not iterable")) : 0 === e.length ? new o(() => {
      }) : new o((t, n) => {
        e.forEach(e => {
          e instanceof o ? e.then(t, n) : o.resolve(e).then(t, n);
        });
      });
    }

    static all(e) {
      if (this !== o && !o.isPrototypeOf(this)) throw TypeError("incorrect-subclassing");
      return void 0 === e.length ? o.reject(new TypeError("argument is not iterable")) : 0 === e.length ? o.resolve([]) : new o((t, n) => {
        let r = e.length;
        e.forEach(function i(s, c) {
          try {
            if (s instanceof o) return void s.then(e => i(e, c), n);
            e[c] = s, 0 == --r && t(e);
          } catch (e) {
            n(e);
          }
        });
      });
    }

    static deferred() {
      let e = {};
      return e.promise = new o((t, n) => {
        e.resolve = t, e.reject = n;
      }), e;
    }
  }

  e.exports ? e.exports = o : window.Promise = o;
}, function (e, t) {
  e.exports = { PENDING: "pending", FULFILLED: "fulfilled", REJECTED: "rejected" };
}, function (e, t, n) {
  (function (t, n) {
    e.exports = function (e) {
      if (void 0 !== n && "function" == typeof n.nextTick) return n.nextTick(e);
      if ("undefined" != typeof MutationObserver) {
        let t = 1;
        const n = new MutationObserver(e), r = document.createTextNode(String(t));
        return n.observe(r, { characterData: !0 }), t ^= 1, r.data = String(t), n;
      }
      return function (e) {
        return "function" == typeof t ? t(e) : setTimeout(e, 0);
      }(e);
    };
  }).call(this, n(5).setImmediate, n(1));
}, function (e, t, n) {
  (function (e) {
    var r = void 0 !== e && e || "undefined" != typeof self && self || window, i = Function.prototype.apply;

    function o(e, t) {
      this._id = e, this._clearFn = t;
    }

    t.setTimeout = function () {
      return new o(i.call(setTimeout, r, arguments), clearTimeout);
    }, t.setInterval = function () {
      return new o(i.call(setInterval, r, arguments), clearInterval);
    }, t.clearTimeout = t.clearInterval = function (e) {
      e && e.close();
    }, o.prototype.unref = o.prototype.ref = function () {
    }, o.prototype.close = function () {
      this._clearFn.call(r, this._id);
    }, t.enroll = function (e, t) {
      clearTimeout(e._idleTimeoutId), e._idleTimeout = t;
    }, t.unenroll = function (e) {
      clearTimeout(e._idleTimeoutId), e._idleTimeout = -1;
    }, t._unrefActive = t.active = function (e) {
      clearTimeout(e._idleTimeoutId);
      var t = e._idleTimeout;
      t >= 0 && (e._idleTimeoutId = setTimeout(function () {
        e._onTimeout && e._onTimeout();
      }, t));
    }, n(6), t.setImmediate = "undefined" != typeof self && self.setImmediate || void 0 !== e && e.setImmediate || this && this.setImmediate, t.clearImmediate = "undefined" != typeof self && self.clearImmediate || void 0 !== e && e.clearImmediate || this && this.clearImmediate;
  }).call(this, n(0));
}, function (e, t, n) {
  (function (e, t) {
    !function (e, n) {
      "use strict";
      if (!e.setImmediate) {
        var r, i, o, s, c, u = 1, a = {}, l = !1, f = e.document, h = Object.getPrototypeOf && Object.getPrototypeOf(e);
        h = h && h.setTimeout ? h : e, "[object process]" === {}.toString.call(e.process) ? r = function (e) {
          t.nextTick(function () {
            p(e);
          });
        } : !function () {
          if (e.postMessage && !e.importScripts) {
            var t = !0, n = e.onmessage;
            return e.onmessage = function () {
              t = !1;
            }, e.postMessage("", "*"), e.onmessage = n, t;
          }
        }() ? e.MessageChannel ? ((o = new MessageChannel).port1.onmessage = function (e) {
          p(e.data);
        }, r = function (e) {
          o.port2.postMessage(e);
        }) : f && "onreadystatechange" in f.createElement("script") ? (i = f.documentElement, r = function (e) {
          var t = f.createElement("script");
          t.onreadystatechange = function () {
            p(e), t.onreadystatechange = null, i.removeChild(t), t = null;
          }, i.appendChild(t);
        }) : r = function (e) {
          setTimeout(p, 0, e);
        } : (s = "setImmediate$" + Math.random() + "$", c = function (t) {
          t.source === e && "string" == typeof t.data && 0 === t.data.indexOf(s) && p(+t.data.slice(s.length));
        }, e.addEventListener ? e.addEventListener("message", c, !1) : e.attachEvent("onmessage", c), r = function (t) {
          e.postMessage(s + t, "*");
        }), h.setImmediate = function (e) {
          "function" != typeof e && (e = new Function("" + e));
          for (var t = new Array(arguments.length - 1), n = 0; n < t.length; n++) t[n] = arguments[n + 1];
          var i = { callback: e, args: t };
          return a[u] = i, r(u), u++;
        }, h.clearImmediate = d;
      }

      function d(e) {
        delete a[e];
      }

      function p(e) {
        if (l) setTimeout(p, 0, e); else {
          var t = a[e];
          if (t) {
            l = !0;
            try {
              !function (e) {
                var t = e.callback, r = e.args;
                switch (r.length) {
                  case 0:
                    t();
                    break;
                  case 1:
                    t(r[0]);
                    break;
                  case 2:
                    t(r[0], r[1]);
                    break;
                  case 3:
                    t(r[0], r[1], r[2]);
                    break;
                  default:
                    t.apply(n, r);
                }
              }(t);
            } finally {
              d(e), l = !1;
            }
          }
        }
      }
    }("undefined" == typeof self ? void 0 === e ? this : e : self);
  }).call(this, n(0), n(1));
}]);
