<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Filecoin Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo.png"
          transition="scale-transition"
          width="40"
        />

        
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="$router.push('login')"
        
        text
      >
        <span class="mr-2">Login/Register</span>
      </v-btn>
      
    </v-app-bar>


    
         
            <router-view></router-view>
         
      
    <v-main >
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';



export default {
  name: 'App',

  components: {
    HelloWorld,

  },

  data: () => ({
    //
    
  }),
  methods: {
    
  
    
  },

  
};
</script>
