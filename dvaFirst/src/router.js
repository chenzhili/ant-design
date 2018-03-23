import React from 'react';
import { Router, Route, Switch,Redirect } from 'dva/router';
// import IndexPage from './routes/IndexPage';
// import Products from './routes/Products';
// import Dashboard from "./routes/Dashboard";
import App from "./routes/app";
import dynamic from 'dva/dynamic' 
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US' //用于国际化的
import zhCN from 'antd/lib/locale-provider/zh_CN';  


function Test(){
  return (
    <h1>就看你出来不</h1>
  );
}
function RouterConfig({ history,app}) { 
  // console.log(Dashboard);
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
    <LocaleProvider locale={zhCN}>
      <App  path="/app" >   {/** 这里的 公共部分写在这里，并且通过 自带的 props 的 children 子组件 渲染 路由，但是为啥不会 不会渲染 呢，这个问题没懂**/}
      {/***这种写法不行了，应该吧 app 做成 一级路由，下面的路由系统做成二级路由，以路由系统，这种写法 不是 4.0的了**/}
        <Test/>
        <Router history={history}>
          <Switch>
            <Route path="/" exact render={()=>(<Redirect to="/Dashboard"/>)} />
            <Route path="/login" component={dynamic({
              app,
              component:()=>import("./routes/Login/Login"),
              models:()=>[import("./models/Login")] 
            })}/>
            <Route path="/dashboard" component={dynamic({
              app,
              component:()=>import("./routes/Dashboard/Dashboard"),
              models:()=>[import("./models/Dashboard")]
            })}/>
          </Switch>
        </Router>
      </App>
      
    </LocaleProvider>
  );
}

export default RouterConfig;
