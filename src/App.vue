<template>
	<div id="app" class="flex flex-col justify-center items-center bg-gray-200 h-screen w-screen">
		<transition name="fade" mode="out-in">
			<div v-if="data_loaded" class="">
				<div class="w-screen h-screen max-h-screen" v-if="$store.state.status_connect">
					<contents></contents>
				</div>
				<div v-else class="w-screen">
					<login></login>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>

import contents from './components/contents.vue'

import login from './components/login.vue'
export default {
	data(){
		return{
			d:'',
			data_loaded:false
		}
	},
	name: 'App',
	components: {
		login,
		contents
	},
	methods:{
		test_recup_data(){
			this.$http.get('p/test').then(res =>{
				console.log(res)
			},res =>{

			})
		},
		check_connect(){
			let self  = this
			this.$http.get('a/check_connect').then(res =>{
				if(res.body.status){
					self.$store.commit('setUser',res.body.user)
					
				}else{
					self.$store.commit('deconnect')
				}
				self.data_loaded = true
			},res =>{

			})
		}
	},
	created(){
		this.check_connect()
	}
}
</script>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}
</style>
