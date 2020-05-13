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
                    path: 'surveys/:id',
                    name: "survey",
                    props: true,
                    component: resolve => require(["./components/protected/survey/Survey.vue"], resolve)
                },
                {
                    path: 'surveys/:id/records',
                    name: "survey-records",
                    props: true,
                    component: resolve => require(["./components/protected/survey/SurveyRecords.vue"], resolve)
                },
                {
                    path: 'surveys/:surveyid/records/:recordid',
                    name: "survey-record",
                    props: true,
                    component: resolve => require(["./components/protected/survey/SurveyRecord.vue"], resolve)
                },
                {
                    path: 'surveys/:surveyid/question/:questionid',
                    name: "survey-question",
                    props: true,
                    component: resolve => require(["./components/protected/survey/SurveyQuestion.vue"], resolve)
                },
                {
                    path: 'records',
                    name: "records",
                    props: true,
                    component: resolve => require(["./components/protected/record/Records.vue"], resolve)
                },
                {
                    path: 'records/:id',
                    name: "record",
                    props: true,
                    component: resolve => require(["./components/protected/record/Record.vue"], resolve)
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