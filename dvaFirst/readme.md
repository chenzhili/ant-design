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

        *IV、app.model(model);
            包含5个属性：
                1、namespace:model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间

                2、state:初始值

                3、reducers:
                    以 key/value 格式定义 reducer。用于处理同步操作，唯一可以修改 state 的地方。由 action 触发。

                    格式为 (state, action) => newState 或 [(state, action) => newState, enhancer]
                
                4、effects
                    以 key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，可以和服务器交互，可以获取全局 state 的数据等等


