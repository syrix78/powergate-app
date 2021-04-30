
//Login.vue
//https://www.codeply.com/p/hBkZaWgmnk
<template>
   <v-app>
        <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
            <div>
                <v-tabs v-model="tab" show-arrows background-color="primary" icons-and-text dark grow>
                    <v-tabs-slider color="blue darken-4"></v-tabs-slider>
                    <v-tab v-for="i in tabs" :key="i">
                        <v-icon large>{{ i.icon }}</v-icon>
                        <div class="caption py-1">{{ i.name }}</div>
                    </v-tab>
                    <v-tab-item>
                        <v-card class="px-4">
                            <v-card-text>
                                <v-form ref="loginForm" v-model="valid" lazy-validation>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field v-model="userToken" label="Token" required></v-text-field>
                                        </v-col>
                                        <v-col class="d-flex" cols="12" sm="6" xsm="12">
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                            <v-btn x-large block :disabled="!valid" color="success" @click="validate_login"> Login </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card class="px-4">
                            <v-card-text>
                                <v-form ref="registerForm" v-model="valid" lazy-validation>
                                    <v-row>
                                        
                                        <v-col cols="12">
                                            
                                        </v-col>
                                      
                                        <v-spacer></v-spacer>
                                        <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                                            <v-btn x-large block :disabled="!valid" color="success" @click="validate_register">Register</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </div>
        </v-dialog>
    </v-app>
</template>


<script>

console.log("Hello World")
export default {
  

  name: "Login",

  data: function () { return {
    dialog: true,
    tab: 0,
    tabs: [
        {name:"Login", icon:"mdi-account"},
        {name:"Register", icon:"mdi-account-outline"}
    ],
    valid: true,
    pow: this.$store.getters.getPow,
    userToken: "",
    dealMinDuration: 518400,

    show1: false,
    
  }},
  
  methods: {
    setUser() {
      let input = this.userToken;
      this.setUserToken(input);
      this.$router.push('/');
    },
    createUser() {
      this.pow.admin.users.create().then((res) => {
        if (res.user) {
          this.setUserToken(res.user.token);
        }
      }, console.error);
      this.$router.push('/');
    },

    getUser() {
      return this.$store.state.userToken
    },

    setUserToken(token) {
      this.userToken = token;
      this.$store.commit('setUserToken', token)
      this.pow.setToken(token);
      this.loadUserInfo();
    },

    // user info
    loadUserInfo() {
      var store = this.$store
      this.addresses = [];
      this.defaultConfig = "";
      this.pow.wallet.addresses().then((v) => {
        console.log(v.addressesList)
        store.commit('setAddresses', v.addressesList) ;
      }, console.error);
      this.pow.storageConfig.default().then((v) => {
        store.commit('setConfig', v.defaultStorageConfig);
      });
    },

    validate_login() {
      this.setUser()
    },

    validate_register() {
      this.createUser()
    }
  
    
  },
};
</script>
