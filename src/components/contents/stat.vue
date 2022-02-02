<template>
    <div class="flex">
        <div class="max-h-screen overflow-auto flex-grow">
            <div class="">
                <div class="border-b justify-center items-center mb-2 p-2  flex  text-xl">
                    <span class="flex-grow"> Statistique du <span class="font-bold">{{ date_lettre+""+((indication_state_date !="")?(", "+indication_state_date):"" )}}</span> </span>
                    <input type="date" v-model="date_select" class="text-md input"/>
                </div>
                <div class="m-2 flex shadow-lg p-2 sticky top-0 rounded-lg border bg-gray-100">
                    <!-- <div class="mx-2 flex flex-col">
                        <span class="text-sm"> Contrôle </span>
                        <cSelect :datas="cat_select" label="label" @selected="set_select_cat"></cSelect>
                    </div> -->
                    <div class="mx-2 flex flex-col">
                        <span class="text-sm"> Type </span>
                        <cSelect :datas="type_select" label="label" @selected="set_select_type"></cSelect>
                    </div>
                </div>
            </div>
            <div class="p-5 flex justify-center items-center" v-if="list_length == 0">
                <span class="">Aucune statistique à Afficher</span>
            </div>
            <div class="" v-if="list_length > 0">
                <div class="">
                    <div class="flex rounded items-center border m-2 duration-300 hover:bg-gray-300 hover:bg-opacity-30" v-for="v,i in places_stat" :key="i">
                        <div class="p-2 h-full bg-gray-200">
                            <span class="flex justify-center items-center text-green-500 material-icons" v-if="v.visited">
                                check_circle
                            </span>
                            <span class="flex justify-center items-center text-red-500 material-icons" v-else>
                                unpublished
                            </span>
                        </div>
                        <div class="mx-2 flex flex-col">
                            <div class="flex">
                                <router-link :to="{name:'vue_emplacement',params:{id:i}}" class="font-bold">{{v.place_label}}</router-link>
                                <div class="mx-2">
                                    <span class="border-r px-2"> {{ v.regisseur_name }} </span> <span class="px-2 border-r"> {{ v.annonceur_name }} </span>
                                </div>
                            </div>
                            
                            <div class="flex" v-if="v.visited">
                                <span class="px-2" > Par : {{ v.login_user }} </span>
                                <div class="border-l px-2"> A partir de : 
                                    <span class="font-bold">{{ (parseInt(v.time.enter[0])+3)+"H."+v.time.enter[1]+"M."+v.time.enter[2] }} </span>
                                    à 
                                    <span class="font-bold"> {{ (parseInt(v.time.exit[0])+3)+"H."+v.time.exit[1]+"M."+v.time.exit[2] }}  </span>
                                </div>
                                <div class="">
                                    Durée Contrôle : <span class="font-bold"> {{ v.duree }} </span>
                                </div>
                            </div>
                        </div>
                        <div class="border-l">

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Fin affichage statistique des emplacements contrôlés -->
        <!-- <div v-if="false" class="max-h-screen overflow-auto text-sm" style="width:400px">
            <div class="sticky bg-gray-100 p-2 border shadow-lg top-2 m-2 rounded-lg">
                <span>Liste des emplacemens pas encore contrôlés</span>
            </div>

            <div class="m-2 py-2 border rounded-lg">
                <div class="p-2 border rounded m-1" v-for="d in places_non_controled" :key="d.id">
                    <div> 
                        <span class="font-bold mx-2 border-r">{{ d.place_label }}</span>
                        <span class="mx-2 border-r"> {{ d.regisseur_name }} </span>    
                        <span> {{ d.annonceur_name }} </span>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
import cSelect from '@/utils/c-select.vue'

export default {
    components:{cSelect},
    watch:{
        date_select(n){
            let d = n.split('-')
            let dn = this.date_now.split('-')
            if(d[0] == dn[0] && d[1] == dn[1]){
                if(d[2] == dn[2]){
                    this.indication_state_date = "Aujourd'hui"
                }else if(parseInt(d[2]) == parseInt(dn[2])-1){
                    this.indication_state_date = "Hier"
                }else{
                    this.indication_state_date = ""
                }
            }else{
                this.indication_state_date = ""
            }
            this.date_lettre = d[2]+" "+(this.mois[parseInt(d[1])-1])+" "+d[0]
            // this.recup_stat_par_jour()
            this.recup_stat_control(this.type_select_selected.code)
            //this.recup_stat_non_control(this.type_select_selected.code)
        },

    },
    data(){
        return{
            places_stat:{},
            list_length:0,
            date_now:"",
            indication_state_date:'',
            date_select:new Date().toISOString().slice(0, 19).replace('T', ' ').split(' ')[0],
            date_lettre:"",
            cat_select:[
                {label:"Controlé",code:"controled"},
                {label:"Pas Controlé",code:"no-controled"}
            ],

            type_select:[
                {label:"Jour",code:"jour"},
                {label:"Nuit",code:"nuit"},
            ],
            type_select_selected:{},
            cat_select_selected:{},
            places_non_controled:[],
            mois:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
        }
    },
    methods:{
        recup_stat_par_jour(){
            let self = this

            this.$http.get('a/places/stat?date_check='+this.date_select).then(res =>{
                if(res.body.status){
                    self.list_length = res.body.places_stat.length
                    self.format_par_jour(res.body.places_stat)
                }else{
                    alert(res.body.message)
                }
            }, err =>{

            })
        },
        format_par_jour(p){
            this.places_stat = {}
            
            for(let i=0;i<p.length;i++){
                if(!this.places_stat[p[i].place_id]){
                    this.places_stat[p[i].place_id] = {}
                }

                let time = {}
                time.enter = (p[i].time_enter != null)?p[i].time_enter.split(':'):null
                time.exit = (p[i].time_exit != null)?p[i].time_exit.split(':'):null


                let tmp = {
                    time:time,
                    login_user:(time.enter != null && time.exit != null)?p[i].login_user:null,
                    place_label:p[i].place_label,
                    regisseur_name:p[i].regisseur_name,
                    annonceur_name:p[i].annonceur_name
                }

                if(time.enter == null || time.exit == null){
                    tmp.visited = false 
                    tmp.duree = null
                }else{
                    tmp.visited = true
                    let tenter = time.enter.map(x =>parseInt(x))
                    let texit = time.exit.map(x =>parseInt(x))

                    tenter = (tenter[0]*60*60)+(tenter[1]*60)+tenter[2]
                    texit = (texit[0]*60*60)+(texit[1]*60)+texit[2]

                    let d = texit - tenter

                    if(d >= 60){
                        if(d>= 3600){
                            d = parseInt(d/3600)+" Heures et "+parseInt((d%60)/60)+" m et "+(d%60)+" s"
                        }else{
                            d = parseInt(d/60)+" Minutes et "+(d%60)+" s"
                        }
                    }else{
                        d=d+" Secondes"
                    }

                    tmp.duree = d
                }

                if(p[i].date_check != this.date_select){
                    tmp.visited = false
                }

                
                this.places_stat[p[i].place_id] = tmp
            }
            console.log(this.places_stat)
        },
        set_select_cat(i){
            this.cat_select_selected = this.cat_select[i]
        },
        set_select_type(i){
            this.type_select_selected = this.type_select[i]
            this.recup_stat_control(this.type_select_selected.code)
            //this.recup_stat_non_control(this.type_select_selected.code)
        },
        match_select(d){
            if(this.cat_select_selected.code == "all"){
                return true
            }


            if(this.cat_select_selected.code == "controled"){
                if(d.visited){
                    return true
                }
                return false
            }

            if(!d.visited){
                return true
            }
            return false
        },
        recup_stat_control(type){
            let self = this

            this.$http.get('a/places/stat/'+type+'?date_check='+this.date_select).then(res =>{
                if(res.body.status){
                    self.list_length = res.body.places_stat.length
                    self.format_par_jour(res.body.places_stat)
                }else{
                    alert(res.body.message)
                }
            }, err =>{

            })
        },
        recup_stat_non_control(type){
            let self = this

            this.$http.get('a/places/stat/'+type+'/unvisited?date_check='+this.date_select).then(res =>{
                if(res.body.status){
                    //self.list_length = res.body.places_stat.length
                    self.places_non_controled = res.body.places_stat
                }else{
                    alert(res.body.message)
                }
            }, err =>{

            })
        }
    },
    mounted(){
        //les dates
        this.date_now = new Date().toISOString().slice(0, 19).replace('T', ' ').split(' ')[0]

        let d_tmp = this.date_now.split('-')
        this.date_lettre = d_tmp[2]+" "+(this.mois[parseInt(d_tmp[1])-1])+" "+d_tmp[0]
        // this.recup_stat_par_jour()
        // this.recup_stat_control('jour')
    }
}
</script>