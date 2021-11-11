<template>
	<div id="app" class="flex justify-center items-center bg-gray-200 h-screen w-screen">
		<div class="p-5 rounded bg-blue-300 bg-opacity-20 flex flex-col">
			<span class="text-4xl text-gray-700">SolarPro en cours de construction</span>
			<span class="">  {{ d }} </span>
		</div>
	</div>
</template>

<script>


export default {
	data(){
		return{
			d:''
		}
	},
	name: 'App',
	components: {

	},
	methods:{
		test_recup_data(){
			let self = this
			$.get('/api/test',function(data){
				self.d = data
			})
		}
	},
	created(){
		this.test_recup_data()
	}
}
</script>

<style>
</style>
