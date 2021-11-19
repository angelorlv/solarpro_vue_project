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
            <!-- list -->
            <div class="">
                <ctable v-if="places.list.length != 0" :_head="places.head" :_list="places.list" _key="id" ></ctable>
                <div class="w-full flex justify-center items-center" v-else>
                    <span class="text-xl text-gray-600"> Aucun emplacement à afficher. </span>
                </div>
            </div>
        </div>


        <!-- Boîtes de diaogue -->
        <div v-if="on_add_place"  class="fixed flex justify-center items-center top-0 left-0 w-screen h-screen bg-gray-800 bg-opacity-80">
            <div :style="{minWidth:400+'px',width:900+'px',height:500+'px'}" class="bg-gray-100 border flex flex-col border-green-400 rounded shadow-lg">
                <div class="border-b p-2 bg-green-400 flex">
                    <span class="flex-grow text-2xl text-gray-700 font-bold">Ajout d'un emplacement</span>
                    <button @click="show_add_place(false)" class="w-8 h-8 rounded-full flex justify-center items-center text-gray-600
                     hover:text-gray-800 duration-300"> <span class="material-icons">clear</span> </button>
                </div>
                <div class="flex w-full">
                    <div class="flex-grow" style="width:100%">
                        <!-- <MapBox @position="position" @place_name="place_name" /> -->
                        <LeafletMap :radius="places.model.radius" @position="position" @place_name="place_name" />
                    </div>
                    <div class="flex flex-col justify-center items-center ">
                        <div class="duration-300 h-0 flex justify-center items-center" :class="(info.isOn)?'h-14':'h-0'">
                            <div class="rounded p-2 " :class="(info.success)?'bg-green-400':'bg-red-400'" v-if="info.isOn">
                                <span> {{ info.message }} </span>
                            </div>
                        </div>
                        <form @submit.prevent="post_add_place" class="flex flex-col " action="/" method="post">
                            <div class="mt-2 p-2 flex flex-col justify-end">
                                <div class="flex flex-col pr-2">
                                    <div class="mt-1 flex flex-col">
                                        <span class="text-sm text-gray-600"> Latitude et Longitude ... </span>
                                        <input type="text" class="input" placeholder="@exemple  -14.545454545, 48.15465445646546 ..." v-model.trim="places.model.latlng">
                                    </div>
                                    <div class="mt-1 flex flex-col">
                                        <span class="text-sm text-gray-600"> Rayon (en mètre) ... </span>
                                        <input type="number" class="input" placeholder="@exemple 50 ..." v-model.trim="places.model.radius">
                                    </div>
                                    <div class="mt-1 flex flex-col">
                                        <span class="text-sm text-gray-600"> Libellé ... </span>
                                        <input type="text" class="input" placeholder="@exemple Analakely ..." v-model.trim="places.model.label">
                                    </div>
                                </div>
                            </div>
                            <div class="p-2 border-t flex justify-end">
                                <button class="bt-w rounded"> Créer </button>
                            </div>
                        </form>
                    </div>
                    
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>

import ctable from '@/utils/ctable.vue'
import MapBox from "./Mapbox.vue";
import LeafletMap from './LeafletMap.vue'

export default {
    components:{ctable,MapBox,LeafletMap},
    data(){
        return{
            places:{
                head:[
                    {code:'lat',label:'Latitude'},
                    {code:'lng',label:'Longitude'},
                    {code:'radius',label:'Rayon (en mètre)'},
                    {code:'label',label:'Libellé'},
                ],
                list:[],
                model:{
                    latlng:'',
                    radius:50,
                    label:''
                }
            },
            info:{
                success:'',
                message:'',
                isOn:false,
                idTimeout:-1
            },
            on_add_place:false,
            position_on_carte:[],
            current_position:[],
            current_place_name:''
        }
    },
    methods:{
        show_add_place(v){
            this.on_add_place = v
        },
        recup_place_list(){
            let self = this
            this.$http.get('a/places').then(res=>{
                if(res.body.status){
                    self.places.list = res.body.places
                }else{

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
        post_add_place(){
            let self = this
            this.$http.post('a/places',this.places.model).then(res=>{
                if(res.body.status){
                    self.show_info(res.body.status,res.body.message,()=>{
                        self.show_add_place(false)
                    })
                    self.recup_place_list()
                    
                }else{
                    self.show_info(res.body.status,res.body.message)
                }
            }, err =>{

            })
        },
        position(latlng){
            this.places.model.latlng = latlng.lat+','+latlng.lng
        },
        place_name(current_place_name){
            this.places.model.label = current_place_name
        }
    },
    created(){
        this.recup_place_list()
    }
}
</script>