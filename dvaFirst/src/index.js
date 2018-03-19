import dva from 'dva';
import './index.css';
import {browserHistory} from "dva/router";
// import {TestPage,TestPageClass} from "./components/morePage";
// 1. Initialize
// const app = dva();
console.log(browserHistory);
const app = dva({
    history:browserHistory
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);
// app.model(require("./models/products").default);

// 4. Router
app.router(require('./router').default);
// app.router(()=>(<TestPageClass/>))
 
// 5. Start
app.start('#root');
