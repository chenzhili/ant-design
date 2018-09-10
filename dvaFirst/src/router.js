import React from 'react';
import { Router, Route, Switch,Redirect } from 'dva/router';
// import IndexPage from './routes/IndexPage';
// import Products from './routes/Products';
// import Dashboard from "./routes/Dashboard";
// import App from "./routes/app";
import dynamic from 'dva/dynamic' 
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US' //用于国际化的
import zhCN from 'antd/lib/locale-provider/zh_CN';  


function RouterConfig({history,app}) { 
  // console.log(Dashboard);
  let App = dynamic({ 
    app,
    component:()=>import("./routes/app"),
    // models:()=>[import("./models/Dashboard")] 
  })
  let DataManage = dynamic({
    app,
    component:()=>import("./routes/DataManage/DataManage"),
    models:()=>[import("./models/DataManage/DataManage")]
  });
  // console.log(app);
  function Main(props){
    return (
      <App {...props} DataManage={DataManage}></App>
    );
  }
  return (
    // <LocaleProvider locale={zhCN}>
    //   <Router history={history}>
    //   <Switch>
    //     <Route path="/" exact render={()=>(<Redirect to="/Dashboard"/>)} />
    //     <Route path="/login" component={dynamic({
    //       app,
    //       component:()=>import("./routes/Login/Login"),
    //       models:()=>[import("./models/Login")] 
    //     })}/>
    //     <Route path="/dashboard" component={dynamic({
    //       app,
    //       component:()=>import("./routes/Dashboard/Dashboard"),
    //       models:()=>[import("./models/Dashboard")]
    //     })}/>
    //     {/* <Route path="/Products" exact component={Products}/> */}
    //   </Switch>
    // </Router>
    // </LocaleProvider>

    //4.0以下的 路由配置写法，用 children的 方式；
    // <LocaleProvider locale={zhCN}>
    //   <App  path="/app" >   {/** 这里的 公共部分写在这里，并且通过 自带的 props 的 children 子组件 渲染 路由，但是为啥不会 不会渲染 呢，这个问题没懂**/}
    //   {/***这种写法不行了，应该吧 app 做成 一级路由，下面的路由系统做成二级路由，以路由系统，这种写法 不是 4.0的了**/}
    //     <Test/>
    //     <Router history={history}>
    //       <Switch>
    //         <Route path="/" exact render={()=>(<Redirect to="/Dashboard"/>)} />
    //         <Route path="/login" component={dynamic({
    //           app,
    //           component:()=>import("./routes/Login/Login"),
    //           models:()=>[import("./models/Login")] 
    //         })}/>
    //         <Route path="/dashboard" component={dynamic({
    //           app,
    //           component:()=>import("./routes/Dashboard/Dashboard"),
    //           models:()=>[import("./models/Dashboard")]
    //         })}/>
    //       </Switch>
    //     </Router>
    //   </App>
    // </LocaleProvider> 

    //4.0的写法结构
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/" exact render={()=>(<Redirect to="/app"/>)}></Route>
          <Route path="/app" component={Main}/>
          <Route paht="/login" component={dynamic({
            app,
            component:()=>import("./routes/Login/Login"),
              models:()=>[import("./models/Login")] 
          })}/>
        </Switch>
      </Router>
    </LocaleProvider>

  );
}

export default RouterConfig;
