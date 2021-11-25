import VueRouter from 'vue-router'

const routes = [
    {
        path:'/',
        component:require('@/components/contents/home.vue').default,
        name:'home'
    },
    {
        path:'/parametres',
        component:require('@/components/contents/settings.vue').default,
        name:'settings'
    },
    {
        path:'/utilisateur',
        component:require('@/components/contents/user.vue').default,
        name:'user'
    },
    {
        path:'/emplacement',
        component:require('@/components/contents/emplacement.vue').default,
        name:'emplacement'
    },
    {
        path:'/emplacement/:id',
        component:require('@/components/contents/emplacement/place_vue.vue').default,
        name:'vue_emplacement'
    },
    {
        path:'/stat',
        component:require('@/components/contents/stat.vue').default,
        name:'stat'
    }
]

export default new VueRouter({
    routes
})

