<template>
    <table class="w-full text-gray-700 rounded">
        <thead class="rounded">
            <tr class="text-left border-b bg-green-400 rounded-t">
                <th class="" v-for="h in _head" :key="h.label">
                    {{ h.label }}
                </th>
                <th>

                </th>
            </tr>
        </thead>
        <tbody>
            <tr @click="click_ligne(i)" v-show="match_search(d)" class="cursor-pointer duration-300 hover:bg-blue-200 hover:bg-opacity-20 text-left bg-gray-300 bg-opacity-5 rounded-t" v-for="(d,i) in _list" :key="d[_key]"> 
                <td class="" v-for="h in _head" :key="h.label">
                    {{ d[h.code] }}
                </td>
                <td class="flex justify-end items-center">
                    <button class="bt-icon mr-2" @click="on_delete(i)"> <span class="material-icons"> delete </span> </button>
                    <button class="bt-icon mr-2" @click="on_view(i)"> <span class="material-icons"> open_in_full </span> </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>


export default {
    //head est un tableau contenant les labels de têtes
    props:['_head','_list','_key','search','col_search'],
    data(){
        return{

        }
    },
    methods:{
        click_ligne(i){
            this.$emit('on_click',i)
        },
        on_delete(i){
            this.$emit('on_delete',i)
        },
        on_view(i){
            this.$emit('on_view',i)
        },
        match_search(d){
            if(this.col_search === undefined){
                return true
            }
            if(d[this.col_search] == null){
                return false
            }else{
                if(this.search != undefined && this.search != ''){
                    let r = new RegExp('.?'+this.search+'.?','gi')
                    if(d[this.col_search].match(r)!=null){
                        return true
                    }else{
                        return false
                    }
                }else{
                    return true
                }
            }
        }
    }
}
</script>