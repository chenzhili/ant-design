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
                yield put(routerRedux.replace("TestTable"));
                break;
                case "1":
                yield put(routerRedux.replace("h1"));  
                break;
                case "2":
                yield put(routerRedux.replace("dashboard"));
                break;
                case "3":
                yield put(routerRedux.replace("dnd"));
                break;
                case "4":
                yield put(routerRedux.replace("again"));
                break;
                case "5":
                yield put(routerRedux.replace("sort"));
                break;
                case "6":
                yield put(routerRedux.replace("DndTest"));
                break;
                case "7":
                yield put(routerRedux.replace("DndWork"));
                break;
                case "8":
                yield put(routerRedux.replace("DndAdvance"));
                break;
                case "9":
                yield put(routerRedux.replace("DataManage"));
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