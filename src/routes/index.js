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
    }
]

export default new VueRouter({
    routes
})

