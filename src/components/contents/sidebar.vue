<template>
    <div class="h-screen max-h-screen flex flex-col overflow-auto" :style="sidebar_style">
        <div class="p-2 border-b  border-gray-300 text-gray-700">
            <div class="">
                <span class="text-3xl"> Solarpro </span> <span class="text-xl">Admin</span>
            </div>
            <div class="flex justify-center items-center">
                <div class="flex-grow ">
                    <span>Bonjour, </span><span class="font-bold">{{ $store.state.user.login }}</span>
                </div>
                <button @click="deconnexion" class="bt rounded-full flex justify-center items-center">
                    <span class="material-icons">
                        logout
                    </span>
                </button>
            </div>
        </div>
        <div class="p-2 text-sm">
            <router-link class="menu_sidebar" 
            :to="{name:'home'}">
                <span class="material-icons">
                    home
                </span>
                <span class="ml-5">
                    Accueil
                </span>
            </router-link>

            <router-link class="menu_sidebar" 
            :to="{name:'emplacement'}">
                <span class="material-icons text-blue-700">
                    place
                </span>
                <span class="ml-5">
                    Emplacement
                </span>
            </router-link>

            <router-link class="menu_sidebar" 
            :to="{name:'society'}">
                <span class="material-icons text-purple-500">
                    groups
                </span>
                <span class="ml-5">
                    Regisseurs/Annonceurs
                </span>
            </router-link>

            <router-link class="menu_sidebar" 
            :to="{name:'stat'}">
                <span class="material-icons text-pink-700">
                    analytics
                </span>
                <span class="ml-5">
                    Statistiques
                </span>
            </router-link>

            <router-link class="menu_sidebar" 
            :to="{name:'user'}">
                <span class="material-icons">
                    face
                </span>
                <span class="ml-5">
                    Utilisateur
                </span>
            </router-link>

            <router-link class="menu_sidebar" 
            :to="{name:'settings'}">
                <span class="material-icons">
                    settings
                </span>
                <span class="ml-5">
                    Paramètres
                </span>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            sidebar_style:{
                minWidth:250+'px'
            }
        }
    },
    methods:{
        deconnexion(){
            let self = this
            this.$http.get('a/deconnect').then(res =>{
                if(res.body.status){
                    self.$store.commit('deconnect')
                }else{
                    alert(res.body.message)
                }
            },err =>{

            })
        }
    }
}
</script>