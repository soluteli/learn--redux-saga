# redux-saga 的花式操作

## 基本使用
- 源码目录：`./01-basic`
- 启动命令：`npm run 01-basic`


## takeEvery 实现日志记录器
- 源码目录：`./02-log`
- 启动命令：`npm run 02-log`
- 效果图：

### 代码分析
使用 takeEvery 监听每一个 action，并打印每一次 action 和执行后的 state
```js
/* 02-log/sagas/logSaga.js */
import { take, takeEvery, select } from 'redux-saga/effects'

/* 使用 takeEvery 的方式添加日志功能 */
export function* watchAndLog() {
  yield takeEvery('*', function* logger(action) {
    const state = yield select()
    console.log('action', action)
    console.log('state after', state)
  })
}
```

将 logSaga 添加到 rootSaga
```diff
/* 02-log/sagas/index.js */
+ import { watchAndLog } from './log'

export default function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync(),
+   watchAndLog(),
  ])
}

```

通过上面的步骤，我们就实现了记录所有 action 的操作日志了。

## 监听未来的 action —— take 实现交替登入登出
### take 和 takeEvery
上面的 logSaga 也可以使用 take 来实现：
```js
/* 使用 take 的方式添加日志功能 */
export function* watchAndLog() {
  while (true) {
    const action = yield take('*')
    const state = yield select()

    console.log('action', action)
    console.log('state after', state)
  }
}
```

take 和 takeEvery 都是由 `redux-saga/effects` 提供的 API，他们区别如下：
- takeEvery 在每次 action 被匹配时都被调用, 类似于一个监听事件 Event.on() 。
- take 只会在第一次匹配时调用，类似于一个事件 Event.once()

由于我们在 Generator 函数 watchAndLog 中使用了`while(true)`, 所以 watchAndLog 会对每一个 发起的 action 进行一次处理，这样就实现了面向未来的每一个 action 编程。   

为了更加直观的的说明这个特性，我们再举个例子：   
有一个需求：
1. 前三次点击 hello 按钮打印 'hello', 
2. 第四次点击 hello 按钮打印 'congratulations'
3. 第五次及以后点击 hello 按钮无反应




## fork 实现无阻塞调用



-----------
1. 环境配置
2. 异步
3. take
4. fork -- cancel
5. 任务并发 all
6. 任务race 
7. yield* 排序

