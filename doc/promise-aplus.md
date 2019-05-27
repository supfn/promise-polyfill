[TOC]

# Promise/A+ 规范翻译

> [英文版链接](https://promisesaplus.com/)

## 0. 前言

为了下文的行文方便，同时能够简短清晰的表达语义，作如下定义：

- `thenable`: 表示定义了 then 方法的对象或函数，且看上去像一个 promise。
- `fulfilled`: 表示完成，实现或解决的 promise 的状态。
- `rejected`: 表示已拒绝的 promise 的状态。
- `resolve`: 表示完成，实现 promise 的动作。
- `reject`: 表示拒绝 promise 的动作。
- `promise 共存或可互操作`： 表示的意思是，遵循此规范实现的不同 promise， 其 then 方法的行为相同，因此其 then 方法的链式调用可以互通。以下代码加强理解
```JavaScript
promise1.then(value => promise2).then(value => promise3)
```
 其中 promise1, promise2, promise3 是遵循此规范实现的3种不同promise， 但他们却能完成形如上述的 then 链式调用， 此称为 promise 之间可共存或可互操作


**正文开始**

**这是一个开放的标准提供给 JavaScript 开发者，所有遵循这个规范实现的 promise 之间能够共存。**

promise 表示异步操作的最终结果。与 promise 进行交互的主要方式是通过其 then 方法，该方法注册回调函数以接收 promise 的最终值或拒绝 promise 的原因。

该规范详细说明了 then 方法的行为，为所有符合 Promise/A+ 规范的 promise 实现提供了一个可互操作的基础。 因此，该规范会非常的稳定。尽管 Promises/A+ 组织可能会偶尔修改此规范，并进行微小的向后兼容更改以解决新发现的极端情况，但只有经过仔细考虑、讨论和测试后，才会进行大型或向后不兼容的更改。

从历史上看，Promises/A+ 把之前 [Promise/A提案](http://wiki.commonjs.org/wiki/Promises/A) 中的建议明确成为了行为标准，继承了它原有的约定行为并删减一些有问题的部分。

最后，Promises/A+ 规范没有涉及到 如何创建、解决 或 拒绝 promise，而是专注于提供可互操作的 then 方法。不过未来可能涉及到上述这些主题。


## 1. 术语

- 1.1 `promise` 是一个对象或函数，其 then 方法的行为符合此规范。
- 1.2 `thenable`是定义了 then 方法的对象或函数。
- 1.3 `value` 是任何合法的 JavaScript 值, 包括 undefined， thenable， promise
- 1.4 `exception` 是使用 throw 语句抛出的值。
- 1.5 `reason` 是一个值，代表被 reject 的原因。


## 2. 要求

### 2.1 promise 状态

promise 必须是 pending, fulfilled, rejected 三种状态之一。

- 2.1.1 promise 处于 pending 状态时
    - 2.1.1.1  可以转变成 fulfilled 或 rejected

- 2.1.2 promise 处于 fulfilled 状态时
    - 2.1.2.1 无法转变成其他状态
    - 2.1.2.2 必须有一个 value， 并且不可改变

- 2.1.3 promise 处于 rejected 状态时
    - 2.1.3.1 无法转变成其他状态
    - 2.1.3.2 必须有一个 reason， 并且不可改变

这里的不可变指的是恒等（即可用 === 判断相等），当 value 或 reason 不是基本值时，只要求其引用地址相等，但属性值可被更改。

### 2.2 then 方法

promise 必须提供一个 then 方法来访问其当前或最终的 value 或 reason。

promise 的 then 方法接受两个参数：

```javascript
promise.then(onFulfilled, onRejected)
```

- 2.2.1 onFulfilled 和 onRejected 是可选参数
    - 2.2.1.1 如果 onFulfilled 不是函数，则忽略。
    - 2.2.1.1 如果 onRejected 不是函数，则忽略。

- 2.2.2 如果 onFulfilled 是一个函数
    - 2.2.2.1 它必须在promise完成后调用，promise 的 value 作为其第一个参数。
    - 2.2.2.2 在 promise 完成之前不得调用它。
    - 2.2.2.3 它不能被多次调用。

- 2.2.3 如果 onRejected 是一个函数
    - 2.2.3.1 它必须在 promise 被拒绝后被调用，promise 的 reason 是它的第一个参数。
    - 2.2.3.2 在 promise 被拒绝之前不得调用它。
    - 2.2.3.3 它只能被调用一次

- 2.2.4 onFulfilled 或 onRejected 在[执行环境](https://es5.github.io/#x10.3)堆栈仅包含“平台代码”时才能调用 (见[3.1](#3.1))

- 2.2.5 onFulfilled 与 onRejected 必须作为函数调用（即没有this值）

- 2.2.6 then 可以在同一个 promise 上多次调用
    - 2.2.6.1 如果 promise fulfilled，则所有的 onFulfilled 回调必须按其 then 方法注册的顺序执行。
    - 2.2.6.2 如果 promise rejected，则所有的 onRejected 回调必须按其 then 方法注册的顺序执行。

- 2.2.7 then 方法必须返回一个 promise

```javascript
promise2 = promise1.then(onFulfilled, onRejected);
```
-
    - 2.2.7.1 如果 onFulfilled 或 onRejected 函数返回一个值为 x，执行 promise 解决过程 `[[Resolve]](promise2, x)`
    - 2.2.7.2 如果 onFulfilled 或 onRejected 抛出一个异常 e, promise2 必须使用 e 作为 reason 来 reject.
    - 2.2.7.3 如果 onFulfilled 不是一个函数， 并且 promise1 已经完成，则 promise2 达到 fulfilled 状态，并且其 value 与 promise1 的值相同
    - 2.2.7.4 如果 onRejected 不是一个函数，并且 promise1 已经被 reject，promise2 也是以 promise1 的 reason 被拒绝。

### 2.3  promise 解决过程

Promise 解决过程是一个抽象的操作，需要输入一个 promise 和一个值，我们表示为 `[[Resolve]](promise,x)` ， 如果 x 是一个 thenable ， 解决过程即尝试使 promise 接受 x 的状态；否则以 x 的值来完成 promise

对 thenable 的这种特性允许 promise 的实现进行互操作，只要它们遵循 Promise/A+ 的规范实现 then 方法即可。

`[[Resolve]](promise, x)`，按以下步骤执行：

- 2.3.1 如果 promise 和 x 的指向同一对象，以 TypeError 为 reason 拒绝 promise。

- 2.3.2 如果 x 为 promise ，则采用 x 的状态作为 promise 的状态（见[3.4](#3.4)）
    - 2.3.2.1 如果 x 处于 pending 状态， promise 必须保持 pending 状态， 直到 x 被完成或拒绝。
    - 2.3.2.2 如果 x 处于 fulfilled 状态，promise 完成并使用相同的value。
    - 2.3.2.2 如果 x 处于 rejected 状态， promise 被拒绝并使用相同的 reason。

- 2.3.3 如果 x 是一个对象或函数
    - 2.3.3.1 获取 x 的 then 属性，`let then = x.then`
    - 2.3.3.2 如果获取属性 x.then 时抛出的异常 e，把 e 作为的原因拒绝 promise
    - 2.3.3.3 如果 then 是一个函数， 将 x 绑定为其 this 值并执行，第一个参数是 resolvePromise, 第二个参数是 rejectPromise，  `then.call(x, resolvePromise, rejectPromise)`
        - 2.3.3.3.1 如果以值 y 作为参数调用 resolvePromise，则执行 `[[Resolve]](promise, y)`
        - 2.3.3.3.2 如果以原因 r 作为参数调用 rejectPromise，则以原因 r 拒绝 promise
        - 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 都被调用，或以相同的参数多次调用，则采用第一次的调用， 其他的忽略。
        - 2.3.3.3.4 如果调用 then 抛出一个异常 e
            - 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用, 则忽略异常 e
            - 2.3.3.3.4.2 否则把 e 作为 reason 拒绝 promise
    - 2.3.3.4 如果 then 不是一个 函数, 用 x 作为 value 完成 promise

-  2.3.4  如果 x 不是对象或函数，用 x 作为 value 完成 promise

如果在一个循环的 thenable 链中，以 thenable 作为 value 来完成 promise，使得调用 `[[Resolve]](promise, thenable)` 将导致 `[[Resolve]](promise, thenable)`再次调用，这将导致无限递归。promise 的实现 鼓励检测这种递归并拒绝 promise 以 TypeError 作为 reason。 但此非必须要求。(见[3.6](#3.6))


## 3 注释

- <a id="3.1">3.1</a> 这里的“平台代码”指的是引擎，环境和 promise 的实现代码。在实践中，要求确保异步执行 onFulfilled 和 onRejected。且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。这可以用“宏任务”机制实现，如 setTimeout 或 setImmediate，或者用“微任务”机制，如 MutationObserver 或 process.nextTick。由于 promise 的实现被认为是“平台代码”，因此代码本身可能包含一个任务调度队列来调用处理程序。

- 3.2 在严格模式中 this 将指向 undefined，在非严格模式下，它将指向全局对象。

- 3.3 只要代码实现满足规范所有要求，可以允许 `promise2 === promise1`。每个实现必须文档记载它是否可以产生 `promise2 === promise1` 以及在什么条件下可以产生。

- <a id="3.4">3.4</a> 通常来说，如果 x 符合当前实现的 promise 。才能认为它是真正的 promise。允许使用特定的实现的方法来获取 x 的状态。

- 3.5 promise 解决过程先获取 x.then 的引用，然后测试该引用并调用该引用，避免多次访问x.then 属性。x.then 属性的值可能会在获取后发生变化， 这可以确保各个过程使用的 x.then 一致。

- <a id="3.6">3.6</a> promise 的实现不应该限制 thenable 链的深度，并假设超出限制深度的递归将是无限的。只有真正的循环才递归才能导致 TypeError; 如果遇到一条无限的 thenable链，其上的 thenable 都是不同的 ，无限递归就是正确的行为。


## 思考

以上便是 Promise/A+ 规范的所有内容， 由于大家都是遵循这个规范，所以不同 promise 实现之间能够共存，不得不说制定规范是至关重要的。我们需要认真研读每一条规范，思考规范制定背后的意义。

如：

then 方法为什么不是返回 this 即当前的 promise，而是一个新的 promise 对象。如果返回 this, 那么两个 promise 的状态就同步了， promise1 状态变更后， promise2 就没法接受后面异步操作进行状态变更。

promise 的解决过程中， 为何要规定 promsie2 和 x 不能指向同一对象， 认真思考下可以得出结论，是为了防止循环引用。

还有很多值得仔细去思索的地方，希望看到这篇文章的同学，对规范能有一个更深的理解并有所收获。
