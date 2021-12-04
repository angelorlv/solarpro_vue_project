<template>
    <div class="flex">
        <div class="flex-grow max-h-screen" style="height:100vh" id="map">
        </div>
        
        <!-- Affichage des infos sur la place -->
        <div class="p-2 flex flex-col max-h-screen overflow-auto" v-if="!on_modif" :style="{width:'400px'}">
            <div class="p-2">
                <div class="p-2 mb-2 border bg-green-300 bg-opacity-10  rounded">
                    <span>Latitude : </span> <span class="font-bold"> {{ place.lat }} </span>
                </div>
                <div class="p-2 border bg-green-300 bg-opacity-10 rounded">
                    <span>Logitude : </span> <span class="font-bold"> {{ place.lng }} </span>
                </div>
            </div>
            <div class="p-2">
                <div class="p-2 border bg-green-300 bg-opacity-10 rounded">
                    <span> Rayon (en mètre) : </span> <span class="font-bold"> {{ place.radius }} </span>
                </div>
            </div>
            <div class="p-2">
                <div class="p-2 border bg-green-300 bg-opacity-10 rounded">
                    <span class=""> Libellé : </span> <span class="font-bold"> {{ place.label }} </span>
                </div>
            </div>

            <div class="p-2">
                <div class="p-2 border bg-green-300 bg-opacity-10 rounded">
                    <span class=""> Regisseur : </span> <span class="font-bold"> {{ (place.regisseur_name !=null)?place.regisseur_name:"Inexistant"  }} </span>
                </div>
            </div>

            <div class="p-2">
                <div class="p-2 border bg-green-300 bg-opacity-10 rounded">
                    <span class=""> Annonceur : </span> <span class="font-bold"> {{ (place.annonceur_name !=null)?place.annonceur_name:"Inexistant"  }} </span>
                </div>
            </div>

            <div class="p-2">
                <div class="p-2 border bg-green-300 bg-opacity-10 rounded">
                    <span class=""> Nombre de lumière : </span> <span class="font-bold"> {{ (place.nombre_light !=null)?place.nombre_light:"Inexistant"  }} </span>
                </div>
            </div>
            <div class="p-2">
                <div class="p-2 border bg-green-300 bg-opacity-10 rounded">
                    <span class=""> Dimension Panneau : </span> <span class="font-bold"> {{ (place.dimension_panneau !=null && place.dimension_panneau != "")?place.dimension_panneau:"Inexistant"  }} </span>
                </div>
            </div>
            <div class="p-2">
                <div class="p-2 border bg-green-300 bg-opacity-10 rounded">
                    <span class=""> Date début : </span> <span class="font-bold"> {{ (place.date_debut !=null && place.date_debut != "")?place.date_debut:"Inexistant"  }} </span>
                </div>
            </div>


            <div class="flex flex-col p-2 border bg-blue-300 bg-opacity-10 rounded">
                <span> Photo Jour </span>
                <div class="flex h-80 " v-if="place.photo_jour != undefined || place.photo_jour != null">
                    <img :src="'api/p/media/'+place.photo_jour" class="object-cover rounded-lg" loading="lazy" crossorigin="anonymous" >
                </div>
                <div v-else>
                    <span class=""> Photo indisponible ou inexistant </span>
                </div>
            </div>
            <div class="flex flex-col p-2 border bg-blue-300 bg-opacity-10 rounded">
                <span> Photo Nuit </span>
                <div class="flex h-80 " v-if="place.photo_nuit != undefined || place.photo_nuit != null">
                    <img :src="'api/p/media/'+place.photo_nuit" class="object-cover rounded-lg" loading="lazy" crossorigin="anonymous" >
                </div>
                <div v-else>
                    <span class=""> Photo indisponible ou inexistant </span>
                </div>
            </div>

            <div class="flex p-2 border rounded-lg mt-2 shadow-lg justify-end items-center sticky bottom-0 bg-gray-100">
                <button @click="show_modif(true)" class="flex justify-center items-center bt rounded-full">
                    <span class="material-icons">edit</span>
                    <span class="">Modifier</span>
                </button>
            </div>
        </div>

        <div class="p-2 flex flex-col max-h-screen overflow-auto items-center" v-else :style="{width:'400px'}">
            <form @submit.prevent="post_modif_place" class="flex flex-col " action="/" method="post">
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
                            <div class="" style="width:250px">
                                <div class="flex  border-2 border-gray-300 rounded-lg relative" v-if="places_image.image_jour.src != null">
                                    <img :src="places_image.image_jour.src" class="rounded-lg" alt="">
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
                            <div class="" style="width:250px">
                                <div class="flex  border-2 border-gray-300 rounded-lg relative" v-if="places_image.image_nuit.src != null">
                                    <img :src="places_image.image_nuit.src" class="rounded-lg" alt="" >
                                    <button @click.prevent="delete_image('nuit')" class="absolute bt rounded-full w-8 h-8 justify-center items-center flex">
                                        <span class="material-icons"> clear </span>
                                    </button>
                                </div>
                                <label v-else for="photo_nuit" class=" rounded-lg flex cursor-pointer justify-center items-center  border-dashed border-2 h-16 border-blue-400 bg-blue-300">
                                    <span>Cliquer pour insérer une photo</span>
                                </label>
                                <input @change="upload_image('nuit',$event)" accept="image/*" id="photo_nuit" type="file" class="hidden">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-2 border w-full flex justify-end sticky bottom-0 bg-gray-100 rounded-lg">
                    <button @click.prevent="show_modif(false)" class="mr-5 bt rounded-full flex justify-center items-center"> 
                        <span class="material-icons">clear</span>
                    </button>
                    <button :disabled="on_load_image" :class="'bt'+((on_load_image)?'-disabled':'')" class=" rounded-full flex justify-center items-center"> 
                        <span class="material-icons" v-if="!on_load_image">edit</span>
                        <span> {{ (on_load_image)?'...':'Valider la modification' }} </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    watch:{
        on_modif(t){
            if(t){
                this.recup_soc_list('regisseur')
                this.recup_soc_list('annonceur')

                this.recup_place_list()

                this.set_place_modif_model()
            }else{
                this.mymap.removeLayer(this.place_layer)
                this.recup_emplacement()
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
            radius:50,
            place_layer:{},
            accessToken:'pk.eyJ1IjoiYW5nZWxvMTQyNyIsImEiOiJja3c0aGExMTIwNmp0Mm9udnY2bGNsZnRoIn0.PiJCKKLMoWzmULCaFs2CqA',
            circle_l:null,
            features_circle:null,
            origin_view:[0,0],
            mymap:{},
            place:{},
            places:{
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
            on_modif:false,
            regisseur:{list:[]},
            annonceur:{list:[]},
            on_load_image:false
        }
    },
    methods:{
        async initmap(){
            let self = this
            this.mymap = L.map('map').setView(this.origin_view, 18)
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiYW5nZWxvMTQyNyIsImEiOiJja3c0aGExMTIwNmp0Mm9udnY2bGNsZnRoIn0.PiJCKKLMoWzmULCaFs2CqA'
            }).addTo(this.mymap)

            this.features_circle = L.featureGroup().addTo(this.mymap)

            self.features_circle.clearLayers()
            self.circle_l = L.circle(this.origin_view, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: this.radius
            }).bindPopup(this.place.label).addTo(this.features_circle)

            self.circle_l.openPopup(this.origin_view)

            this.mymap.on('click',(e)=>{
                if(self.on_modif){
                    self.features_circle.clearLayers();
                    self.circle_l = L.circle(e.latlng, {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: self.places.model.radius
                    }).addTo(this.features_circle);
                    self.position(e.latlng)
                }
            })
        },
        async display_all_place(){
            this.place_layer =  L.featureGroup().addTo(this.mymap)
            let tmp_c = {}
            let tmp_p = {}
            this.places.list.forEach(e => {
                if(e.id != this.place.id){
                    tmp_c = L.circle([e.lat,e.lng], {
                        color: 'green',
                        fillColor: 'green',
                        fillOpacity: 0.5,
                        radius: e.radius
                    }).addTo(this.place_layer)
                    
                    tmp_p = new L.Popup({ autoClose: false, closeOnClick: false }).setContent(e.label)
                    .setLatLng([e.lat,e.lng])

                    tmp_c.bindPopup(tmp_p)
                    tmp_c.openPopup(tmp_p)
                }
            });

            this.mymap.setView(this.origin_view,16)
        },
        async init_position_emplacement(){
            let self = this
            self.features_circle.clearLayers()
            self.circle_l = L.circle(this.origin_view, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: this.radius
            }).bindPopup(this.place.label).addTo(this.features_circle)

            self.circle_l.openPopup(this.origin_view)
        },
        recup_emplacement(){
            let self = this
            
            this.$http.get('a/places/'+this.$route.params.id).then(res =>{
               if(res.body.status){
                   self.place = res.body.place
                   self.origin_view = [self.place.lat,self.place.lng]
                   self.radius = self.place.radius
                   self.initmap()
                   self.init_position_emplacement()
               }else{
                   self.$router.push({name:'emplacement'})
               }
            }, err =>{
                alert('Erreur de Réseau')
            })
        },
        show_modif(t){
            this.on_modif = t 
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
                        self.places.model.photo_jour_id = null
                        self.post_alt_modif_place({photo_jour_id:null}).then(res=>{
                            if(res.body.status){
                                self.places_image.image_jour= {
                                    src:null,
                                    name:''
                                }
                            }
                        })
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
                        self.places.model.photo_nuit_id = null
                        self.post_alt_modif_place({photo_nuit_id:null}).then(res=>{
                            if(res.body.status){
                                self.places_image.image_nuit= {
                                    src:null,
                                    name:''
                                }
                            }
                        })
                    }
                })
            }
        },

        position(latlng){
            this.places.model.latlng = latlng.lat+','+latlng.lng
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
        recup_place_list(){
            let self = this
            this.$http.get('a/places').then(res=>{
                if(res.body.status){
                    self.places.list = res.body.places
                    self.display_all_place()
                }else{

                }
            },err =>{
                
            })
        },
        set_place_modif_model(){
            this.places.model = {
                latlng:this.place.lat+","+this.place.lng,
                radius:this.place.radius,
                label:this.place.label,
                regisseur_id:this.place.regisseur_id,
                annonceur_id:this.place.annonceur_id,
                dimension_panneau:this.place.dimension_panneau,
                date_debut:this.place.date_debut,
                nombre_light:this.place.nombre_light,
                photo_jour_id:this.place.photo_jour_id,
                photo_nuit_id:this.place.photo_nuit_id

            }

            if(this.place.photo_jour_id != null ){
                this.places_image.image_jour.src="api/p/media/"+this.place.photo_jour
                this.places_image.image_jour.name=this.place.photo_jour
            }

            if(this.place.photo_nuit_id != null ){
                this.places_image.image_nuit.src="api/p/media/"+this.place.photo_nuit
                this.places_image.image_nuit.name=this.place.photo_nuit
            }

            console.log(this.places_image)
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
        },
        post_modif_place(){
            this.$http.put('a/places/'+this.place.id,this.places.model).then(res =>{
                if(res.body.status){
                    this.show_modif(false)
                }
            })
        },
        post_alt_modif_place(d){
            this.$http.put('a/places/modif/'+this.place.id,d).then(res =>{
                if(res.body.status){
                    
                }
            })
        }
    },

    mounted(){
        // this.initmap()
        this.recup_emplacement()
    }

}
</script>

<style scoped>
#map{
    height: 450px;
}
</style>