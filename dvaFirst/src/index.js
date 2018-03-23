import dva from 'dva';
import './index.css';
import {browserHistory} from "dva/router";
// import {TestPage,TestPageClass} from "./components/morePage";
// 1. Initialize
// const app = dva();
console.log(browserHistory);
const app = dva({
    // history:browserHistory,
    // initialState:{
    //     global:1
    // }
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require("./models/app"));

// 4. Router
app.router(require("./router").default);
 
// 5. Start
app.start('#root');
