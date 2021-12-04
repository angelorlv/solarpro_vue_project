<template>
    <div class="">
        <div class="">
            <div class=" p-2 border-b">
                <span class="text-lg">Date de contrôle - </span>
            </div>
            <div class="">
                <div class="flex flex-col m-2">
                    <div class="flex flex-col m-2">
                        <span>Debut contrôle de jour</span>
                        <input v-if="on_modif_date_control" type="time" class="input" v-model="settings.temp_control_jour">
                        <span class="input" v-else> {{ settings.temp_control_jour }} </span>
                    </div>
                    <div class="flex flex-col m-2">
                        <span >Debut contrôle de nuit</span>
                        <input v-if="on_modif_date_control" type="time" class="input" v-model="settings.temp_control_nuit">
                        <span class="input" v-else> {{ settings.temp_control_nuit }} </span>
                    </div>
                    <div class="">
                        <div v-if="on_modif_date_control" class="flex ">
                            <button @click="show_modif_date_control(false)" class="mx-2 bt flex justify-center items-center rounded-full"> <span class="material-icons"> clear </span> </button>
                            <button @click="post_modif_date_control" class="bt flex justify-center items-center rounded-full"> 
                                <span class="material-icons">edit</span>
                                <span>Valider</span>    
                            </button>
                        </div>
                        <div class="mx-2" v-else>
                            <button @click="show_modif_date_control(true)" class="bt flex justify-center items-center rounded-full"> 
                                <span class="material-icons"> edit </span>
                                <span> Modifier </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            settings:{},
            on_modif_date_control:false
        }
    },
    methods:{
        recup_settings(){
            let self = this

            this.$http.get('a/settings').then(res=>{
                if(res.body.status){
                    self.settings = res.body.settings
                }
            },err =>{
                alert('Erreur de réseau')
            })
        },
        show_modif_date_control(t){
            this.on_modif_date_control = t
        },
        post_modif_date_control(){
            let self = this
            this.$http.put('a/settings/'+this.settings.id,this.settings).then(res=>{
                if(res.body.status){
                    self.show_modif_date_control(false)
                }else{
                    alert('Erreur de modification')
                }
            },err=>{
                alert('Erreur de réseau')
            })
        }
    },
    mounted(){
        this.recup_settings()
    }
}
</script>