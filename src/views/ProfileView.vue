<template>
  <v-layout>
    <div class="profile-container">
      <div class="left-panel">
        <div class="profile-info">
          <div class="profile-photo" :style="{ 'background-image': 'url(' + editableUser.profileImage + ')' }"></div>
          <h3>{{ editableUser.firstName }} {{ editableUser.lastName }}</h3>
          <p><strong>Username:</strong> {{ editableUser.username }}</p>
          <p><strong>Email:</strong> {{ editableUser.email }}</p>
          <button style="color:#4caf50 " @click="editMode = !editMode">Edit Profile</button>
        </div>
        <div v-if="editMode" class="edit-form">
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="input-type">First name:</div>

            <v-text-field v-model="editableUser.firstName" prepend-inner-icon="mdi-card-account-details" variant="solo"
              class="input" density="compact" rounded ></v-text-field>
          </div>
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="input-type">Last name:</div>

            <v-text-field v-model="editableUser.lastName" prepend-inner-icon="mdi-card-account-details" variant="solo"
              class="input" density="compact" rounded></v-text-field>
          </div>
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="input-type">Username:</div>

            <v-text-field v-model="editableUser.username" prepend-inner-icon="mdi-account-tie" variant="solo"
              class="input" density="compact" rounded></v-text-field>
          </div>
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="input-type">Email:</div>

            <v-text-field v-model="editableUser.email" prepend-inner-icon="mdi-email-search-outline" variant="solo"
              class="input" density="compact" rounded></v-text-field>
          </div>
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="input-type">Picture:</div>
            <v-file-input prepend-icon="" prepend-inner-icon="mdi-camera-outline" variant="solo"
                            class="input" density="compact" rounded @change="onFilePicked"></v-file-input>
          </div>
          <button style="height: 10px; justify-self: center; color: #4caf50;" @click="openConfirmDialog">Save</button>
        </div>
      </div>
      <div class="right-panel">
        <div class="events-header">
          <h2 style="text-align: center; color: #4caf50;">My Events</h2>
          <div class="events">
            <div v-for="event in events" :key="event.id" class="event">
              <h3>{{ event.name }}</h3>
              <p>{{ event.dateTime }}</p>
              <p>{{ event.description }}</p>
              <button style="color: #4caf50" @click="toggleReview(event.id)">See review</button>
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
          <v-card-title class="headline">Confirm that you want to update your profile</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="showPasswordDialog = false">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveProfile">Confirm</v-btn>
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
import axios from 'axios';

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
      events: [],
      editableUser: {
        firstName: localStorage.getItem('firstName'),
        lastName: localStorage.getItem('lastName'),
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
        profileImage: '',
        bio: localStorage.getItem('bio')
      }
    };
  },
  mounted() {
    this.setupProfileImage();
    this.fetchEventReviews();
  },
  methods: {
    async fetchEventReviews() {
    try {
      const userId = localStorage.getItem('id'); // sau cum obții ID-ul utilizatorului
      const response = await axios.get(`http://localhost:8080/hobby-sync/review/user/${userId}`, {
        withCredentials: true
      });
      this.events = response.data.map(event => ({
        id: event.eventId,
        name: event.eventName,
        dateTime: event.eventDateTime,
        description: event.eventDescription,
        review: {
          comment: event.reviewComment,
          rating: event.reviewRating
        },
        showReview: false
      }));
    } catch (error) {
      console.error('Error fetching event reviews:', error);
    }
  },
    openConfirmDialog() {
      this.showPasswordDialog = true;
    },
    async saveProfile() {
      console.log('Profilul was updated', this.editableUser);
      this.showPasswordDialog=false;
      try {
        const formData = new FormData();
        formData.append('firstName', this.editableUser.firstName);
        formData.append('lastName', this.editableUser.lastName);
        formData.append('username', this.editableUser.username);
        formData.append('email', this.editableUser.email);
        formData.append('bio',this.editableUser.bio)
        formData.append('profilePicture', this.editableUser.profileImage);

        const response=await axios.put(`http://localhost:8080/hobby-sync/users/${localStorage.getItem('id')}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        });
        const { firstName, lastName, username, bio, profilePicture, email, userType,xCoord,yCoord,id} = response.data;
                localStorage.setItem('firstName', firstName);
                localStorage.setItem('lastName', lastName);
                localStorage.setItem('username', username);
                localStorage.setItem('youtubeChannel', bio);
                localStorage.setItem('profilePicture', profilePicture);
                localStorage.setItem('email', email);
                localStorage.setItem('bio',bio);
                localStorage.setItem('userType', userType);
                localStorage.setItem('xCoord',xCoord);
                localStorage.setItem('yCoord',yCoord);
                localStorage.setItem('id',id);     
      } catch (error) {
        console.error('Error updating profile:', error);
      }
      this.editMode = false;
    },
    toggleReview(id) {
      const event = this.events.find(event => event.id === id);
      if (event) {
        event.showReview = !event.showReview;
      }
    },
    setupProfileImage() {
      const relativePath = localStorage.getItem('profilePicture');
      if (relativePath) {
        this.editableUser.profileImage = `http://localhost:8080${relativePath}`;
      }
    },
    onFilePicked(event) {
            const file = event.target.files[0];
            if (file) {
                this.editableUser.profileImage = file;
            }
  },
}
}
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
  overflow: hidden;
}

.left-panel,
.right-panel {
  flex: 1;
  padding: 20px;
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

.input {
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
  margin-left: 10px;
  font-family: "Platypi", serif;
  font-weight: 700;
  font-size: large;
  font-style: normal;
  color: white;
  height: 70.7vh;
  overflow-y: auto;
}

.input-type {
  width: 100px;
}

.profile-photo {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-bottom: 5px;
}
</style>
  