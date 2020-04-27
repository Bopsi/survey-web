import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/auth',
        component: resolve => require(["./components/auth/AuthLayout.vue"], resolve),
        children: [
            {
                path: 'signin',
                name: "signin",
                meta: {unsecured: true},
                component: resolve => require(["./components/auth/SignIn.vue"], resolve)
            },
            {
                path: 'signup',
                name: "signup",
                meta: {unsecured: true},
                component: resolve => require(["./components/auth/SignUp.vue"], resolve)
            }
        ]
    }]
})