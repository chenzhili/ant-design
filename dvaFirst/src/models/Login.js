import { routerRedux } from 'dva/router'
export default {
    namespace:"Login",
    state:{
        name:"test111",
        age:1,
        isloading:false
    },
    effects:{
        *Login({type,playload},{put,call,select}){
            yield put({type:"show",playload:playload});
            // yield call((...arg)=>{
            //     console.log(arg);
            //     alert(1);
            // })
            yield select((...arr)=>{console.log(arr);})
            yield put(routerRedux.push('/dashboard'));
        }
    },
    reducers:{
        show(...state){
            console.log(state);
            //这里说明 函数有两个参数
            //第一个为：state所有的值，第二个为 发送的一个 action
            return {
                name:"test again",
                isloading:true
            }
        }
    }

};
