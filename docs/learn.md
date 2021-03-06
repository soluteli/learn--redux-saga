# 花式使用 redux-saga 
本文的思路借鉴了[Redux-Saga 漫谈](https://zhuanlan.zhihu.com/p/35437092?group_id=966592505576407040)，我主要整理了一些 **redux-saga 的使用实例**
## redux-saga 是什么？
redux-saga 可以更加优雅的管理 Redux 应用程序中的**副作用（Side Effects）**。   

**Side Effects**
在 redux 应用程序中，副作用指的是在进入 reducer 前的新数据准备工作：包括异步网络请求、本地读取 localStorage/Cookie 的从外界获取数据的操作。   

同样都是管理副作用, redux-saga 和 redux-thunk 的不同之处在哪里呢？   

首先，为了在 redux 中更新 store ，我们必须执行 `dispatch(action)` 的操作。action 都应该是一个对象，如下：
```js
{
  type: 'ADD_TODO',
  payload: {
    text: 'Do something.'  
  }
}
```
dispatch 这个 action 会通知 reducer 更改对应的 store 数据， 如下：
```js
export default function counter(state = 'inital', action) {
  switch (action.type) {
    case 'ADD_TODO':
      return action.payload.text
    default:
      return state
  }
}
```
reducer 匹配 action.type 后将 action.payload 的同步更新到 store 内。   

对于一个丰富的 web 应用来说， payload 数据通常都要从服务器获取。redux-thunk 中间件增强了 store 的 dispatch 方法。增强后的 dispatch 可以传入 function 作为参数（即： `dispatch(funtion)`）。 传入的 function 会被执行，这样我们就可以在 function 中添加异步逻辑了。示例 funtion 的代码如下：
```js
/* action.js */
// ----------
export function fetchData(someValue) {
  return (dispatch, getState) => {
    myAjaxLib.post("/api", { data: someValue })
      .then(response => dispatch({ type: "REQUEST_SUCCEEDED", payload: response })
      .catch(error => dispatch({ type: "REQUEST_FAILED", error: error });
  };
}

/* UI的调用 */
// ----------
dispatch(fetchData(someValue))

```

那么 redux-saga 怎样实现上面的功能呢？    
下面先展示一下示例代码：   
```js
/* saga.js */
// ----------
function* fetchData(action) {
  const { payload: { someValue } } = action;
  try {
    const result = yield call(myAjaxLib.post, "/api", { data: someValue });
    yield put({ type: "REQUEST_SUCCEEDED", payload: response });
  } catch (error) {
    yield put({ type: "REQUEST_FAILED", error: error });
  }
}

export function* watchFetchData() {
  yield takeEvery('REQUEST', fetchData);
}

/*
* saga 与 store 的关联后面会详细介绍
*/

/* UI的调用 */
// ----------
dispatch(fetchData({
  type: 'REQUEST',
  payload: {
    someValue: 'xxx'
  }
}))
```

分析上面的两种实现方式，我们发现可以分析出如下的几点：
1. redux-saga 将所有的异步逻辑都集中在 saga.js 中
2. dispatch 依旧以对象作为参数
3. 使用 Generator 来处理异步流程，用同步的方式书写异步代码

## redux 怎样关联 redux-saga
**store.js**
```js
/* store.js */
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from '../reducers'
import rootSaga from '../sagas'

// sagas - 创建 saga 中间件
const sagaMiddleware = createSagaMiddleware()

// middlewares
const middlewares = [
  sagaMiddleware,
]

// Enhancer
const win = window;
const storeEnhancers = compose(
  applyMiddleware(...middlewares),
  (win && win.devToolsExtension) ? win.devToolsExtension() : (f) => f,
);

const store = createStore(
  reducer,
  storeEnhancers
)

// sagas - 开启 sagaMiddleware 对 rootSaga 中 action 的监听
sagaMiddleware.run(rootSaga)

export default store
```
上面的代码主要做了一下几点：
1. 创建 saga 中间件： `const sagaMiddleware = createSagaMiddleware()`
2. 将 saga中间件应用到 redux 中：`applyMiddleware(...middlewares)`
3. 开启 sagaMiddleware 对 rootSaga 中 action 的监听

**rootSaga.js**   
```js
import { delay } from 'redux-saga'
import { put, takeEvery, all, call } from 'redux-saga/effects'

export function* helloSaga() {
  console.log('Hello Sagas!');
}

// Our worker Saga: 将异步执行 increment 任务
export function* incrementAsync() {
  yield call(delay, 1000)
  yield put({ type: 'INCREMENT' })
}

// Our watcher Saga: 在每个 INCREMENT_ASYNC action 调用后，派生一个新的 incrementAsync 任务
export function* watchIncrementAsync() {
  console.log('watchIncrementAsync')
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync()
  ])
}
```
`sagaMiddleware.run(rootSaga)` 开启监听时会执行 rootSaga （在 rootSaga 中可以进行一些初始化操作）。

**saga监听工作流程图**
![](./01.jpg)
简要分析工作流程：
1. 每次执行 store.dispatch(action)，数据流都会经过 sagaMiddleware
2. 对 sagaMiddleware 匹配到 action.type 执行对应 saga 函数内的逻辑

## redux-saga 使用实例
利用 sagaMiddleware 的监听和 saga 是 generator 的特性我们可以更加方便的处理逻辑，以下是一些具体的示例：
### 日志记录

### 登陆流程的业务流简化


### 请求超时和多个异步操作的 race


### 无阻塞调用


### 同时执行多个任务

### 取消任务

### yield* 顺序组合任务


## API 介绍

## 参考链接
- [redux-saga 官方文档]()
- [Redux-Saga 漫谈](https://zhuanlan.zhihu.com/p/35437092?group_id=966592505576407040)
- [Redux-Saga 初识和总结](https://juejin.im/post/58eb4100ac502e006c45d5c9)
- [Redux-Saga 实用指北](https://juejin.im/post/5ad83a70f265da503825b2b4)
