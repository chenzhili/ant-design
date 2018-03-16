import dva from 'dva';
import './index.css';

// 1. Initialize
// const app = dva();
const app = dva({
    initialState: {
        test:[1,2,4,5]
   },
});
console.log(app._store);

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);
// app.model(require("./models/products").default);

// 4. Router
app.router(require('./router').default);
 
// 5. Start
app.start('#root');
