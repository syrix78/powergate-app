import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import Login from './components/Login';
import Config from './components/Config';
import { createPow } from "@textile/powergate-client";

Vue.use(Vuex)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
     {
        path: '/login',
        component: Login,
     },
     {
      path: '/config',
      component: Config,
   },
  
    
  ],
});


const store = new Vuex.Store({
  state: {
    grpcWebProxyAddress: "http://0.0.0.0:6002",
    userToken: '',
    pow: createPow({ host: "http://0.0.0.0:6002" }),
    addresses: [],
    defaultConfigJSON: {},
    defaultConfig: "",
    login: false,
    
  },
  mutations: {
    setUserToken (state, token) {
      state.userToken = token
    },
    setAddresses (state, addressesList) {
      state.addresses = addressesList
    },
    setConfig (state, config) {
      state.defaultConfigJSON = config
      state.defaultConfig = JSON.stringify(config, null, 2)
    },
    setLogin (state, config) {
      state.defaultConfig = config
    },



  },
  getters: {
    getPow: state => {
      return state.pow
    },
    getAddresses: state => {
      return state.addresses
    },
    getConfig: state => {
      return state.defaultConfigJSON
    },
    getConfigText: state => {
      return state.defaultConfig
    },
  }
})
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')

