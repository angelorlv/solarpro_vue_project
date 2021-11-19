<template>
  <div class="" id="map">
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

export default {
    props:['radius'],
    components: {
    },
    data () {
        return {
            _radius:50,
            accessToken:'pk.eyJ1IjoiYW5nZWxvMTQyNyIsImEiOiJja3c0aGExMTIwNmp0Mm9udnY2bGNsZnRoIn0.PiJCKKLMoWzmULCaFs2CqA',
            circle_l:null,
            features_circle:null,
            origin_view:[-18.929670491513264,47.52685546875001]
        };
    },
    methods:{
        async initmap(){
            let self = this

            

            let mymap = L.map('map').setView(this.origin_view, 16)
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiYW5nZWxvMTQyNyIsImEiOiJja3c0aGExMTIwNmp0Mm9udnY2bGNsZnRoIn0.PiJCKKLMoWzmULCaFs2CqA'
            }).addTo(mymap)

            this.features_circle = L.featureGroup().addTo(mymap)

            L.Control.geocoder({defaultMarkGeocode: false}).addTo(mymap)
            .on('markgeocode',(e)=>{
                console.log(e.geocode)
                self.features_circle.clearLayers();
                self.circle_l = L.circle(e.geocode.center, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: self.radius
                }).addTo(this.features_circle)
                mymap.setView(e.geocode.center,16)
                self.$emit('position',e.geocode.center)
                //Nommage

                let [t,r,...rest] = e.geocode.name.split(',')
                this.location = t+','+r
                this.$emit('place_name',this.location)
            })
            
            mymap.invalidateSize()
            
            mymap.on('click',(e)=>{
                self.features_circle.clearLayers();
                self.circle_l = L.circle(e.latlng, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: self.radius
                }).addTo(this.features_circle);
                self.$emit('position',e.latlng)
                self.getLocation(e.latlng)
            })
        },
        async getLocation(e) {
            try {
                const response = await this.$http.get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lng},${e.lat}.json?access_token=${this.accessToken}`
                );

                let [,t,r,...rest] = response.data.features[0].place_name.split(',');
                this.location = t+','+r
                this.$emit('place_name',this.location)
            } catch (err) {
                console.log(err);
            }
        },
    },
    mounted(){
        this.initmap()
    }
}
</script>
<style scoped>
#map{
    height: 450px;
}
</style>