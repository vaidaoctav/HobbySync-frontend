<template>
    <v-footer class="my-footer" padless>
      <v-row justify="space-between" class="text-center">
        <v-col cols="3" class="text">
          <router-link to="/hobby">
            <v-btn icon="mdi-calendar"
                size="x-large"
                variant="elevated"
                color="green">
            </v-btn>
          </router-link>
          Events
        </v-col>
        <v-col cols="3" class="text">
          <router-link to="/profile">
            <v-btn icon="mdi-account-circle"
                size="x-large"
                variant="elevated"
                color="green">
            </v-btn>
          </router-link>
          Profile
        </v-col>
        <v-col cols="3" class="text">
          <router-link to="/add-event">
            <v-btn icon="mdi-plus-circle"
                size="x-large"
                variant="elevated"
                color="green">
            </v-btn>
          </router-link>
          Add event
        </v-col>
        <v-col cols="3" class="text">
          <router-link to="/">
            <v-btn icon="mdi-logout"
                size="x-large"
                variant="elevated"
                color="green">
            </v-btn>
          </router-link>
          Logout
        </v-col>
      </v-row>
    </v-footer>
  </template>
  
  <script>
  export default {
    name: 'Footer',
    methods: {
      logout() {
        // Implement the logout logic here
        console.log("Logging out...");
        // Redirect or perform other actions after logout
      }
    }
  }
  </script>
  
  <style scoped>
  .my-footer {
    background-color: #015986;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    padding: 10px 0;
    z-index: 10;
  }

  .text {
    font-family: "Platypi", serif;
        font-weight: 400;
        font-size: large;
        font-style: normal;
        color: white;
        text-align: center;
  }
  </style>
  