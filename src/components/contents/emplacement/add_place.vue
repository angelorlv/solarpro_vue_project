<template>
    <!-- Boîtes de dialogue -->
    <div v-if="show"  class="fixed flex justify-center items-center top-0 left-0 w-screen h-screen bg-gray-800 bg-opacity-80">
        <div :style="{minWidth:400+'px',width:900+'px',height:500+'px'}" class="bg-gray-100 border flex flex-col rounded shadow-lg">
            <div class="border-b p-2 flex">
                <div class="flex-grow flex items-center">
                    <span class=" text-2xl text-gray-700 font-bold">Ajout d'un emplacement</span>
                    <div class="rounded p-1 mx-2"  :class="(info.success)?'bg-green-400':'bg-red-400'" v-if="info.isOn">
                        <span > {{ info.message }} </span>
                    </div>
                </div>
                <button @click="show_add_place(false)" class="w-8 h-8 rounded-full flex justify-center items-center text-gray-600
                    hover:text-gray-800 duration-300"> <span class="material-icons">clear</span> </button>
            </div>
            <div class="flex w-full">
                <div class="flex-grow" style="width:100%">
                    <!-- <MapBox @position="position" @place_name="place_name" /> -->
                    <LeafletMap :places="places_list" :radius="places.model.radius" @position="position" @place_name="place_name" />
                </div>
                <div class="flex flex-col overflow-y-auto"  :style="{height:'450px', width:'400px'}">
                    
                    <form @submit.prevent="post_add_place" class="flex flex-col " action="/" method="post">
                        <div class="mt-2 p-2 flex flex-col justify-end overflow-auto" >
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
                                    <span class="text-sm text-gray-600"> Lieu ... </span>
                                    <input type="text" class="input" placeholder="@exemple Analakely ..." v-model.trim="places.model.label">
                                </div>
                                <div class="mt-1 flex flex-col">
                                    <span class="text-sm text-gray-600"> Régisseur ... </span>
                                    <select class="input"  v-model="places.model.regisseur_id" >
                                        <option :selected="(i==0)?true:false" :value="d.id" v-for="d,i in regisseur.list" :key="d.id"> {{ d.label }} </option>
                                    </select>
                                </div>

                                <div class="mt-1 flex flex-col">
                                    <span class="text-sm text-gray-600"> Annonceur ... </span>
                                    <select class="input"  v-model="places.model.annonceur_id" >
                                        <option :selected="(i==0)?true:false" :value="d.id" v-for="d,i in annonceur.list" :key="d.id"> {{ d.label }} </option>
                                    </select>
                                </div>
                                <div class="mt-1 flex flex-col">
                                    <span class="text-sm text-gray-600"> Dimension Panneau ... </span>
                                    <input type="text" class="input" placeholder="Dimension panneau..." v-model.trim="places.model.dimension_panneau">
                                </div>
                                <div class="mt-1 flex flex-col">
                                    <span class="text-sm text-gray-600"> Nombre de lumière ... </span>
                                    <input type="number" min="1" max="100" class="input" placeholder="Nombre de lumière ..." v-model.trim="places.model.nombre_light">
                                </div>
                                <div class="mt-1 flex flex-col">
                                    <span class="text-sm text-gray-600"> Date de début ... </span>
                                    <input type="date" class="input" placeholder="Nombre de lumière ..." v-model.trim="places.model.date_debut">
                                </div>
                                <div class="mt-1 flex flex-col">
                                    <span class="text-sm text-gray-600"> Photo Jour ... </span>
                                    <div class="w-full">
                                        <div class="flex  border-2 border-gray-300 rounded-lg relative" v-if="places_image.image_jour.src != null">
                                            <img :src="places_image.image_jour.src" class="rounded-lg" alt="" srcset="">
                                            <button @click.prevent="delete_image('jour')" class="absolute bt rounded-full w-8 h-8 justify-center items-center flex">
                                                <span class="material-icons"> clear </span>
                                            </button>
                                        </div>
                                        <label v-else for="photo_jour" class=" rounded-lg flex cursor-pointer justify-center items-center w-full border-dashed border-2 h-16 border-blue-400 bg-blue-300">
                                            <span>Cliquer pour insérer une photo</span>
                                        </label>
                                        <input accept="image/*" id="photo_jour" @change="upload_image('jour',$event)" type="file" class="hidden">
                                    </div>
                                </div>

                                <div class="mt-1 flex flex-col">
                                    <span class="text-sm text-gray-600">Photo Nuit ... </span>
                                    <div class="w-full">
                                        <div class="flex  border-2 border-gray-300 rounded-lg relative" v-if="places_image.image_nuit.src != null">
                                            <img :src="places_image.image_nuit.src" class="rounded-lg" alt="" srcset="">
                                            <button @click.prevent="delete_image('nuit')" class="absolute bt rounded-full w-8 h-8 justify-center items-center flex">
                                                <span class="material-icons"> clear </span>
                                            </button>
                                        </div>
                                        <label v-else for="photo_nuit" class=" rounded-lg flex cursor-pointer justify-center items-center w-full border-dashed border-2 h-16 border-blue-400 bg-blue-300">
                                            <span>Cliquer pour insérer une photo</span>
                                        </label>
                                        <input @change="upload_image('nuit',$event)" accept="image/*" id="photo_nuit" type="file" class="hidden">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-2 border-t flex justify-end">
                            <button :disabled="on_load_image" :class="(on_load_image)?'bt-disabled':'bt'" class=" rounded-full flex justify-center items-center"> 
                                <span class="material-icons" v-if="!on_load_image">add_circle</span>
                                <span>{{ (on_load_image)?'...':'Créer' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
                
            </div>
            
        </div>
    </div>
</template>

<script>

import LeafletMap from './LeafletMap.vue'
export default {
    components:{LeafletMap},
    props:['show','places_list'],
    watch:{
        show(t){
            if(t){
                this.recup_soc_list('regisseur')
                this.recup_soc_list('annonceur')
            }
        }
    },
    data(){
        return {
            places_image:{
                image_jour:{
                    src:null,
                    name:''
                },
                image_nuit:{
                    src:null,
                    name:''
                },
            },
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
                    label:'',
                    regisseur_id:'',
                    annonceur_id:'',
                    dimension_panneau:'',
                    date_debut:'',
                    nombre_light:1,
                    photo_jour_id:null,
                    photo_nuit_id:null
                }
            },
            info:{
                success:'',
                message:'',
                isOn:false,
                idTimeout:-1
            },
            
            position_on_carte:[],
            current_position:[],
            current_place_name:'',


            regisseur:{list:[]},
            annonceur:{list:[]},
            on_load_image:false
        }
    },
    methods:{
        
        post_add_place(){
            let self = this
            this.$http.post('a/places',this.places.model).then(res=>{
                if(res.body.status){
                    self.$emit('success_add')
                    self.show_info(res.body.status,res.body.message,()=>{
                        self.show_add_place(false)
                        self.$emit('close')

                    })

                    self.places.model = {
                        latlng:'',
                        radius:50,
                        label:'',
                        regisseur_id:'',
                        annonceur_id:'',
                        dimension_panneau:'',
                        date_debut:'',
                        nombre_light:1,
                        image_jour:"",
                        image_nuit:""
                    }
                    
                }else{
                    self.show_info(res.body.status,res.body.message)
                }
            }, err =>{

            })
        },
        recup_soc_list(t){
            let self = this
            this.$http.get('a/society?type='+t).then(res=>{
                if(res.body.status){
                    if(t == "regisseur"){
                        self.regisseur.list = res.body.soc
                    }else{
                        self.annonceur.list = res.body.soc
                    }
                }else{  
                    alert(res.body.message)
                }
            },err=>{

            })
        },
        upload_image(t,e){
            console.log('Upload')
            const image = e.target.files[0]
            const reader = new FileReader()
            reader.readAsDataURL(image)



            let self = this
            self.on_load_image = true
            reader.onload = e =>{
                if(t == 'jour'){
                    self.places_image.image_jour.src = e.target.result
                    self.places_image.image_jour.name = self.makeid(10)

                    let data = new FormData()

                    data.append('name', self.places_image.image_jour.name)
                    data.append('file', image);
                    self.post_temp_image(data,(r)=>{
                        if(r.status){
                            self.places.model.photo_jour_id = r.file_id
                        }else{
                            alert(r.message)
                        }

                        self.on_load_image = false
                    })

                }else{
                    self.places_image.image_nuit.src = e.target.result
                    self.places_image.image_nuit.name = self.makeid(10)

                    let data = new FormData()

                    data.append('name', self.places_image.image_nuit.name)
                    data.append('file', image);

                    
                    self.post_temp_image(data,(r)=>{
                        if(r.status){
                            self.places.model.photo_nuit_id = r.file_id
                        }else{
                            alert(r.message)
                        }

                        self.on_load_image = false
                    })
                }
            }
        },
        delete_image(t){
            let self = this
            if(t == 'jour'){
                self.delete_temp_image(self.places.model.photo_jour_id,(r)=>{
                    if(r.status){
                        self.places_image.image_jour= {
                            src:null,
                            name:''
                        }
                        self.places.model.photo_jour_id = null
                    }else{
                        alert(r.message)
                    }
                })
                // self.places_image.image_jour= {
                //     src:null,
                //     name:''
                // }
            }else{
                self.delete_temp_image(self.places.model.photo_nuit_id,(r)=>{
                    if(r.status){
                        self.places_image.image_nuit = {
                            src:null,
                            name:''
                        }
                        self.places.model.photo_nuit_id = null
                    }else{
                        alert(r.message)
                    }
                })
            }
        },

        post_temp_image(data,cb){
            this.$http.post('a/uploads',data).then(res=>{
                cb(res.body)
            },err=>{

            })
        },
        delete_temp_image(id,cb){
            this.$http.delete('a/uploads/'+id).then(res=>{
                cb(res.body)
            },err=>{

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
        show_add_place(t){
            if(!t){
                this.$emit('close')
            }
        },
        
        position(latlng){
            this.places.model.latlng = latlng.lat+','+latlng.lng
        },
        place_name(current_place_name){
            this.places.model.label = current_place_name
        },
        makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
            }
            return result;
        }
    }
}
</script>