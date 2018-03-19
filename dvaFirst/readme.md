2018/3/16
    1、对于 dva的 API
        I、创建应用
            const app = dva(opts);
            opts主要包含：
                history：就是修改 前端路由的方式，hash或者其他的方式
                initialState：指定初始数据
                包括其他的hooks
                地址：https://github.com/dvajs/dva/blob/master/docs/API_zh-CN.md#appusehooks
        II、app.router(({history,app=>RouterConfig));
          注意：这里相当于就是页面渲染的东西，单页应用可以用 像 react-router 的方式进行，如果是多页应用 可以 ：
            app.router(()=>(<Component/>))直接渲染组件

        III、app.start(页面元素选择器);启动应用

        IV、app.use(hooks);用来加载插件的

        *V、app.model(model);
            包含5个属性：
                1、namespace:model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间

                2、state:初始值

                *3、reducers:（处理数据）
                    以 key/value 格式定义 reducer。用于处理同步操作，唯一可以修改 state 的地方。由 action 触发。

                    格式为 (state, action) => newState 或 [(state, action) => newState, enhancer]

                    (state, action) => newState 或 [(state, action) => newState, enhancer]

                    state:还未改变的老的状态；
                    action:就是当前 这个触发 put 对应的 {type:"识别的类型",[playload]}
                    "中括号的内容可有可无"
                
                *4、effects（接受数据）
                    以 key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，可以和服务器交互，可以获取全局 state 的数据等等
                    effects功能函数有四个主要功能：
                    put  用来发起一条action,就是会在 接收数据后，用这个在 models 内部发起一个 action 让 reducers 知道，进行数据处理

                    call 以异步的方式调用函数，执行对应的异步操作

                    select 从state中获取相关的数据

                    take 获取发送的数据

                    *(action, effects) => void 或 [*(action, effects) => void, { type }]
                    这种 构造器函数，
                    action：指 从 view 传过来的 action
                    effects:指 上面的 put、call等不同的操作
                *5、subscriptions（监听数据）
                    以 key/value 格式定义 subscription。subscription 是订阅，用于订阅一个数据源，然后根据需要 dispatch 相应的 action。在 app.start() 时被执行，数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。

                    格式为 ({ dispatch, history }, done) => unlistenFunction。

付费书籍：http://huziketang.com/books/react/lesson38
阅读码：vuJ58M1lKB

2018/3/19
    1、对于在 models 和 组件 进行连接的时候，就是connect调用的时候；
        目的：就是 把models的数据 以 props的方式传递给组件；
        理解：
        I、connect 的 简写
        function connect(props){
            return function(Component){
                return <Component ...props/>
            }
        }

        II、记清楚 数据 和 view之间的通讯渲染 是通过 state，所以 connect 也只是 把改变后的 state的值传递给 组件，不会有其他；当然 包括 任何传递中都默认传递的 dispatch 方法；用于 触发  action ；这样就形成一个 闭环；

    2、个人对于 dispatch 的理解，其实可以分成两类 action的触发；
        I、view 到 models 通过 dispatch 方法 触发 action；
            这里很重要的 就是 type，通过他 匹配对应的models；
            如：dispatch({type:"app/login",payload:任何类型的值});
        II、在 models 中 的 effects 中 通过 put（类似dispatch） 触发 action；向 reducers 发送对应的 type 识别 不同的方法，对数据进行处理
