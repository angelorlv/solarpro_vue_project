<template>
    <div>
        <div class="p-5 flex justify-center items-center" v-if="list_length == 0">
            <span class="">Aucune statistique à Afficher</span>
        </div>
        <div class="" v-if="list_length > 0">
            <div class="">
                <div class="border-b justify-center items-center mb-2 p-2  flex  text-xl">
                    <span class="flex-grow"> Statistique du <span class="font-bold">{{ date_lettre }}</span> </span>
                    <input type="date" v-model="date_select" class="text-md input"/>
                </div>
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
                        <router-link :to="{name:'vue_emplacement',params:{id:i}}" class="font-bold">{{v.label}}</router-link>
                        
                        <div class="flex" v-if="v.visited">
                            <span class="px-2" > Par : {{ v.user }} </span>
                            <div class="border-l px-2"> A partir de : 
                                <span class="font-bold">{{ (parseInt(v.time.enter[0])+3)+"H."+v.time.enter[1]+"M."+v.time.enter[2] }} </span>
                                à 
                                <span class="font-bold"> {{ (parseInt(v.time.exit[0])+3)+"H."+v.time.exit[1]+"M."+v.time.exit[2] }}  </span>
                            </div>
                            <div class="">
                                Durée Contrôle : <span class="font-bold"> {{ (v.duree>=60)?(v.duree%60):v.duree }} </span> <span> {{ (v.duree>=60)?'Minutes':'Secondes' }} </span>
                            </div>
                        </div>
                    </div>
                    <div class="border-l">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    watch:{
        date_select(n){
            let d = n.split('-')
            this.date_lettre = d[2]+" "+(this.mois[parseInt(d[1])-1])+" "+d[0]
            this.recup_stat_par_jour()
        }
    },
    data(){
        return{
            places_stat:{},
            list_length:0,
            date_now:"",
            date_select:new Date().toISOString().slice(0, 19).replace('T', ' ').split(' ')[0],
            date_lettre:"",
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
                    user:(time.enter != null && time.exit != null)?p[i].login:null,
                    label:p[i].label
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

                    tmp.duree = d
                }

                
                this.places_stat[p[i].place_id] = tmp
            }
            console.log(this.places_stat)
        }
    },
    mounted(){
        //les dates
        this.date_now = new Date().toISOString().slice(0, 19).replace('T', ' ').split(' ')[0].split('-')

        this.date_lettre = this.date_now[2]+" "+(this.mois[parseInt(this.date_now[1])-1])+" "+this.date_now[0]
        this.recup_stat_par_jour()
    }
}
</script>