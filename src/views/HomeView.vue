<template>
  <div class="containment">
    <div class="content-overlay">
      <nav class="navigation">
        <button @click="goToLogin" style="border-radius: 50px;">Login</button>
        <button @click="goToRegister" style="border-radius: 50px;">Register</button>
        <button @click="goToAboutUs" style="border-radius: 50px;">About Us</button>
      </nav>
    </div>
    <div style="display: flex; flex-direction: row;">
      <header class="header">
        <img src="../assets/LogoBlue.png" width="600px" height="150px"
          style="align-self: center; margin-bottom: 75px; margin-top: 125px;">
        <p>Connect with local events and communities that share your passions. Discover, engage, and expand your hobbies
          with HobbySync. Join the fun, meet new friends, and explore your interests with ease.</p>
      </header>
      <v-spacer></v-spacer>
      <img src="../assets/Home.jpg" width="500px" height="500px"
        style="border-radius: 100px; margin-right: 125px; margin-top: 75px;">
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    goToLogin() {
      this.$router.push({ name: 'login' });
    },
    goToRegister() {
      this.$router.push({ name: 'register' });
    },
    goToAboutUs() {
      this.$router.push({ name: 'about' });
    },
    goToExplore() {
      this.$router.push({ name: 'explore' });
    },
    goToEvents() {
      this.$router.push({ name: 'events' });
    },
    goToContact() {
      this.$router.push({ name: 'contact' });
    }
  }
}
</script>

<style scoped>
.home-container {
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: white;
  font-family: "Platypi", serif;
}

.containment {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/backgroundBlue.png");
  background-position: center;
  background-size: cover;
  margin-left: -50vw;
  margin-right: -50vw;
  left: 50%;
  right: 50%;
  overflow-x: auto;
  overflow-y: auto;
}

.content-overlay {
  background-color: rgba(0, 0, 50, 0.6);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.header {
  margin-left: 50px;
  display: flex;
  flex-direction: column;
}

.header h1 {
  font-size: 3rem;
  margin: 0;
  margin-bottom: 75px;
  margin-top: 100px;
  text-align: center;
  font-family: "Platypi", serif;
  font-weight: 700;
  font-size: xx-large;
  font-style: normal;
  color: white;
}

.header p {
  font-size: 1.4rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  max-width: 600px;
  text-align: center;
  font-family: "Platypi", serif;
  font-weight: 400;
  font-size: x-large;
  font-style: normal;
  color: #01436e;
}

.navigation button {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 10px 20px;
  margin: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.navigation button:hover {
  background-color: white;
  color: #003366;
}
</style>