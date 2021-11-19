<template>
    <div class="p-2">
        <!-- menu création -->

        <!-- Menu liste utilisateur -->
        <div class="">
            <div class="border-b mb-3 flex items-center pb-2">
                <span class="text-xl text-gray-700 flex-grow "> Liste des utilisateurs - </span>
                <button @click="show_add_user(true)" class="ml-2 bt rounded-full flex justify-center items-center"> 
                    <span class="material-icons"> add </span>
                    <span> Ajouter </span>
                </button>
            </div>
            <!-- list -->
            <div class="">
                <ctable v-if="users.list.length != 0" @on_view="view_user" @on_delete="delete_user"  :_head="users.head" :_list="users.list" _key="login" ></ctable>
                <div class="w-full flex justify-center items-center" v-else>
                    <span class="text-xl text-gray-600"> Aucun utiisateur à afficher. </span>
                </div>
            </div>
        </div>

        <!-- Boîtes de diaogue -->
        <div v-if="on_add_user"  class="fixed flex justify-center items-center top-0 left-0 w-screen h-screen bg-gray-800 bg-opacity-80">
            <div :style="{minWidth:400+'px'}" class="bg-gray-100 border flex flex-col border-green-400 rounded shadow-lg">
                <div class="border-b p-2 bg-green-400 flex">
                    <span class="flex-grow text-2xl text-gray-700 font-bold">Ajout d'un utilisateur</span>
                    <button @click="show_add_user(false)" class="w-8 h-8 rounded-full flex justify-center items-center text-gray-600
                     hover:text-gray-800 duration-300"> <span class="material-icons">clear</span> </button>
                </div>
                <div class="duration-300 h-0 flex justify-center items-center" :class="(info.isOn)?'h-14':'h-0'">
                    <div class="rounded p-2 " :class="(info.success)?'bg-green-400':'bg-red-400'" v-if="info.isOn">
                        <span> {{ info.message }} </span>
                    </div>
                </div>
                <form @submit.prevent="post_add_user" action="/" method="post">
                    <div class="mt-2 p-2 flex">
                        <div class="flex flex-col pr-2">
                            <div class="mt-1 flex flex-col">
                                <span class="text-sm text-gray-600"> Nom ... </span>
                                <input type="text" class="input" placeholder="Nom ..." v-model.trim="users.model.nom">
                            </div>
                            <div class="mt-1 flex flex-col">
                                <span class="text-sm text-gray-600"> Prénom ... </span>
                                <input type="text" class="input" placeholder="Prénom ..." v-model.trim="users.model.prenom">
                            </div>
                            <div class="mt-1 flex flex-col">
                                <span class="text-sm text-gray-600"> Login ... </span>
                                <input type="text" class="input" placeholder="Login ..." v-model.trim="users.model.login">
                            </div>
                        </div>
                        <div class="pl-2 flex flex-col">
                            <div class="mt-1 flex flex-col">
                                <span class="text-sm text-gray-600"> Type ... </span>
                                <select name="" id="" class="input" v-model="users.model.type">
                                    <option value="admin">Admin</option>
                                    <option value="personel">Personel</option>
                                </select>
                            </div>
                            <div class="mt-1 flex flex-col">
                                <span class="text-sm text-gray-600"> Mot de passe ... </span>
                                <input type="text" class="input" placeholder="Mot de passe ..." v-model="users.model.pass">
                            </div>
                        </div>
                    </div>
                    <div class="p-2 border-t flex justify-end">
                        <button class="bt-w rounded"> Créer </button>
                    </div>
                </form>
                
            </div>
        </div>
        <!-- Fin boîte de dialogue -->
    </div>
</template>

<script>

import ctable from '@/utils/ctable.vue'

export default {
    components:{ctable},
    data(){
        return{
            test_message:'',

            users:{
                head:[
                    {code:'login',label:'Login'},
                    {code:'prenom',label:'Prénom'},
                    {code:'nom',label:'Nom'},
                    {code:'type',label:'Type'}
                ],
                list:[],
                model:{
                    login:'',
                    prenom:'',
                    nom:'',
                    pass:'',
                    type:'personel'
                }
            },
            info:{
                success:'',
                message:'',
                isOn:false,
                idTimeout:-1
            },
            on_add_user:false,
        }
    },
    methods:{
        init(){
            this.test_message = 'SAlut test de message'
            this.recup_user_list()
        },
        recup_user_list(){
            let self = this
            this.$http.get('a/users').then(res =>{
                console.log(res.body)
                if(res.body.status){
                    self.users.list  = res.body.users
                }else{

                }
            },res => {

            })
        },
        show_add_user(v){
            this.on_add_user = v
        },
        post_add_user(){
            let self = this
            this.$http.post('a/users',self.users.model).then(res =>{
                if(res.body.status){
                    self.show_info(res.body.status,res.body.message,()=>{
                        self.show_add_user(false)
                    })
                    self.recup_user_list()
                    
                }else{
                    self.show_info(res.body.status,res.body.message)
                }
            })
        },
        show_info(success,message,cb){
            this.info.message = message
            this.info.isOn = true
            this.info.success = success

            if(this.info.idTimeout != -1){
                clearTimeout(this.info.idTimeout)
            }

            this.info.idTimeout = setTimeout(() => {
                this.info.isOn = false

                if(cb != undefined){
                    cb()
                }
            }, 2000);
        },
        view_user(i){

        },
        delete_user(i){
            let u = this.users.list[i]
            let c = confirm('Voulez-vous vraiment supprimer l\'utilisateur ayant l\'identifiant '+u.login)
            if(c){
                let self = this
                this.$http.delete('a/users/'+u.id).then(res =>{
                    if(res.body.status){
                        self.recup_user_list()
                        alert(res.body.message)
                    }else{
                        alert(res.body.message)
                    }
                },err =>{

                })
            }
        }
    },
    created(){
        this.init()
    }
}
</script>