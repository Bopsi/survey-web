require("dotenv").config();

import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VeeValidate from 'vee-validate';
import VueToastr from 'vue-toastr';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faPollH,
    faSignInAlt,
    faUserPlus,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import Clipboard from 'v-clipboard';

import store from './store';
import App from './App.vue'
import router from './router';

import 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/custom.css";

library.add([faPollH, faSignInAlt, faUserPlus, faSignOutAlt]);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.prototype.$API_URL      = process.env.VUE_APP_API_URL;

Vue.use(VeeValidate);

Vue.use(VueAxios, axios.create({
    baseURL: Vue.prototype.$API_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.token
    }
}));

Vue.use(VueToastr, {
    defaultPosition: 'toast-top-right',
    defaultType: 'info',
    defaultTimeout: 5000
});

Vue.use(Clipboard);

Vue.filter('truncate', function(text, length, suffix) {
    if(text.length <= length) return text;
    return text.substring(0, length) + suffix;
});

Vue.axios.interceptors.request.use((config) => {
    let token                    = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, function(error) {
    return Promise.reject(error)
});

Vue.axios.interceptors.response.use((res) => {
    return res;
}, function(error) {
    if(error.response && error.response.status === 401) {
        window.location.href = "/auth/login";
        console.log(error.response.status);
    }
    return Promise.reject(error)
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');