export default {
    namespace:"Dashboard",
    state:{
        aa:"没有state"
    },
    reducers:{
        testMenu(state,action){
            console.log(state);
            console.log(action);
            return {
                ...state,...action
            }
        }
    }
}