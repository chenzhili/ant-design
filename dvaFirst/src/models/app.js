import { routerRedux } from 'dva/router'
export default {
    namespace:"app",
    state:{
        
    },
    effects:{
        *child({playload},{put}){
            console.log(routerRedux); 
            switch(playload){
                case "0":
                yield put(routerRedux.replace("h1"));  
                break;
                case "1":
                yield put(routerRedux.replace("dashboard"));
                break;
                default:
                yield put(routerRedux.replace("h1"));
                
            }
        }
    },
    reducers:{},
    subscription:{

    }
}