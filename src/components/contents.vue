<template>
    <div class="flex h-screen w-screen">
        <sidebar></sidebar>
        <div class="h-screen max-h-screen overflow-auto bg-gray-100 w-screen border-l border-blue-200">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import sidebar from './contents/sidebar.vue'
export default {
    components:{sidebar},
    data(){
        return{
            
        }
    },
    created(){
        console.log(this.$route);
    }
}
</script>