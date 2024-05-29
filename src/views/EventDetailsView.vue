<template>
  <v-layout>
    <div class="containment">
      <div class="event-details">
        <v-card class="content">
          <div class="title">Event Details</div>
          <div class="custom">
            <v-container>
              <v-row>
                <v-col cols="4">
                  <div class="input-type">Hobby:</div>
                  <div>{{ hobbyGroupName }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="input-type">Event Name:</div>
                  <div>{{ event.name }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="input-type">Fee:</div>
                  <div>{{ event.fee }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="input-type">Capacity:</div>
                  <div>{{ event.capacity }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="input-type">Participants:</div>
                  <div>{{ event.participants ? event.participants.length : 0 }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="input-type">Date and Time:</div>
                  <div>{{ formattedDateTime }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="input-type">Description:</div>
                  <div>{{ event.description }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="input-type">Location:</div>
                  <GoogleMap api-key="AIzaSyBKQsulm2ANzxCYno_-9IBsh1LyGg6bS8k" style="width: 960px; height: 230px"
                    :center="location" :zoom="10">
                    <Marker :options="{ position: location }" />
                  </GoogleMap>
                </v-col>
                <v-col cols="12" class="text-center">
                  <v-btn color=#71d774 @click="joinEvent">Join Event</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card>
      </div>
    </div>
    <Footer />
  </v-layout>
</template>

<script>
import Footer from '@/components/Footer.vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import axios from 'axios';
import moment from 'moment';

export default {
  components: {
    Footer,
    GoogleMap,
    Marker
  },
  data() {
    return {
      event: {},
      hobbyGroupName: '',
      location: { lat: 0, lng: 0 }
    };
  },
  computed: {
    formattedDateTime() {
      return moment(this.event.dateTime).format('MMMM Do YYYY, h:mm:ss a');
    }
  },
  methods: {
    async fetchEventDetails() {
      try {
        const eventId = this.$route.params.id;
        const response = await axios.get(`http://localhost:8080/hobby-sync/hobby-events/${eventId}`, { withCredentials: true });
        this.event = response.data;

        // Obțineți detalii despre grupul de hobby-uri
        const hobbyGroupResponse = await axios.get(`http://localhost:8080/hobby-sync/hobby-groups/${this.event.hobbyGroupId}`, { withCredentials: true });
        this.hobbyGroupName = hobbyGroupResponse.data.name;

        // Set location for the map
        this.location = { lat: this.event.xCoord, lng: this.event.yCoord };
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      }
    },
    joinEvent() {
      console.log('Joining event:', this.event.id);
      // Logica pentru a participa la eveniment
    }
  },
  mounted() {
    this.fetchEventDetails();
  }
};
</script>
  
<style scoped>
.text-center{
  margin-left: -8vw;
}
.containment {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/backgroundBlue.png");
  background-size: cover;
  margin-left: -50vw;
  margin-right: -50vw;
  left: 50%;
  right: 50%;
  overflow-x: auto;
  overflow-y: auto;
}

.event-details {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1400px;
  height: 750px;
}

.content {
  width: 1050px;
  height: 600px;
  background-color: #015986;
  border-radius: 60px;
  border: 6px solid white;
  margin-left: -10px;
  padding: 15px;
  padding-bottom: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.title {
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #71d774;
}

.input-type {
  margin-bottom: 5px;
  font-weight: bold;
  color: white;
}

.custom {
  margin-left: 10px;
  width: 1225px;
}

.events {
  padding: 20px;
  background: #015986;
  border-radius: 50px;
  margin-bottom: 20px;
  font-family: "Platypi", serif;
  font-weight: 700;
  font-size: large;
  font-style: normal;
  color: white;
  max-height: 70.7vh;
  overflow-y: auto;
}
</style>
  