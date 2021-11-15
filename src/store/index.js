import Vuex from 'vuex'

const store = new Vuex.Store({
    state:{
        user:{},
        status_connect:false
    },
    getters:{
        getUser(state){
            return state.user
        }
    },
    mutations:{
        setUser:(state,u)=>{
            state.user = u
            state.status_connect = true
        }
    }
})

export default store