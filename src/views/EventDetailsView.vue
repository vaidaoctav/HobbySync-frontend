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
                  <div class="green-text">{{ hobbyGroupName }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="input-type">Event Name:</div>
                  <div class="green-text">{{ event.name }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="input-type">Fee:</div>
                  <div class="green-text">{{ event.fee }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="input-type">Capacity:</div>
                  <div class="green-text">{{ event.capacity }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="input-type">Participants:</div>
                  <div class="green-text">{{ event.participants ? event.participants.length : 0 }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="input-type">Date and Time:</div>
                  <div class="green-text">{{ formattedDateTime }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="input-type">Description:</div>
                  <div class="green-text">{{ event.description }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="input-type">Location:</div>
                  <GoogleMap api-key="AIzaSyBKQsulm2ANzxCYno_-9IBsh1LyGg6bS8k" style="width: 775px; height: 230px" :center="location" :zoom="10">
                    <Marker :options="{ position: location }" />
                  </GoogleMap>
                </v-col>
                <v-col cols="12" class="text-center">
                  <v-btn v-if="!isEventFinished" color="#71d774" @click="joinEvent">Participă la Eveniment</v-btn>
                  <v-btn v-else color="#71d774" @click="openReviewDialog">Adaugă Review</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card>
      </div>
      <div class="participant-list">
        <v-card class="content">
          <div class="title fixed-title">{{ isEventFinished ? 'Review-uri' : 'Participanți' }}</div>
          <div class="custom-scroll">
            <v-container>
              <v-row>
                <v-col cols="12" v-if="!isEventFinished" v-for="participant in participants" :key="participant.id">
                  <div class="participant-item">
                    <div class="profile-photo" :style="{ 'background-image': 'url(' + participant.profilePicture + ')' }"></div>
                    <div class="participant-name">{{ participant.firstName }} {{ participant.lastName }}</div>
                  </div>
                </v-col>
                <v-col cols="12" v-else v-for="review in reviews" :key="review.id">
                  <div class="review-item">
                    <div class="participant-item">
                      <div class="profile-photo" v-if="review.user.profilePicture" :style="{ 'background-image': 'url(' + review.user.profilePicture + ')' }"></div>
                      <div class="profile-photo" v-else></div>
                      <div class="participant-name">{{ review.user.firstName }} {{ review.user.lastName }}</div>
                    </div>
                    <button class="review-button" @click="toggleReview(review.id)">Vezi Review</button>
                    <div v-if="review.showReview" class="review">
                      <p>{{ review.comment }}</p>
                      <star-view :rating="review.rating"></star-view>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card>
      </div>
    </div>
    <Footer />
    <v-dialog v-model="reviewDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Add Review</v-card-title>
        <v-card-text>
          <v-textarea v-model="newReview.comment" label="Comentariu" rows="4"></v-textarea>
          <v-rating v-model="newReview.rating" background-color="yellow darken-3" color="yellow" large></v-rating>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="submitReview">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>



<script>
import Footer from '@/components/Footer.vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import axios from 'axios';
import moment from 'moment';
import StarView from './StarView.vue';

export default {
  components: {
    Footer,
    GoogleMap,
    Marker,
    StarView
  },
  data() {
    return {
      event: {},
      hobbyGroupName: '',
      location: { lat: 0, lng: 0 },
      reviewDialog: false,
      newReview: {
        comment: '',
        rating: 0
      },
      reviews: [],
      participants: []
    };
  },
  computed: {
    formattedDateTime() {
      return moment(this.event.dateTime).format('MMMM Do YYYY, h:mm:ss a');
    },
    isEventFinished() {
      return moment().isAfter(this.event.dateTime);
    }
  },
  methods: {
    async fetchEventDetails() {
      try {
        const eventId = this.$route.params.id;
        const response = await axios.get(`http://localhost:8080/hobby-sync/hobby-events/${eventId}`, { withCredentials: true });
        this.event = response.data;
        console.log('Event data:', this.event.participants);
        const hobbyGroupResponse = await axios.get(`http://localhost:8080/hobby-sync/hobby-groups/${this.event.hobbyGroupId}`, { withCredentials: true });
        this.hobbyGroupName = hobbyGroupResponse.data.name;

        this.location = { lat: this.event.xCoord, lng: this.event.yCoord };

        if (!this.isEventFinished) {
          this.fetchParticipants();
        } else {
          this.fetchReviews();
        }
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      }
    },
    async fetchParticipants() {
      if (this.event.participants) {
        this.participants = this.event.participants.map(participant => {
          if (participant.profilePicture) {
            participant.profilePicture = `http://localhost:8080${participant.profilePicture}`;
          }
          return participant;
        });
      }
    },
    async fetchReviews() {
      try {
        const eventId = this.event.id;
        const reviewsResponse = await axios.get(`http://localhost:8080/hobby-sync/review/event/${eventId}`, { withCredentials: true });
        const reviews = reviewsResponse.data;

        if (this.event.participants && Array.isArray(this.event.participants)) {
          const usersMap = new Map(this.event.participants.map(user => [user.id, user]));

          this.reviews = reviews.map(review => {
            const user = usersMap.get(review.userId);
            if (user && user.profilePicture) {
              user.profilePicture = `http://localhost:8080${user.profilePicture}`;
            }
            review.user = user || {};
            review.showReview = false;
            return review;
          });
        } else {
          console.error('No users found in the event data');
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    },
    async joinEvent() {
      try {
        const userId = localStorage.getItem('id');
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');
        const profilePicture = localStorage.getItem('profilePicture');

        if (!userId || !this.event.id) {
          throw new Error("User or event information is missing");
        }

        await axios.put(`http://localhost:8080/hobby-sync/hobby-events/${this.event.id}/join`, userId, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });

        console.log('Successfully joined the event');

        const newParticipant = {
          id: userId,
          firstName: firstName,
          lastName: lastName,
          profilePicture: `http://localhost:8080${profilePicture}`
        };

        this.participants.push(newParticipant);
        this.$forceUpdate();
      } catch (error) {
        console.error('Failed to join the event:', error);
      }
    },
    openReviewDialog() {
      this.reviewDialog = true;
    },
    async submitReview() {
      try {
        const userId = localStorage.getItem('id');
        if (!userId || !this.event.id) {
          throw new Error("User or event information is missing");
        }

        const reviewDTO = {
          userId: userId,
          eventId: this.event.id,
          comment: this.newReview.comment,
          rating: this.newReview.rating
        };

        const response = await axios.post(`http://localhost:8080/hobby-sync/review`, reviewDTO, { withCredentials: true });

        const newReview = response.data;
        const userProfilePicture = localStorage.getItem('profilePicture');
        const userFirstName = localStorage.getItem('firstName');
        const userLastName = localStorage.getItem('lastName');

        newReview.user = {
          id: userId,
          firstName: userFirstName,
          lastName: userLastName,
          profilePicture: userProfilePicture ? `http://localhost:8080${userProfilePicture}` : null
        };

        this.reviews.push(newReview);
        this.reviewDialog = false;
        this.newReview.comment = '';
        this.newReview.rating = 0;
      } catch (error) {
        console.error('Failed to submit review:', error);
      }
    },
    toggleReview(reviewId) {
      const review = this.reviews.find(r => r.id === reviewId);
      review.showReview = !review.showReview;
      this.$forceUpdate();
    }
  },
  mounted() {
    this.fetchEventDetails();
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
  top: 45%;
  left: 29%;
  transform: translate(-50%, -50%);
  width: 850px;
  height: 650px;
}

.participant-list {
  position: absolute;
  top: 45%;
  left: 78%;
  transform: translate(-50%, -50%);
  width: 650px;
  height: 650px;
}

.content {
  width: 100%;
  height: 100%;
  background-color: #015986;
  border-radius: 60px;
  border: 6px solid white;
  padding: 15px;
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

.custom {
  width: 100%;
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

.participant-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.participant-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.participant-name {
  color: white;
  font-weight: bold;
}

.profile-photo {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-bottom: 5px;
}

.green-text {
  color: #71d774;
}

.review-item {
  margin-bottom: 10px;
}

.review-button {
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.review p {
  margin: 0;
  color: white;
}

.review {
  margin-top: 5px;
}

.review .v-rating {
  display: inline-flex;
}

.fixed-title {
  position: fixed;
  top: 22px; 
  width: calc(100% - 40px); 
  background-color: #015986;
  color: #71d774;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding: 10px 20px;
  z-index: 1000;
}

.custom-scroll {
  margin-top: 45px; 
  max-height: calc(100vh - 120px); 
  overflow-y: auto; 
}
</style>



  