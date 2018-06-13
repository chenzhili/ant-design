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
                case "2":
                yield put(routerRedux.replace("dnd"));
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