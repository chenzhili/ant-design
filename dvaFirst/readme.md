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

        II、记清楚 数据 和 view之间的通讯渲染 是通过 state，所以 connect 也只是 把改变后的 state的值传递给 组件，包括对应的 一些信息；当然 包括 任何传递中都默认传递的 dispatch 方法；用于 触发  action ；这样就形成一个 闭环；

    2、个人对于 dispatch 的理解，其实可以分成两类 action的触发；
        I、view 到 models 通过 dispatch 方法 触发 action；
            这里很重要的 就是 type，通过他 匹配对应的models；
            如：dispatch({type:"app/login",payload:任何类型的值});
        II、在 models 中 的 effects 中 通过 put（类似dispatch） 触发 action；向 reducers 发送对应的 type 识别 不同的方法，对数据进行处理

2018/3/20
    1、dva/dynamic 解决组件动态加载问题的 util 方法
        如：
        import dynamic from 'dva/dynamic';

        const UserPageComponent = dynamic({
        app,
        models: () => [
            import('./models/users'),
        ],
        component: () => import('./routes/UserPage'),
        });
        opts 包含：

            app: dva 实例，加载 models 时需要,就是指 第一次实例 dva  const app = dva();指的是这个
            models: 返回 Promise 数组的函数，Promise 返回 dva model
            component：返回 Promise 的函数，Promise 返回 React Component


2018/6/6
    **********************主要是对于react的优化处理******************
    1、对于数据的不可变性：
        由于对于 引用对象的直接赋值属于浅拷贝，就是对于引用类型运用同一个地址，导致 在进行 赋值变量 操作的时候，会导致 props或者state对应的值也会改变；
        从而 开始 想用 深拷贝解决，但是深拷贝会对整个 数据结构都拷贝一份，但是操作只是对于局部的某一些 数据进行操作，这样很消耗内存；
        所以出现了 immutable.js，这种拷贝方式（可以看成一种 升级版的 深拷贝），他会对于 修改的 数据以及 设计到的 祖先元素进行拷贝，其他的数据 进行 和 以前的共享，他是一种 不可变类型，只要 操作 总会 返回新的 数据结构，但是 也是 共享 相同的数据；
    2、对于 react 中 主要优化就是对于 页面渲染的次数，所以 用此可以用 生命周期的 shouldComponentUpadate 进行判断当前数据结构是否需要更新

    3、immutable.js的api
        fromJS,is,merge,mergeDeep
        merge和 mergeDeep的区别：
            就是一个是 浅合并 和 深合并：
            浅合并：指 合并第一层数据，深层次的 引用数据只会被后面的替换
            深合并：就是合并 所有的数据 包括 深层次的

2018/6/14
    对于 dnd 的运用，一定要知道几个必须的量：
    需要进行 dnd 操作的 
    容器 DragDropContext(这个是高阶函数的方式) 或者 DragDropContextProvider(这个是组件的方式)；这个必须放在 可拖动元素的祖先上；
    拖动源： DrageSource 就是一个 高阶函数 类似于 connect ，制定需要拖动的 组件，必须在 connect（连接器） 中 给 组件 传入 connectDragSource: connect.dragSource()；
    拖动目标：DragTarget 跟上面类似，一样在 connect 中 给 组件 传入 connectDropTarget: connect.dropTarget()

