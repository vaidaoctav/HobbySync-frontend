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
                  <div>{{ event.hobbyGroupName }}</div>
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
                  <div>{{ event.participants }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="input-type">Date and Time:</div>
                  <div>{{ event.date + " " + event.time}}</div>
                </v-col>
                <v-col cols="12">
                  <div class="input-type">Description:</div>
                  <div>{{ event.description }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="input-type">Location:</div>
                  <GoogleMap
                    api-key="AIzaSyBKQsulm2ANzxCYno_-9IBsh1LyGg6bS8k"
                    style="width: 960px; height: 230px"
                    :center="event.location"
                    :zoom="10"
                  >
                    <Marker :options="{ position: event.location }" />
                  </GoogleMap>
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
  
  export default {
    components: {
      Footer,
      GoogleMap,
      Marker
    },
    data() {
    return {
      event: {
        hobbyGroupName: 'Art & Design',
        name: 'Art Exhibition',
        description: 'An exhibition showcasing various art pieces.',
        capacity: 100,
        participants: 20,
        fee: '$10',
        date: '2024-05-10',
        time: '10:00 AM',
        location: {
          lat: 40.7128,
          lng: -74.0060
        }
      }
    };
  }
  };
  </script>
  
  <style scoped>
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
  .custom{
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
  