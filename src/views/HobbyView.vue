<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
            <v-card-title class="headline">Custom Event Filter</v-card-title>
            <v-card-text>
                <v-textarea v-model="customFilterText" label="Describe what you are looking for" rows="2" auto-grow></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="applyCustomFilter">Find Events</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-layout>
        <div class="containment">
            <v-row>
                <v-col>
                    <div class="category-scroller">
                        <v-btn icon="mdi-arrow-left" variant="elevated" color="#4caf50" style="margin-left: 10px; margin-right: 10px; margin-top: 5px;" @click="scrollLeft"></v-btn>
                        <div ref="scrollContainer" class="category-container">
                            <v-chip class="ma-2" @click="selectCategory(null)" :outlined="selectedGroupId === null" color="blue lighten-2">
                                ALL
                            </v-chip>
                            <v-chip v-for="group in hobbyGroups" :key="group.id" class="ma-2" @click="selectCategory(group.id)" :outlined="selectedGroupId !== group.id" color="blue lighten-2">
                                {{ group.name }}
                            </v-chip>
                        </div>
                        <v-btn icon="mdi-arrow-right" variant="elevated" color="#4caf50" style="margin-left: 10px; margin-right: 10px; margin-top: 5px;" @click="scrollRight"></v-btn>
                    </div>
                </v-col>
            </v-row>
            <v-row class="custom">
                <v-col cols="12" md="4">
                    <v-select v-model="sortOrder"
                        :items="['Date Ascending', 'Date Descending', 'Alphabetically Ascending', 'Alphabetically Descending', 'Custom Description']"
                        label="Sort by" outlined dense>
                    </v-select>
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field v-model="searchText" label="Search events" outlined dense>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                    <v-btn class="apply-button" color="primary" @click="applyFilters">Apply Filters</v-btn>
                </v-col>
            </v-row>
            <v-row ref="scrollEvents" class="mb-4">
                <v-col v-for="event in filteredEvents" :key="event.id" class="column">
                    <v-card class="event">
                        <v-card-title style="color:#4caf50">{{ event.name }}</v-card-title>
                        <v-card-subtitle>{{ event.dateTime }}</v-card-subtitle>
                        <v-card-text style="height: 80px; overflow-y: auto;" v-if="selectedEventId === event.id">{{ event.description }}</v-card-text>
                        <v-card-actions>
                            <v-btn icon @click="toggleEvent(event.id)">
                                <v-icon>{{ selectedEventId === event.id ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                            </v-btn>
                            <v-btn color="primary" @click="navigateToEventDetails(event.id)">Join</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <Footer></Footer>
    </v-layout>
</template>

<script>
import axios from 'axios';
import Footer from '@/components/Footer.vue';

export default {
    components: {
        Footer
    },
    data() {
        return {
            hobbyGroups: [],  // Lista cu grupurile de hobby-uri
            events: [],       // Lista cu evenimentele
            selectedGroupId: null,
            selectedEventId: null,
            sortOrder: '',
            customFilter: '',
            searchFilterText: '',
            dialog: false,
            customFilterText: '',
            searchText: '',
        };
    },
    computed: {
        filteredEvents() {
            let filtered = this.events.filter(event =>
                this.selectedGroupId === null || event.hobbyGroupId === this.selectedGroupId
            );
            if (this.sortOrder.includes('Date')) {
                filtered.sort((a, b) => this.sortOrder.includes('Descending') ?
                    new Date(b.dateTime) - new Date(a.dateTime) : new Date(a.dateTime) - new Date(b.dateTime));
            } else if (this.sortOrder.includes('Alphabetically')) {
                filtered.sort((a, b) => this.sortOrder.includes('Descending') ?
                    b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
            }
            else if (this.sortOrder === 'Custom Description') {
                // Aplicați filtrul personalizat după descriere
                filtered = filtered.filter(event =>
                    event.description.toLowerCase().includes(this.customFilterText.toLowerCase())
                );
            }
            // Adăugați filtrul pentru căutarea după nume
            if (this.customFilterText) {
                filtered = filtered.filter(event =>
                    event.name.toLowerCase().includes(this.customFilterText.toLowerCase())
                );
            }
            return filtered;
        }
    },
    methods: {
        selectCategory(groupId) {
            this.selectedGroupId = groupId;
            this.selectedEventId = null;  // Resetare la selectarea unei noi categorii
        },
        toggleEvent(eventId) {
            this.selectedEventId = this.selectedEventId === eventId ? null : eventId;
        },
        scrollLeft() {
            this.$refs.scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
        },
        scrollRight() {
            this.$refs.scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
        },
        scrollLeftEvents() {
            this.$refs.scrollEvents.scrollBy({ left: -200, behavior: 'smooth' });
        },
        scrollRightEvents() {
            this.$refs.scrollEvents.scrollBy({ left: 200, behavior: 'smooth' });

        },
        async fetchHobbyGroups() {
            try {
                const response = await axios.get('http://localhost:8080/hobby-sync/hobby-groups', { withCredentials: true });
                this.hobbyGroups = response.data;
            } catch (error) {
                console.error('Failed to fetch hobby groups:', error);
            }
        },
        async fetchEvents() {
            try {
                const response = await axios.get('http://localhost:8080/hobby-sync/hobby-events', { withCredentials: true });
                this.events = response.data;
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        },
        openCustomFilterDialog() {
            // Integrate with ChatGPT or any other logic for custom filtering
            console.log("Open custom filter dialog");
        },
        applyFilters() {
            console.log("Applying filters");
            // Update customFilterText directly for the "Search events" field
            if (this.sortOrder !== 'Custom Description') {
                this.searchFilterText = this.searchText;
            }
            if (this.sortOrder === 'Custom Description') {
                // Deschidem dialogul pentru filtrare personalizată
                this.dialog = true;
            }
            // You might want to do something here when filters are applied
        },
        applyCustomFilter() {
            // Aici vei implementa logica de filtrare pe baza descrierii
            console.log('Applying custom filter with description:', this.customFilterText);
            this.dialog = false;
        },
        navigateToEventDetails(eventId) {
            this.$router.push({ path: `/event-details/${eventId}` });
        }
    },
    mounted() {
        this.fetchHobbyGroups();
        this.fetchEvents();
    }
};
</script>

<style scoped>
.category-scroller {
    display: flex;
    align-items: center;
    overflow-x: auto;
}

.category-container {
    overflow-x: auto;
    white-space: nowrap;
    flex-grow: 1;
}

.category-container::-webkit-scrollbar {
    display: none;
}

.ma-2 {
    margin: 8px !important;
    background: #015986;
    border-radius: 50px;
    font-family: "Platypi", serif;
    font-weight: 700;
    font-size: large;
    font-style: normal;
    color: white !important;
    text-decoration: none;
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
}

.event {
    width: 400px;
    height: 163px;
    padding: 20px;
    background: #015986;
    border-radius: 50px;
    margin-bottom: 20px;
    font-family: "Platypi", serif;
    font-weight: 700;
    font-size: large;
    font-style: normal;
    color: white;
    margin-left: 10px;
    margin-top: 10px;
}

/* .mb-4 {
    width: 100vw;
    height: 70vh;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    margin-left: 10px;
    margin-top: 10px;
} */
.mb-4 {
    width: 100.5vw;
    height: 64.5vh;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    flex-wrap: wrap;
    /* Asigurați-vă că elementele pot să se înfășoare când nu există suficient spațiu */
    align-items: flex-start;
    /* Aliniază elementele la partea de sus a containerului */
    justify-content: flex-start;
    /* Aliniază elementele la începutul containerului */
    gap: 5px;
    /* Adaugă un spațiu între elemente */
}

.column {
    margin-left: 20px;
    width: 400px;
    margin-right: 20px;
}

.v-select,
.v-text-field {
    margin-bottom: 10px;
    /* Spațiu între elementele de filtrare */
}

.custom {
    color: black;
    margin-left: 10px;
    width: 130vw;
}

.apply-button{
    width: 150px;
    height: 53px;
    background-color: #4caf50 !important;
}
</style>

  