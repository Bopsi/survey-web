import Vue from 'vue';
import VueRouter from 'vue-router';
import User from './models/User';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: resolve => require(["./components/protected/ProtectedLayout.vue"], resolve),
            children: [
                {
                    path: '',
                    redirect: { name: 'dashboard'}
                },
                {
                    path: 'dashboard',
                    name: "dashboard",
                    component: resolve => require(["./components/protected/Dashboard.vue"], resolve)
                },
                {
                    path: 'surveys',
                    name: "surveys",
                    component: resolve => require(["./components/protected/survey/Surveys.vue"], resolve)
                },
                {
                    path: 'surveys/:surveyid',
                    name: "survey",
                    props: true,
                    component: resolve => require(["./components/protected/survey/Survey.vue"], resolve)
                }
            ]
        },
        {
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
        }
    ]
});

router.beforeEach((to, from, next) => {
    if(!to.meta.unsecured) {
        let user = User.from(localStorage.token);
        if(user) {
            next()
        } else {
            next({
                name: 'signin'
            })
        }
    }
    next()
});

export default router;