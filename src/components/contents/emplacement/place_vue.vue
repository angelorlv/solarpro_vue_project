<template>
    <div>
        <div class="" id="map">

        </div>

        <div class="p-2 flex">
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
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            radius:50,
            accessToken:'pk.eyJ1IjoiYW5nZWxvMTQyNyIsImEiOiJja3c0aGExMTIwNmp0Mm9udnY2bGNsZnRoIn0.PiJCKKLMoWzmULCaFs2CqA',
            circle_l:null,
            features_circle:null,
            origin_view:[0,0],
            mymap:{},
            place:{}
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
        },

        recup_emplacement(){
            let self = this
            this.$http.get('a/places/'+this.$route.params.id).then(res =>{
               if(res.body.status){
                   this.place = res.body.place
                   this.origin_view = [this.place.lat,this.place.lng]
                   this.radius = this.place.radius
                   this.initmap()
               }else{
                   this.$router.push({name:'emplacement'})
               }
            }, err =>{
                alert('Erreur de Réseau')
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