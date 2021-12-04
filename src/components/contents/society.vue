<template>
    <div class="flex">
        <div class="flex-grow duration-300 max-h-screen overflow-auto">
            <!-- Menu liste emplacement -->
            <div class="p-2 sticky top-0 bg-gray-100 shadow-lg">
                <div class="border-b mb-1 flex justify-center items-center pb-2">
                    <div class="flex flex-grow  items-center">
                        <div class="flex justify-center items-center">
                            <span class="mr-2 text-xl text-gray-700"> Liste des  </span>
                            <cSelect @selected="select_society" :datas="type_select" label="label"></cSelect>
                        </div>
                        <div class="ml-5" >
                            <input type="text" placeholder="Recherche ..." class="input" v-model="search_soc">
                        </div>
                    </div>
                    <button v-if="!in_add_dialog" @click="show_dialog(true)" class="ml-2 bt rounded-full flex justify-center items-center"> 
                        <span class="material-icons"> add </span>
                        <span> Ajouter </span>
                    </button>
                </div>
            </div>

            <!-- //la liste des élements -->
            <div class="p-2">
                <div class="" v-if="data_soc_list.length > 0">
                    <div @click="set_index_selected(i)" v-show="match_search(d)" class="flex border rounded my-2 flex-col cursor-pointer" :class="(i == index_selected)?'shadow-lg border-dashed border-2 border-green-400':''" v-for="d,i in data_soc_list" :key="d.id">
                        <span class="font-bold text-lg bg-gray-200 p-2"> {{ d.label }} </span>
                        <div class="flex flex-col p-2">
                           <span class=""> Login : <span> {{ d.login }} </span> </span>
                            <span class=""> Nombre d'emplacement : <span> {{ d.nb_emplacement}} </span>  </span> 
                        </div>
                    </div>
                </div>
                <div v-else class="flex justify-center items-center">
                    <span class="text-xl">La liste est vide.</span>
                </div>
            </div>
        </div>

        <!-- Ajout Regisseur ou annonceur -->
        <div class="h-max-screen overflow-auto border-r duration-300 "  v-if="in_add_dialog" :style="(in_add_dialog)?{width:'300px'}:{width:'0px'}">
                <div class="p-2 flex justify-center items-center rounded-lg border m-2">
                    <span class="text-xl flex-grow">Ajout {{ soc_selected.label_alt }}</span>
                    <button @click="show_dialog(false)" class="bt flex justify-center items-center rounded-full">
                        <span class="material-icons">clear</span>
                    </button>
                </div>
                
                <div class="duration-300 h-0 flex justify-center items-center" :class="(info.isOn)?'h-14':'h-0'">
                    <transition name="fade">
                        <div class="rounded p-2 " :class="(info.success)?'bg-green-400':'bg-red-400'" v-if="info.isOn">
                            <span> {{ info.message }} </span>
                        </div>
                    </transition>
                </div>

                <div class="p-2 flex justify-center items-center">
                    <form @submit.prevent="post_soc" action="post">
                        <div class="flex flex-col">
                            <span class="text-xs my-1"> Login * </span>
                            <input type="text" class="input" autofocus placeholder="Login ..." v-model="soc_model.login">
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs my-1"> Mot de passe * </span>
                            <input type="text" class="input" placeholder="Mot de passe ..." v-model="soc_model.pass">
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs my-1"> Libellé * </span>
                            <input type="text" class="input" placeholder="Libellé ..." v-model="soc_model.label">
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs my-1"> Libellé alt </span>
                            <input type="text" class="input" placeholder="Libellé alt..." v-model="soc_model.label_alt">
                        </div>
                        <div class="pt-2 mt-2 border-t flex justify-end">
                            <button class="bt rounded-full flex justify-center items-center"> 
                                <span class="material-icons">add_circle</span>
                                <span>Créer</span>
                            </button>
                        </div>
                    </form>
                </div>
        </div>

        <div class="  max-h-screen overflow-auto border-r duration-300 " v-if="index_selected != -1 && !on_modif" :style="(index_selected != -1)?{width:'300px'}:{width:'0px'}">
            <div class="p-2 m-2 rounded-lg border">
                <span class="p-2 text-lg"> Information sur {{ soc_selected.label_alt }} </span>
            </div>
            <div class="m-2 p-2 rounded-lg border">
                <div class="border rounded-lg p-2 my-1">
                    <span> Libellé : </span><span> {{ data_soc_info.label }} </span>
                </div>
                <div class="border rounded-lg p-2 my-1">
                    
                    <div class="flex justify-center items-center">
                       <div class="flex-grow">
                            <span> {{ (soc_selected.code == 'regisseur')?'Nombre annonceurs':'Nombre regisseurs' }} : </span><span> {{ data_soc_info.nb_abonnement }} </span>
                       </div>
                        <button @click="toggle_show_subs" v-if="(parseInt(data_soc_info.nb_abonnement) > 0)" class="flex justify-center items-center">
                            <span class="material-icons"> {{ (subs.show)?'expand_less':'expand_more' }} </span>
                        </button>
                    </div>
                    <!-- Liste emplacement -->
                    <!-- -->
                    <div class="pl-3 duration-300 flex flex-col" v-if="subs.show" >
                        <span class="text-sm" v-for="d in subs.list" :key="d.id">  
                            {{d.label}}
                        </span>
                    </div>
                </div>
                <div class="border rounded-lg p-2 my-1">
                    <div class="flex justify-center items-center">
                       <div class="flex-grow">
                            <span class="">  Nombre emplacement : </span><span> {{ data_soc_info.nb_emplacement }} </span> 
                       </div>
                        <button @click="toggle_show_places" v-if="(parseInt(data_soc_info.nb_emplacement) > 0)" class="flex justify-center items-center">
                            <span class="material-icons"> {{ (places.show)?'expand_less':'expand_more' }} </span>
                        </button>
                    </div>
                    <!-- Liste emplacement -->
                    <!-- -->
                    <div class="pl-3 duration-300 flex flex-col" v-if="places.show" >
                        <span class="text-sm" v-for="d in places.list" :key="d.id">  
                            {{d.label}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="m-2 sticky bottom-0 rounded-lg border shadow-lg p-2 flex items-center">
                <div class="flex-grow">
                    <button @click="delete_soc" class="flex justify-center items-center bt rounded-full">
                        <span class="material-icons"> delete </span>
                        <span>  Supprimer </span>
                    </button>
                </div>
                <button @click="show_modif(true)" class="flex justify-center items-center bt rounded-full">
                    <span class="material-icons"> edit </span>
                    <span>  Modifier </span>
                </button>
            </div>
        </div>

        <!-- Affichage par defaut à droite -->

        <div style="width:300px" class="flex max-h-screen overflow-auto border-r duration-300 h-screen justify-center items-center " v-if="in_add_dialog == false && index_selected == -1 && !on_modif">
            <span class="text-gray-500 text-center"> Cliquer sur un élément pour voir les infos </span>
        </div>
        

        <!-- Affichage modification -->
        <div style="width:300px" class="flex flex-col max-h-screen overflow-auto border-r duration-300 h-screen  " v-if="on_modif && index_selected != -1">
                <div class="p-2 flex justify-center items-center rounded-lg border m-2">
                    <span class="text-xl flex-grow">Modification {{ soc_selected.label_alt }}</span>
                    <button @click="show_modif(false)" class="bt flex justify-center items-center rounded-full">
                        <span class="material-icons">clear</span>
                    </button>
                </div>
                
                <div class="duration-300 h-0 flex justify-center items-center" :class="(info.isOn)?'h-14':'h-0'">
                    <transition name="fade">
                        <div class="rounded p-2 " :class="(info.success)?'bg-green-400':'bg-red-400'" v-if="info.isOn">
                            <span> {{ info.message }} </span>
                        </div>
                    </transition>
                </div>

                <div class="p-2 flex justify-center items-center">
                    <form @submit.prevent="modif_soc" action="post">
                        <div class="flex flex-col">
                            <span class="text-xs my-1"> Login * </span>
                            <input type="text" class="input" autofocus placeholder="Login ..." v-model="soc_modif_model.login">
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs my-1"> Mot de passe * </span>
                            <input type="text" class="input" placeholder="Mot de passe ..." v-model="soc_modif_model.pass">
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs my-1"> Libellé * </span>
                            <input type="text" class="input" placeholder="Libellé ..." v-model="soc_modif_model.label">
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs my-1"> Libellé alt </span>
                            <input type="text" class="input" placeholder="Libellé alt..." v-model="soc_modif_model.label_alt">
                        </div>
                        <div class="pt-2 mt-2 border-t flex justify-end">
                            <button class="bt rounded-full flex justify-center items-center"> 
                                <span class="material-icons">add_circle</span>
                                <span>Valider modification</span>
                            </button>
                        </div>
                    </form>
                </div>
        </div>

    </div>
</template>

<script>
import cSelect from "@/utils/c-select.vue"

export default {
    components:{cSelect},
    data(){
        return{
            type_select:[
                {label:"Regisseurs",label_alt:"Régisseur",code:"regisseur"},
                {label:"Annonceurs",label_alt:"Annonceur",code:"annonceur"}
            ],
            soc_selected:{},
            data_soc_list:[],
            in_add_dialog:false,

            soc_model:{
                login:"",
                pass:"",
                label:"",
                label_alt:"",
                type:""
            },
            soc_modif_model:{
                login:"",
                label:"",
                label_alt:"",
                type:""
            },
            info:{
                success:'',
                message:'',
                isOn:false,
                idTimeout:-1
            },
            style_dialog:{marginTop:"-100px",opacity:0},
            index_selected:-1,
            data_soc_info:{},
            subs:{
                list:[],
                show:false
            },
            places:{
                list:[],
                show:false
            },
            on_modif:false,
            on_info:false,
            search_soc:""
        }
    },
    watch:{
        index_selected(t){
            this.places.show = false
            this.places.list = []
            this.subs.show = false
            this.subs.list = []
            if(t != -1){
                this.get_info_society()
            }else{
                
            }
            this.on_modif = false
        },
        on_modif(t){
            if(t){
                this.soc_modif_model = {
                    login:this.data_soc_info.login,
                    label:this.data_soc_info.label,
                    pass:this.data_soc_info.pass,
                    label_alt:this.data_soc_info.label_alt,
                }
            }
        }
    },
    methods:{
        select_society(i){
            this.soc_selected = this.type_select[i]
            this.soc_model.type = this.soc_selected.code

            this.index_selected = -1
            this.recup_list_society()
        },
        recup_list_society(){
            let self = this
            this.$http.get('a/society?type='+this.soc_selected.code).then(res =>{
                if(res.body.status){
                    self.data_soc_list = res.body.soc
                }else{
                    alert(res.body.message)
                }
            },err =>{

            })
        },
        post_soc(){
            let self = this

            this.$http.post('a/society',this.soc_model).then(res =>{
                if(res.body.status){
                    self.soc_model = {
                        login:"",
                        pass:"",
                        label:"",
                        label_alt:"",
                        type:self.soc_selected.code,
                    }

                    self.show_dialog(false)
                    self.recup_list_society()
                }else{
                    self.show_info(res.body.status,res.body.message)
                }
            },err =>{

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

        show_dialog(t){
            let self = this
            this.in_add_dialog = t
            if(t){
                this.index_selected = -1
            }
        },
        set_index_selected(i){
            this.in_add_dialog = false
            this.index_selected = i
        },
        get_info_society(){
            let self = this
            this.$http.get('a/society/'+this.data_soc_list[this.index_selected].id+"/"+this.soc_selected.code).then(res =>{
                if(res.body.status){
                    self.data_soc_info = res.body.soc
                }
            })
        },

        toggle_show_places(){
            this.places.show = !this.places.show 
            if(this.places.show){
                let self = this
                this.$http.get('a/society/places/'+this.data_soc_list[this.index_selected].id+"/"+this.soc_selected.code).then(res=>{
                    if(res.body.status){
                        self.places.list = res.body.places
                    }else{
                        alert(res.body.message)
                    }
                })
            }
        },
        toggle_show_subs(){
            this.subs.show = !this.subs.show 

            if(this.subs.show){
                let self = this
                this.$http.get('a/society/subs/'+this.data_soc_list[this.index_selected].id+"/"+this.soc_selected.code).then(res=>{
                    if(res.body.status){
                        self.subs.list = res.body.subs
                    }else{
                        alert(res.body.message)
                    }
                })
            }
        },
        delete_soc(){
            let t = confirm('Voulez vous vraiment proceder à la suppression ?')
            if(t){
                let self = this
                this.$http.delete('a/society/'+this.data_soc_list[this.index_selected].id+"/"+this.soc_selected.code).then(res =>{
                    if(res.body.status){
                        self.recup_list_society()
                        self.index_selected = -1
                    }else{  
                        alert(res.body.message)

                    }
                },err =>{
                    alert('Erreur de réseau')
                })
            }
        },
        show_modif(t){
            this.on_modif = t
        },
        modif_soc(){
            let self = this
            this.$http.put('a/society/'+this.data_soc_list[this.index_selected].id,this.soc_modif_model).then(res=>{
                if(res.body.status){
                    self.show_modif(false)
                    self.get_info_society()
                    self.recup_list_society()
                }else{
                    self.show_info(res.body.status,res.body.message)
                }
            },err =>{
                self.show_info(false,"Erreur réseau")
            })
        },

        //Pour la recherche dans search_soc
        match_search(d){
            if(this.search_soc == ""){
                return true
            }else{
                let r = new RegExp('.?'+this.search_soc+'.?','gi')
                if(d.label.match(r)!=null){
                    return true
                }else{
                    return false
                }
            }
        }
    }
}
</script>

