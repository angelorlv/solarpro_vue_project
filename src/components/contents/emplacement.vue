<template>
    <div class="p-2">
        <!-- Menu liste emplacement -->
        <div class="">
            <div class="border-b mb-3 flex justify-center items-center pb-2">
                <span class="text-xl text-gray-700 flex-grow"> Liste des emplacements - </span>
                <button @click="show_add_place(true)" class="ml-2 bt rounded-full flex justify-center items-center"> 
                    <span class="material-icons"> add </span>
                    <span> Ajouter </span>
                </button>
            </div>
            <div class="mb-2 sticky top-0 flex items-end  rounded bg-gray-100 border-b shadow-lg p-2">
                <div class=" p-2 border">
                    <div class="flex ">
                        <span class="text-sm">Recherche ... </span>
                    </div>
                    <div class="flex mt-2">
                        <input type="text" placeholder="Rechercher une place ..." class="input mr-" v-model.trim="search">
                        <cSelect :datas="search_cat" @selected="set_select_search_cat" label="label"></cSelect>
                    </div>
                </div>
                <div class="flex flex-col p-2 mx-2 h-full border rounded">
                    <span class="text-sm">Trier par :</span>
                    <cSelect :datas="tri_select" label="label" @selected="set_select_tri"></cSelect>
                </div>
            </div>
            <!-- list -->
            <div class="text-sm">
                <div class="" v-if="places.list.length != 0">
                    <ctable @on_delete="delete_place" @on_view="view_place" :search="search" :col_search="search_cat_selected.code" :_head="places.head" :_list="places.list" _key="id" ></ctable>
                </div>
                <div class="w-full flex justify-center items-center" v-else>
                    <span class="text-xl text-gray-600"> Aucun emplacement à afficher. </span>
                </div>
            </div>
        </div>

        <!-- Boîte de dalogue ajout Place -->
        <addPlace key="ajout_emplacement" :show="on_add_place" @close="show_add_place(false)" @success_add="recup_place_list" :places_list="places.list"></addPlace>
    </div>
</template>

<script>

import ctable from '@/utils/ctable.vue'
import { latLng } from 'leaflet'

import cSelect from '@/utils/c-select.vue'

import addPlace from './emplacement/add_place.vue'

export default {
    components:{ctable,addPlace,cSelect},
    data(){
        return{
            places:{
                head:[
                    {code:'annonceur_name',label:'Annonceur'},
                    {code:'regisseur_name',label:'Régisseur'},
                    {code:'label',label:'Lieu'},
                    {code:'nombre_light',label:'Nb. Limières'},
                    {code:'dimension_panneau',label:'Dim. Panneau'},
                    {code:'date_debut',label:'Date Debut'},
                ],
                list:[],
            },
            tri_select:[
                {label:"Lieu",code:"place.label"},
                {label:"Regisseur",code:"regisseur_name"},
                {label:"Annonceur",code:"annonceur_name"},
            ],
            tri_selected:{},
            on_add_place:false,
            search:'',
            search_cat:[
                {label:"Emplacement",code:"label"},
                {label:"Régisseur",code:"regisseur_name"},
                {label:"Annonceur",code:"annonceur_name"},
            ],
            search_cat_selected:{},
            
        }
    },
    methods:{
        show_add_place(v){
            this.on_add_place = v
        },
        set_select_tri(i){
            this.tri_selected = this.tri_select[i]
            this.recup_place_list()
        },
        recup_place_list(){
            let self = this
            this.$http.get('a/places/opt/'+this.tri_selected.code).then(res=>{
                if(res.body.status){
                    self.places.list = res.body.places
                }else{

                }
            },err =>{
                
            })
        },
        //------------------
        delete_place(i){
            let self = this
            let c = confirm("Voulez vous vraiment supprimer l'emplacement +"+this.places.list[i].label+" !!?")
            if(c){
                this.$http.delete('a/places/'+this.places.list[i].id).then(res =>{
                    if(res.body.status){
                        alert(res.body.message)
                        self.recup_place_list()
                    }else{
                        alert(res.body.message)
                    }
                },err =>{

                })
            }
        },
        view_place(i){
            let id_place = this.places.list[i].id
            this.$router.push({name:'vue_emplacement',params:{id:id_place}})
        },

        set_select_search_cat(i){
            this.search_cat_selected = this.search_cat[i]
        }
    },
    created(){

    }
}
</script>