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
    props:['radius','places'],
    watch:{
        radius(e){
            this.circle_l.setRadius(e)
        }
    },
    components: {
    },
    data () {
        return {
            _radius:50,
            accessToken:'pk.eyJ1IjoiYW5nZWxvMTQyNyIsImEiOiJja3c0aGExMTIwNmp0Mm9udnY2bGNsZnRoIn0.PiJCKKLMoWzmULCaFs2CqA',
            circle_l:null,
            features_circle:null,
            origin_view:[-18.929670491513264,47.52685546875001],
            mymap:{}
        };
    },
    methods:{
        async initmap(){
            let self = this
            this.mymap = L.map('map').setView(this.origin_view, 16)
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiYW5nZWxvMTQyNyIsImEiOiJja3c0aGExMTIwNmp0Mm9udnY2bGNsZnRoIn0.PiJCKKLMoWzmULCaFs2CqA'
            }).addTo(this.mymap)
            
            this.mymap.dragging.enable()
            this.features_circle = L.featureGroup().addTo(this.mymap)

            L.Control.geocoder({defaultMarkGeocode: false}).addTo(this.mymap)
            .on('markgeocode',(e)=>{
                console.log(e.geocode)
                self.features_circle.clearLayers();
                self.circle_l = L.circle(e.geocode.center, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    draggable:true,
                    radius: self.radius
                }).addTo(this.features_circle)
                this.mymap.setView(e.geocode.center,16)
                self.$emit('position',e.geocode.center)
                //Nommage

                let [t,r,...rest] = e.geocode.name.split(',')
                this.location = t+','+r
                this.$emit('place_name',this.location)
            })
            
            this.mymap.on('click',(e)=>{
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

        async display_all_place(){
            let place_layer =  L.featureGroup().addTo(this.mymap)
            let tmp_c = {}
            let tmp_p = {}
            this.places.forEach(e => {
                tmp_c = L.circle([e.lat,e.lng], {
                    color: 'green',
                    fillColor: 'green',
                    fillOpacity: 0.5,
                    radius: e.radius
                }).addTo(place_layer)
                
                tmp_p = new L.Popup({ autoClose: false, closeOnClick: false }).setContent(e.label)
                .setLatLng([e.lat,e.lng])

                tmp_c.bindPopup(tmp_p)
                tmp_c.openPopup(tmp_p)
            });
        }
    },
    mounted(){

        this.initmap()
        this.display_all_place()
    }
}
</script>
<style scoped>
#map{
    height: 450px;
}
</style>