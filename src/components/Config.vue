
//Login.vue
//https://www.codeply.com/p/hBkZaWgmnk
<template>
   <v-app>
        <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
            <div>
                <v-tabs v-model="tab" show-arrows background-color="primary" icons-and-text dark grow >
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
                                            <v-checkbox v-model="hot" :label="`Hot storage: ${hot.toString()}`"></v-checkbox>
                                            <div v-if="hot">
                                              <v-checkbox v-model="allowUnfreeze" :label="`allowUnfreeze: ${allowUnfreeze.toString()}`"></v-checkbox>
                                              <v-text-field v-if="allowUnfreeze" v-model="unfreezeMaxPrice" label="unfreezeMaxPrice" required></v-text-field>
                                            </div>
                                        </v-col>
                                       
                                        <p v-if="error != '' " class="red--text">Error: {{error}}</p>
                                        
                                        <v-spacer></v-spacer>
                                        
                                        <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                            <v-btn x-large block :disabled="!valid" color="success" @click="validate"> Apply </v-btn>
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
                                          <v-checkbox v-model="cold" :label="`Cold storage: ${cold.toString()}`"></v-checkbox>
                                          <div v-if="cold">
                                            <v-text-field v-model="replicationFactor" label="replicationFactor" required></v-text-field>
                                            <v-text-field v-model="dealMinDuration"  label="dealMinDuration" required></v-text-field>
                                            <v-checkbox v-model="renew" :label="`renew: ${renew.toString()}`"></v-checkbox>
                                            <v-text-field v-if="renew" v-model="renewExpirationThreshold"  label="Renew expirationThreshold" required></v-text-field>
                                            <v-text-field v-model="address"  label="address" required></v-text-field>
                                            <v-text-field v-model="maxPrice"  label="maxPrice" required></v-text-field>
                                          </div>
                                          <v-checkbox v-model="repairable" :label="`repairable: ${repairable.toString()}`"></v-checkbox>
                                        </v-col>
                                        <p v-if="error != '' " class="red--text">Error: {{error}}</p>
                                        
                                        <v-spacer></v-spacer>
                                        
                                        <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                                            <v-btn x-large block :disabled="!valid" color="success" @click="validate">Apply</v-btn>
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
        {name:"Hot (IPFS)", icon:"mdi-fire"},
        {name:"Cold (Filecoin)", icon:"mdi-snowflake"}
    ],
    valid: true,
    pow: this.$store.getters.getPow,
    config: this.$store.state.defaultConfigJSON,
    userToken: "",
    
    hot: this.$store.state.defaultConfigJSON.hot.enabled,
    allowUnfreeze: this.$store.state.defaultConfigJSON.hot.allowUnfreeze,
    unfreezeMaxPrice: this.$store.state.defaultConfigJSON.hot.unfreezeMaxPrice,

    cold: this.$store.state.defaultConfigJSON.cold.enabled,
    replicationFactor: this.$store.state.defaultConfigJSON.cold.filecoin.replicationFactor,
    dealMinDuration: this.$store.state.defaultConfigJSON.cold.filecoin.dealMinDuration,
    address: this.$store.state.defaultConfigJSON.cold.filecoin.address,
    renewExpirationThreshold: this.$store.state.defaultConfigJSON.cold.filecoin.renew.threshold,
    maxPrice: this.$store.state.defaultConfigJSON.cold.filecoin.maxPrice,
    renew: this.$store.state.defaultConfigJSON.cold.filecoin.renew.enabled,
    repairable: this.$store.state.defaultConfigJSON.repairable,

    error:"",
    show1: false,

    
  }},
  
  methods: {

    validate() {
      var new_config = this.$store.getters.getConfig
      //hot storage config
      new_config.hot.enabled = this.hot
      if(this.hot){
        new_config.hot.allowUnfreeze = this.allowUnfreeze
        if(this.allowUnfreeze){
          new_config.hot.unfreezeMaxPrice = this.unfreezeMaxPrice
        }
      }
      
      //cold storage config
      new_config.cold.enabled = this.cold
      if(this.cold){
        new_config.cold.filecoin.replicationFactor = this.replicationFactor
        new_config.cold.filecoin.dealMinDuration = this.dealMinDuration
        new_config.cold.filecoin.renew.enabled = this.renew
        if(this.renew){
          new_config.cold.filecoin.renew.threshold = this.renewExpirationThreshold
        }
        new_config.cold.filecoin.address = this.address
        new_config.cold.filecoin.maxPrice = this.maxPrice
        
      }
      new_config.repairable = this.repairable
      
      //var c = new SConfig()

      console.log(new_config)
      console.log(this.pow.storageConfig.setDefault(new_config))
      this.pow.storageConfig.setDefault(new_config).then((PromiseState) => {
        console.log("hello")
        console.log(PromiseState)
        this.$store.commit('setConfig', new_config) ;
        this.$router.push('/');
      }).catch(error =>{
        this.error = error.message
      });

      
      
    },

    
  
    
  },
};
</script>
