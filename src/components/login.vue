<template>
    <div class="flex w-full ">
        <div @click="change_state('about')" class="flex flex-col justify-center items-center h-screen pl-5 duration-300" 
        :class="{'w-3/4':(state=='about'),'w-1/4':(state == 'login')}">
            <span class="font-bold text-gray-700 text-7xl">Solarpro</span>
            <span class="font-bold text-gray-500 border-b pl-5 text-5xl">Admin</span>
        </div>
        <div @click="change_state('login')" :class="{'w-3/4':(state=='login'),'w-1/4 opacity-50':(state == 'about')}" 
        class="duration-300 h-screen w-1/2 flex flex-col justify-center items-center bg-gray-100 border-l border-blue-200">
            <form class="flex flex-col justify-center items-center" @submit.prevent="connect" action="/" method="post">
                <div class="duration-300 h-2" :class="{'h-14':error_login.isOn}">
                    <transition name="fade">
                        <div  v-if="error_login.isOn" class=" p-2 rounded border bg-red-500">
                            <span> {{ error_login.message }} </span>
                        </div>
                    </transition>
                </div>
                <div class="my-2">
                    <input id="u_login" v-model="user.login" type="text" class="input" placeholder="Identifiant">
                </div>
                <div class="my-2">
                    <input id="u_pass" v-model="user.pass" type="password" class="input" placeholder="Mot de passe ...">
                </div>
                
                <div class="my-2 justify-center flex">
                    <button class="bt rounded-full duration-300">Connexion</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
			user:{
				login:'',
				pass:''
			},
            error_login:{
                isOn:false,
                message:''
            },
            id_time_out:-1,
            state:'about' // 2 états possibles about/login
        }
    },

    methods:{
        connect(){
            let self = this
           this.$http.post('p/auth',this.user).then(res =>{
               if(res.body.status){

               }else{
                   document.querySelector('#u_login').focus()
                   self.set_error_login(res.body.message)
               }
           },res=>{

           })
        },
        set_error_login(message){
            this.error_login.isOn = true
            this.error_login.message = message
            let self = this
            if(this.id_time_out != -1 ){
                clearTimeout(this.id_time_out)
            }
            this.id_time_out = setTimeout(() => {
                this.error_login.isOn = false
                this.error_login.message = ''

                self.id_time_out = -1
            }, 2000);
        },
        change_state(state){
            if(state == 'login' && this.state != 'login'){
                document.querySelector('#u_login').focus()
            }
            this.state = state
        }
    }
}
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>