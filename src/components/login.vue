<template>
    <div class="flex w-full ">
        <div @click="change_state('about')" class="flex flex-col justify-center bg-green-400 items-center h-screen pl-5 duration-300" 
        :class="{'w-full':(state=='about'),'hidden':(state == 'login')}">
            <span class="font-bold text-gray-700 text-7xl">Solarpro</span>
            <span class="font-bold text-gray-600 pl-5 text-5xl">Admin</span>

            <button @click="change_state('login')" class="bt rounded-full animate-bounce mt-5" v-if="state == 'about'">Connexion</button>
        </div>
        <div @click="change_state('login')" :class="{'w-full':(state=='login'),'hidden opacity-50':(state == 'about')}" 
        class="duration-300 h-screen w-1/2 flex flex-col justify-center items-center bg-gray-100 border-l border-blue-200">
            <form class="flex flex-col justify-center items-center" @submit.prevent="connect" action="/" method="post">
                <div class="border-b pb-3 mb-2 ">
                    <span class="text-3xl"> Solarpro </span> <span class="text-xl">Admin</span>
                </div>
                <div class="duration-300 h-2 z-0" :class="{'h-14':msg_info.active}">
                    <transition name="fade">
                        <div  v-if="msg_info.active" class=" p-2 rounded border" :class="{'bg-red-500':!msg_info.success,'bg-green-500':msg_info.success}">
                            <span> {{ msg_info.message }} </span>
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
            msg_info:{
                active:false,
                success:false,
                message:''
            },
            id_time_out:-1,
            state:'login' // 2 états possibles about/login
        }
    },

    methods:{
        connect(){
            let self = this
           this.$http.post('p/auth',this.user).then(res =>{
               if(res.body.status){
                   self.show_msg_info(res.body.message,true)
                   self.$store.commit('setUser',res.body.user)
                   setTimeout(() => {
                       
                   }, 1000);
               }else{
                   document.querySelector('#u_login').focus()
                   self.show_msg_info(res.body.message)
               }
           },res=>{

           })
        },
        show_msg_info(message,success = false){
            this.msg_info.active = true
            this.msg_info.message = message
            this.msg_info.success = success
            let self = this
            if(this.id_time_out != -1 ){
                clearTimeout(this.id_time_out)
            }
            this.id_time_out = setTimeout(() => {
                self.msg_info.active = false
                self.msg_info.message = ''

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
<style >
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>