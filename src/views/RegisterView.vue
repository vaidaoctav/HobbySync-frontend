<template>
    <div class="containment">
        <router-link to="/" style="text-decoration: none;">
            <v-btn icon="mdi-home" size="x-large" variant="elevated" color="#015986"
                style="margin-top: 660px; margin-left: 15px;">
            </v-btn>
        </router-link>

        <div class="register-form">
            <img src="@/assets/Logo.png" width="125px" height="125px" style="margin-bottom: 10px; border-radius: 100px;">

            <v-card class="content">

                <div class="title">Create an account</div>

                <v-row wrap>
                    <v-col cols="4">
                        <div class="input-type">First name:</div>

                        <v-text-field prepend-inner-icon="mdi-card-account-details" variant="solo" class="donodash-input"
                            density="compact" rounded v-model="firstName"></v-text-field>

                        <div class="input-type">Last name:</div>

                        <v-text-field prepend-inner-icon="mdi-card-account-details" variant="solo" class="donodash-input"
                            density="compact" rounded v-model="lastName"></v-text-field>

                        <div class="input-type">Username:</div>

                        <v-text-field prepend-inner-icon="mdi-account-tie" variant="solo" class="donodash-input"
                            density="compact" rounded v-model="username"></v-text-field>


                    </v-col>
                    <v-col cols="4" style="margin-left: 200px;">

                        <div class="input-type">Email address:</div>

                        <v-text-field prepend-inner-icon="mdi-email-search-outline" variant="solo" class="donodash-input"
                            density="compact" rounded v-model="email"></v-text-field>

                        <div class="input-type">Password:</div>

                        <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="visible ? 'text' : 'password'" prepend-inner-icon="mdi-lock"
                            hint="Must be at least 8 characters long, with 1 alphabetical character, 1 digit and 1 special character: .,_!?:;"
                            variant="solo" density="compact" class="donodash-input" rounded
                            @click:append-inner="visible = !visible" v-model="password"></v-text-field>

                        <div class="input-type">Profile picture:</div>

                        <v-file-input prepend-icon="" prepend-inner-icon="mdi-camera-outline" variant="solo"
                            class="donodash-input" density="compact" rounded @change="onFilePicked"></v-file-input>


                    </v-col>
                </v-row>

                <v-btn size="large" rounded="xl" class="donodash-orange-button" @click="register">
                    Sign up
                </v-btn>

            </v-card>
        </div>

    </div>
</template>

<script>
import axios from 'axios'

export default {
    data: () => ({
        visible: false,
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        profilePicture: null
    }),
    methods: {
        async register() {
            const formData = new FormData();
            formData.append('firstName', this.firstName);
            formData.append('lastName', this.lastName);
            formData.append('username', this.username);
            formData.append('email', this.email);
            formData.append('password', this.password);
            if (this.profilePicture) {
                formData.append('profilePicture', this.profilePicture);
            }
            formData.append('userType', "USER");
            formData.append("bio",'')

            try {
                const response = await axios.post('http://localhost:8080/hobby-sync/auth/register', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                this.$router.push('/login');
                console.log('Registration successful');
            } catch (error) {
                console.error('Registration failed:', error);
            }
        },
        onFilePicked(event) {
            const file = event.target.files[0];
            if (file) {
                this.profilePicture = file;
            }
        }
    }
}

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

.register-form {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1000px;
    height: 650px;
}

.content {
    width: 1000px;
    height: 475px;
    background-color: #015986;
    border-radius: 60px;
    border: 6px solid white;
    margin-left: auto;
    margin-right: auto;
    padding: 5px;
    padding-bottom: 8px;
}

.title {
    margin: 25px auto 0 auto;
    font-family: "Archivo Black", sans-serif;
    font-weight: 400;
    font-size: xx-large;
    font-style: normal;
    color: white;
    text-align: center;
}

.input-type {
    margin-left: 30px;
    margin-bottom: 5px;
    margin-top: 30px;
    width: 400px;
    font-family: "Platypi", serif;
    font-weight: 400;
    font-size: medium;
    font-style: normal;
    color: white;
}

.donodash-input {
    width: 400px;
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
</style>