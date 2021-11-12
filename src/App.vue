<template>
	<div id="app" class="flex justify-center items-center bg-gray-200 h-screen w-screen">
		<div class="w-full">
			<login></login>
		</div>
	</div>
</template>

<script>
import login from './components/login.vue'
export default {
	data(){
		return{
			d:''
		}
	},
	name: 'App',
	components: {
		login
	},
	methods:{
		test_recup_data(){
			this.$http.get('p/test').then(res =>{
				console.log(res)
			},res =>{

			})
		},
		check_connect(){
			this.$http.get('p/check_connect').then(res =>{
				console.log(res)
			},res =>{

			})
		}
	},
	created(){
		this.check_connect()
	}
}
</script>

<style>
</style>
