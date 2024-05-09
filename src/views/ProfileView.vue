<template>
  <v-layout>
    <div class="profile-container">
      <div class="left-panel">
        <div class="profile-info">
          <img v-if="editableUser.profileImage" :src="editableUser.profileImage" alt="Profile Image"
            class="profile-image" />
          <img v-else src="../assets/defaultProfile.png" alt="Default Profile" class="profile-image" />
          <h3>{{ editableUser.firstName }} {{ editableUser.lastName }}</h3>
          <p><strong>Username:</strong> {{ editableUser.username }}</p>
          <p><strong>Email:</strong> {{ editableUser.email }}</p>
          <button style="color:#4caf50 " @click="editMode = !editMode">Editare Profil</button>
        </div>
        <div v-if="editMode" class="edit-form">
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="input-type">First name:</div>

            <v-text-field v-model="editableUser.firstName" prepend-inner-icon="mdi-card-account-details" variant="solo"
              class="donodash-input" density="compact" rounded></v-text-field>
          </div>
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="input-type">Last name:</div>

            <v-text-field v-model="editableUser.lastName" prepend-inner-icon="mdi-card-account-details" variant="solo"
              class="donodash-input" density="compact" rounded></v-text-field>
          </div>
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="input-type">Username:</div>

            <v-text-field v-model="editableUser.username" prepend-inner-icon="mdi-account-tie" variant="solo"
              class="donodash-input" density="compact" rounded></v-text-field>
          </div>
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="input-type">Email:</div>

            <v-text-field v-model="editableUser.email" prepend-inner-icon="mdi-email-search-outline" variant="solo"
              class="donodash-input" density="compact" rounded></v-text-field>
          </div>
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="input-type">Picture:</div>
            <v-file-input prepend-icon="" v-model="editableUser.profileImage" prepend-inner-icon="mdi-camera"
              variant="solo" class="donodash-input" density="compact" rounded></v-file-input>
          </div>
          <button style="height: 10px; justify-self: center; color: #4caf50;" @click="saveProfile">Salvează</button>
        </div>
      </div>
      <div class="right-panel">
        <div class="events-header">
          <h2 style="text-align: center; color: #4caf50;">Evenimentele Mele</h2>
          <div class="events">
            <div v-for="event in events" :key="event.id" class="event">
              <h3>{{ event.name }}</h3>
              <p>{{ event.dateTime }}</p>
              <p>{{ event.description }}</p>
              <button style="color: #4caf50" @click="toggleReview(event.id)">Vezi Review</button>
              <div v-if="event.showReview" class="review">
                <p>{{ event.review.comment }}</p>
                <star-view :rating="event.review.rating"></star-view>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-dialog v-model="showPasswordDialog" persistent max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirmare actualizare profil</v-card-title>
          <v-card-text>
            Introdu parola pentru a confirma actualizările.
            <v-text-field v-model="passwordForConfirmation" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" label="Parolă"
              single-line dense></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="showPasswordDialog = false">Anulează</v-btn>
            <v-btn color="blue darken-1" text @click="confirmProfileUpdate">Confirmă</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <Footer></Footer>
  </v-layout>
</template>
  
<script>
import StarView from './StarView.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    StarView,
    Footer
  },
  data() {
    return {
      showPasswordDialog: false,
      passwordForConfirmation: '',
      showPassword: false,
      visible: false,
      editMode: false,
      editableUser: {
        firstName: 'Ion',
        lastName: 'Popescu',
        username: 'ionpopescu',
        email: 'ion@example.com',
        password: 'parola123',
        profileImage: 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg'
      },
      events: [
        { id: 1, name: 'Concert Rock', dateTime: '2023-05-20 20:00', description: 'Concert de rock în aer liber.', review: { comment: 'A fost incredibil!', rating: 5 }, showReview: false },
        { id: 2, name: 'Atelier de Pictură', dateTime: '2023-06-11 16:00', description: 'Atelier de pictură pentru începători.', review: { comment: 'Foarte instructiv.', rating: 4 }, showReview: false },
        { id: 3, name: 'Atelier de Pictură', dateTime: '2023-06-11 16:00', description: 'Atelier de pictură pentru începători.', review: { comment: 'Foarte instructiv.', rating: 4 }, showReview: false },
        { id: 4, name: 'Atelier de Pictură', dateTime: '2023-06-11 16:00', description: 'Atelier de pictură pentru începători.', review: { comment: 'Foarte instructiv.', rating: 4 }, showReview: false },
        { id: 5, name: 'Atelier de Pictură', dateTime: '2023-06-11 16:00', description: 'Atelier de pictură pentru începători.', review: { comment: 'Foarte instructiv.', rating: 4 }, showReview: false },
        { id: 6, name: 'Atelier de Pictură', dateTime: '2023-06-11 16:00', description: 'Atelier de pictură pentru începători.', review: { comment: 'Foarte instructiv.', rating: 4 }, showReview: false },
        { id: 7, name: 'Atelier de Pictură', dateTime: '2023-06-11 16:00', description: 'Atelier de pictură pentru începători.', review: { comment: 'Foarte instructiv.', rating: 4 }, showReview: false }

      ]
    };
  },

  methods: {
    openConfirmDialog() {
      this.showPasswordDialog = true;
    },
    confirmProfileUpdate() {
      if (this.passwordForConfirmation === this.editableUser.password) {
        this.saveProfile();
        this.showPasswordDialog = false;
        this.passwordForConfirmation = ''; // Resetează câmpul de parolă după folosire
      } else {
        alert('Parola incorectă!'); // Afișează un mesaj de eroare
      }
    },
    saveProfile() {
      this.openConfirmDialog();
      console.log('Profilul a fost actualizat:', this.editableUser);
      this.editMode = false;
    },
    toggleReview(id) {
      const event = this.events.find(event => event.id === id);
      if (event) {
        event.showReview = !event.showReview;
      }
    }
  }
};
</script>
  
<style scoped>
.profile-container {
  display: flex;
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
  /* overflow-x: auto;
        overflow-y: auto; */
  overflow: hidden;
}

.left-panel,
.right-panel {
  flex: 1;
  padding: 20px;
  /* overflow: hidden; */
}

.profile-info,
.edit-form {
  padding: 20px;
  background: #015986;
  border-radius: 50px;
  margin-bottom: 10px;
  font-family: "Platypi", serif;
  font-weight: 700;
  font-size: medium;
  font-style: normal;
  color: white;
  justify-content: center;
}

.profile-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 260px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 350px;
}

.events-header {
  padding: 20px;
  background: #015986;
  border-radius: 50px;
  font-family: "Platypi", serif;
  font-weight: 700;
  font-size: large;
  font-style: normal;
  color: white;
}

.profile-image {
  width: 85px;
  height: 85px;
  border-radius: 50%;
}

input,
button {
  display: block;
  margin: 10px 0;
  padding: 8px;
}

.donodash-input {
  width: 10px important !;
  height: 30px;
  margin-bottom: 25px;
  margin-left: 50px;
}

.events {
  padding: 20px;
  background: #015986;
  border-radius: 50px;
  margin-bottom: 20px;
  margin-left: 800px;
  font-family: "Platypi", serif;
  font-weight: 700;
  font-size: large;
  font-style: normal;
  color: white;
  max-height: 70.7vh;
  overflow-y: auto;
}

.input-type {
  width: 100px;
}
</style>
  