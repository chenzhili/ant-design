import React from 'react';
import { Router, Route, Switch,Redirect } from 'dva/router';
// import IndexPage from './routes/IndexPage';
// import Products from './routes/Products';
// import Dashboard from "./routes/Dashboard";
import dynamic from 'dva/dynamic' 
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US' //用于国际化的
import zhCN from 'antd/lib/locale-provider/zh_CN';  


function RouterConfig({ history,app}) { 
  // console.log(Dashboard);
  return (
    <LocaleProvider locale={zhCN}>
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
          component:()=>import("./routes/Dashboard/Dashboard")
        })}/>
        {/* <Route path="/Products" exact component={Products}/> */}
      </Switch>
    </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
