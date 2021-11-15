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
            <tr @click="click_ligne(i)" class="cursor-pointer duration-300 hover:bg-blue-200 hover:bg-opacity-20 text-left bg-gray-300 bg-opacity-5 rounded-t" v-for="(d,i) in _list" :key="d[_key]"> 
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
    props:['_head','_list','_key'],
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
        }
    }
}
</script>