<template>
  <div  class="relative">
      <button @blur="hide" class="p-2 bt-select rounded border cursor-pointer bg-white" @click="show"> {{ selected[label]+" "+((label2 != undefined)?selected[label2]:'') }} </button>

      <div @mouseover="hover(true)" @mouseleave="hover(false)" v-if="clicked"  class="cselect-list bg-white shadow-lg absolute  rounded border top-0 z-40" >
        <div class="p-2" v-if="search != undefined">
            <input v-model.trim="search_text" type="text" class="input" autofocus :placeholder="selected[label]+' '+((label2 != undefined)?selected[label2]:'')">
        </div>
        <div  class="overflow-auto c-list rounded-b">
          <div :title="(title_sens != undefined)?d[title_sens]:''" v-show="match_search(d)" :class="(i == id_selected)?'bg-blue-200 c-list-selected':''" class=" flex items-center cursor-pointer p-2 hover:bg-blue-500 hover:text-white" v-for="d,i in datas" :key="d[code]" @click="selection(i,$event)">
            <span class="pr-2" > {{ d[label] }} </span> 
            <span v-if="label2 != undefined" class="whitespace-nowrap pr-2" > {{ d[label2] }} </span> 
            <span class="pr-2" v-if="title_sens != undefined"> ({{ d[title_sens] }}) </span>
            <span v-if="i == id_selected" class="text-right material-icons flex-grow">check_circle</span>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  watch : {
    clicked(t){
      if(t){
        let self = this
        setTimeout(function(){
          $('.c-list').scrollTop(self.scrollT)
        },300)
        window.addEventListener('click',this.hide)
      }else{
        window.removeEventListener('click',this.hide)
      }
    },
    datas(){
      this.id_selected = 0
      this.selected = this.datas[this.id_selected]
      this.$emit('selected',this.id_selected)
    }
  },
  methods: {
	selection(index,event){
		if(index != this.id_selected){
			this.id_selected = index
			this.selected = this.datas[this.id_selected]
			this.is_hover = false
			this.$emit('selected',this.id_selected)
      
      this.scrollT = $('.c-list').scrollTop()
		}
		this.clicked = false
	},
	show(event){
		this.clicked = true
		this.currentTarget = event.currentTarget
	
	},
	hover(t){
		this.is_hover = t
	},
	hide(e){
		// console.log(e.target.nextElementSibling.classList.contains('cselect-list'))
		if(e.target.nextElementSibling == null && !this.is_hover){
			this.clicked = false
		}else if(e.target.nextElementSibling != null && !e.target.nextElementSibling.classList.contains('cselect-list')){
			this.clicked = false
		}
	},
		test(){
		console.log('load');
	},
	match_search(d){
		
		if(this.search_text == ''){
			return true
		}else{
			let r = new RegExp('.?'+this.search_text+'.?','gi')
			if(d[this.label].match(r)!=null || (this.label2 != undefined && d[this.label2].match(r)!=null)){
				return true
			}else{
				return false
			}
		}
	}
  },
  computed:{
	
  },
  props: ['datas','label','label2','code','search','title_sens'],
  data() {
    return {
      selected:this.datas[0],
      id_selected:0,
      clicked:false,
      currentTarget:null,
      scrollT:0,
      search_text:''
    }
  },
  
  created() {
    this.selected = this.datas[this.id_selected]
    this.$emit('selected',this.id_selected)
  },
  mounted(){
    
  }
};
</script>

<style scoped>
.cselect-list{
  min-width: 200px;
}
.c-list{
  scroll-behavior:smooth;
  max-height: 300px;
}
</style>