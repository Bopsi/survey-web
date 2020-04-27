import Vue from 'vue';
import Vuex from 'vuex';

import User from './models/User';

export const LOGIN  = 'LOGIN';
export const LOGOUT = 'LOGOUT';

Vue.use(Vuex);

const state = {
    user: User.from(localStorage.token),
    token: localStorage.getItem("token"),
    isLoggedIn: !!localStorage.getItem("token")
};

const mutations = {
    [LOGIN]: (state, data) => {
        state.token    = data.token;
        state.user     = User.from(data.token);
        localStorage.setItem("token", data.token);
    },
    [LOGOUT]: (state) => {
        state.token = null;
        state.user  = null;
        localStorage.removeItem("token");
    }
};

const getters = {
    currentUser: state => {
        return state.user
    },
    currentOrg: state => {
        return state.user.orgs ? state.user.orgs[state.orgIndex] : []
    },
    isLoggedIn: state => {
        return state.isLoggedIn
    }
};

const actions = {
    login({commit}) {
        commit(LOGIN)
    },

    logout({commit}) {
        commit(LOGOUT)
    }
};

export default new Vuex.Store({
    state: state,
    mutations: mutations,
    getters: getters,
    actions: actions
})