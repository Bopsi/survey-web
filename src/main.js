require("dotenv").config();

import Vue from 'vue';
import axios from 'axios';
import moment from "moment";
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

Vue.prototype.$API_URL = process.env.VUE_APP_API_URL;

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

Vue.filter('fromNow', function(dateString) {
    if(!dateString) return '';
    return moment(dateString).fromNow()
});
Vue.filter('date', function(dateString) {
    if(!dateString) return '';
    return moment(Date.parse(dateString)).format("MMMM Do YYYY");
});
Vue.filter('timestamp', function(dateString) {
    if(!dateString) return '';
    return moment(Date.parse(dateString)).format("MMMM Do YYYY, h:mm:ss a");
});
Vue.filter('long', function(dateString) {
    if(!dateString) return '';
    return moment(Date.parse(dateString)).format("MMM Do, h:mm a");
});
Vue.filter('shorttimestamp', function(dateString) {
    if(!dateString) return '';
    return moment(Date.parse(dateString)).format("MMM Do YYYY, h:mm a");
});
Vue.filter('epoch', function(epochString) {
    return moment.unix(epochString).format('MMM Do YYYY')
});
Vue.filter('medium', function(dateString) {
    if(!dateString) return '';
    return moment(Date.parse(dateString)).format("MMM Do YYYY");
});
Vue.filter('capitalize', function(value) {
    if(!value) return '';
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
});
Vue.filter('lowercase', function(value) {
    if(!value) return '';
    value = value.toString();
    return value.toLowerCase()
});
Vue.filter('truncate', function(text, length, suffix) {
    if(text.length <= length) return text;
    return text.substring(0, length) + suffix;
});
Vue.filter('percentage', function(value, precision) {
    if(value === null || value === undefined) return 0;
    return value.toFixed(precision) + '%';
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