<template>
  <div class="" :style="{width:'100%',height:'400px'}">
      <div id="mapContainer" class="basemap"></div>
  </div>
</template>

<script>

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

export default {
    name: "BaseMap",
    data() {
        return {
            accessToken: "pk.eyJ1IjoiYW5nZWxvMTQyNyIsImEiOiJja3c0aGExMTIwNmp0Mm9udnY2bGNsZnRoIn0.PiJCKKLMoWzmULCaFs2CqA",
            map:{},
            center:[0,0],
            location:''
        };
    },
    mounted() {
        this.createMap()
    },

    methods: {
        async createMap() {
            try {
                mapboxgl.accessToken = this.accessToken;
                this.map = new mapboxgl.Map({
                    container: "mapContainer",
                    style: "mapbox://styles/mapbox/streets-v11?optimize=true",
                    center: this.center,
                    zoom: 11,
                });

                let geocoder =  new MapboxGeocoder({
                    accessToken: this.accessToken,
                    mapboxgl: mapboxgl,
                    marker: false,
                });

                this.map.addControl(geocoder);

                geocoder.on("result", (e) => {
                    const marker = new mapboxgl.Marker({
                        draggable: true,
                        color: "#D80739",
                    })
                        .setLngLat(e.result.center)
                        .addTo(this.map);
                    this.center = e.result.center;
                    this.$emit('place_name',e.result.place_name)
                    console.log(e.result)
                    this.$emit('position',e.result.center)
                    marker.on("dragend", (e) => {
                        console.log("Marker : ",e)
                        this.center = Object.values(e.target.getLngLat());
                        this.$emit('position',this.center)

                        this.getLocation()
                    });
                });

            } catch (err) {
                console.log("map error", err);
            }
        },
        async getLocation() {
            try {
                const response = await this.$http.get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.center[0]},${this.center[1]}.json?access_token=${this.accessToken}`
                );

                let [,t,r,...rest] = response.data.features[0].place_name.split(',');
                this.location = t+','+r
                console.log(response.data.features[0])
                this.$emit('place_name',this.location)
            } catch (err) {
                this.loading = false;
                console.log(err);
            }
        },
    },
};
</script>

<style  scoped>
.basemap {
    width: 100%;
    height: 100%;
}
</style>