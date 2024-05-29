<template>
    <v-layout>
        <div class="containment">
            <div class="event-form">
                <v-card class="content">
                    <div class="title">Add Event</div>
                    <v-form>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <div class="custom-class">
                                        <div class="input-type">Hobby:</div>
                                        <v-select v-model="selectedHobby" :items="hobbyGroups.map(group => group.name)"
                                            required variant="solo" class="donodash-input-custom" density="compact"
                                            rounded></v-select>
                                    </div>
                                </v-col>
                                <v-col cols="4">
                                    <div class="custom-class">
                                        <div class="input-type">Event Name:</div>
                                        <v-text-field v-model="event.name" prepend-inner-icon="mdi-account-group-outline"
                                            required variant="solo" class="donodash-input" density="compact"
                                            rounded></v-text-field>
                                    </div>
                                </v-col>
                                <v-col cols="4">
                                    <div class="custom-class">
                                        <div class="input-type">Description</div>
                                        <v-text-field v-model="event.description" prepend-inner-icon="mdi-text" required
                                            variant="solo" class="donodash-input" density="compact" rounded></v-text-field>
                                    </div>
                                </v-col>
                                <v-col cols="4">
                                    <div class="custom-class">
                                        <div class="input-type">Date:</div>
                                        <datepicker format="yyyy:MM:dd" style="background-color: white ; width: 150px;
                                            height: 35px; margin-bottom: 25px; margin-left: 20px; text-align: center; "
                                            v-model="picked" />
                                    </div>
                                </v-col>
                                <v-col cols="4">
                                    <div class="custom-class">
                                        <div class="input-type">Capacity:</div>
                                        <v-text-field type="text" v-model="event.capacity"
                                            prepend-inner-icon="mdi-chair-rolling" required variant="solo"
                                            class="donodash-input" density="compact" rounded></v-text-field>
                                    </div>
                                </v-col>
                                <v-col cols="4">
                                    <div class="custom-class">
                                        <div class="input-type">Fee:</div>
                                        <v-text-field type="text" v-model="event.fee" prepend-inner-icon="mdi-cash" required
                                            variant="solo" class="donodash-input" density="compact" rounded></v-text-field>
                                    </div>
                                </v-col>
                                <v-col cols="4">
                                    <div class="custom-class">
                                        <div class="input-type">Time:</div>
                                        <timepicker format="hh:mm" style="background-color: white ; width: 150px;
                                            height: 35px; margin-bottom: 25px; margin-left: 20px; text-align: center;"
                                            v-model="rest_time"></timepicker>
                                    </div>
                                </v-col>
                                <v-col cols="12">
                                    <div class="input-type-location">Location:</div>
                                    <div class="custom-class-map">
                                        <GoogleMap api-key="AIzaSyBKQsulm2ANzxCYno_-9IBsh1LyGg6bS8k"
                                            style="width: 925px; height: 400px" :center="center" :zoom="10"
                                            @click="updateLocation">
                                            <Marker :options="{ position: markerPosition }" />
                                        </GoogleMap>
                                    </div>
                                </v-col>
                            </v-row>
                            <div style="display: flex; flex-direction: column; margin-top: 5px;">
                                <v-btn large color="success" class="ma-2" @click="submitEvent"
                                    style="align-self: center; justify-self: center;">Create Event</v-btn>
                            </div>
                        </v-container>
                    </v-form>
                </v-card>
            </div>
        </div>
        <Footer></Footer>
        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
            {{ snackbarMessage }}
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-layout>
</template>


<script>
import axios from 'axios';
import Footer from '@/components/Footer.vue';
import Datepicker from 'vue3-datepicker/src/datepicker/Datepicker.vue'
import Timepicker from 'vue3-timepicker/src/VueTimepicker.vue'
import { GoogleMap, Marker } from 'vue3-google-map'


export default {
    components: {
        Footer,
        Datepicker,
        Timepicker,
        GoogleMap,
        Marker
    },
    data() {
        return {
            center: { lat: 51.093048, lng: 6.842120 },
            markerPosition: { lat: 51.093048, lng: 6.842120 },
            menuDate: '',
            picked: new Date(),
            menuTime: '',
            event: {
                name: '',
                description: '',
                capacity: '',
                fee: '',
                date: null,
                // time: '10:00',
                hobbyGroupName: '',
                location: ''
            },
            rest_time: {
                hh: "01",
                mm: "00",
            },
            selectedDate: null,
            // selectedTime: '10:00',
            mapDialog: false,
            hobbyGroups: [],
            hobbyNames: [],
            selectedHobby: null,
            snackbar: false,
            snackbarMessage: '',
            snackbarColor: ''
        };
    },
    methods: {
        updateLocation(event) {
            this.markerPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };
            this.center = this.markerPosition;
        },
        async fetchHobbyGroups() {
            try {
                const response = await axios.get('http://localhost:8080/hobby-sync/hobby-groups', { withCredentials: true });
                this.hobbyGroups = response.data;
                this.hobbyNames = this.hobbyGroups.map(group => group.name);
            } catch (error) {
                console.error('Failed to fetch hobby groups:', error);
            }
        },
        async submitEvent() {
            try {
                const selectedHobbyObj = this.hobbyGroups.find(group => group.name === this.selectedHobby);
                // If the hobby object is found, extract the id and submit it
                if (selectedHobbyObj) {
                    this.event.hobbyGroupId = selectedHobbyObj.id;
                    // Submit hobbyGroupId along with other event data
                }

                const isoDateTime = new Date(this.picked).toISOString();

                // Extract the time from rest_time
                const time = `${this.rest_time.hh}:${this.rest_time.mm}`;

                // Combine date and time to create the dateTime string
                const dateTime = `${isoDateTime.substring(0, 10)}T${time}:00`;
                const event = {
                    name: this.event.name,
                    description: this.event.description,
                    capacity: this.event.capacity,
                    fee: this.event.fee,
                    dateTime: dateTime,
                    xCoord: this.center.lat,
                    yCoord: this.center.lng,
                    hobbyGroupId: this.event.hobbyGroupId // Folosește hobbyGroupId în loc de hobbyGroupName
                };
                const response = await axios.post('http://localhost:8080/hobby-sync/hobby-events', event, { withCredentials: true });
                console.log('Event added successfully:', response.data);
                this.showSnackbar('Event added successfully!', 'success');
            } catch (error) {
                console.error('Failed to add event:', error);
                this.showSnackbar('Failed to add event!', 'error');
            }
        },
        showSnackbar(message, color) {
            this.snackbarMessage = message;
            this.snackbarColor = color;
            this.snackbar = true;
        }
    },
    mounted() {
        this.fetchHobbyGroups();
    }
};
</script>

<style scoped>
.datepicker-container {
    --datepicker-bg-color: white;
    /* Override the background color variable */
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

.event-form {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1500px;
    height: 650px;
}

.content {
    width: 1200px;
    height: 600px;
    background-color: #015986;
    border-radius: 60px;
    border: 6px solid white;
    margin-left: auto;
    margin-right: auto;
    padding: 5px;
    padding-bottom: 8px;
    overflow-y: auto;
}

.title {
    margin: 25px auto 0 auto;
    font-family: "Archivo Black", sans-serif;
    font-weight: 400;
    font-size: xx-large;
    font-style: normal;
    color: #71d774;
    text-align: center;
}

.input-type {
    margin-left: 10px;
    margin-bottom: 5px;
    margin-top: 10px;
    width: 200px;
    font-family: "Platypi", serif;
    font-weight: 200;
    font-size: medium;
    font-style: normal;
    color: white;
}

.donodash-input {
    width: 375px;
    height: 30px;
    margin-bottom: 25px;
    margin-left: 20px;
}

.donodash-input-cust {
    width: 400px;
    height: 30px;
    margin-bottom: 25px;
    margin-left: 20px;
    color: white !important;
}

.donodash-input-custom {
    width: 925px;
    height: 30px;
    margin-bottom: 25px;
    margin-left: 20px;
}

.donodash-orange-button {
    font-family: "Platypi", serif;
    font-weight: 400;
    font-style: normal;
    background-color: #46c6ed;
    color: white;
    width: 200px;
    margin-top: 10px;
    margin-left: 388px;
}

.some-text {
    color: #25B7A1;
    font-family: "Platypi", serif;
    font-weight: 400;
    font-style: normal;
    font-size: medium;
    margin-top: 6.5px;
}

.login-button {
    font-family: "Platypi", serif;
    font-weight: 400;
    font-style: normal;
    font-size: medium;
    color: #46c6ed;
    text-transform: unset !important;
    width: 57px;
}

:deep(.v-messages__message) {
    color: white;
}

.custom-class {
    margin-left: 75px;
}

.custom-class-map {
    margin-left: 100px;
}

.input-type-location {
    margin-left: 90px;
    margin-bottom: 5px;
    margin-top: 10px;
    width: 200px;
    font-family: "Platypi", serif;
    font-weight: 200;
    font-size: medium;
    font-style: normal;
    color: white;
}
</style>
