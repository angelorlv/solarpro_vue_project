<template>
    <div class="h-screen max-h-screen flex flex-col overflow-auto" :style="sidebar_style">
        <div class="p-2 border-b  border-gray-300 text-gray-700">
            <span class="text-3xl"> Solarpro </span> <span class="text-xl">Admin</span>
        </div>
        <div class="p-2">
            <router-link class="menu_sidebar" 
            :to="{name:'home'}">
                <span class="material-icons">
                    home
                </span>
                <span class="ml-5">
                    Accueil
                </span>
            </router-link>

            <router-link class="menu_sidebar" 
            :to="{name:'emplacement'}">
                <span class="material-icons">
                    place
                </span>
                <span class="ml-5">
                    Emplacement
                </span>
            </router-link>

            <router-link class="menu_sidebar" 
            :to="{name:'user'}">
                <span class="material-icons">
                    face
                </span>
                <span class="ml-5">
                    Utilisateur
                </span>
            </router-link>

            <router-link class="menu_sidebar" 
            :to="{name:'settings'}">
                <span class="material-icons">
                    settings
                </span>
                <span class="ml-5">
                    Paramètres
                </span>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            sidebar_style:{
                minWidth:250+'px'
            }
        }
    }
}
</script>