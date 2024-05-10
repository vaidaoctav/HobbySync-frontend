<template>
    <div class="containment">
        <router-link to="/" style="text-decoration: none;">
            <v-btn icon="mdi-home" size="x-large" variant="elevated" color="#015986"
                style="margin-top: 660px; margin-left: 15px;">
            </v-btn>
        </router-link>

        <div class="login-form">

            <img src="@/assets/Logo.png" width="125px" height="125px" style="margin-bottom: 10px; border-radius: 100px;">

            <v-card class="content">
                <div class="title">Login</div>

                <div class="input-type">Username:</div>

                <v-text-field prepend-inner-icon="mdi-account-tie" variant="solo" class="input" density="compact"
                    rounded v-model="username"></v-text-field>

                <div class="input-type">Password:</div>

                <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock" variant="solo" density="compact" class="input" rounded
                    @click:append-inner="visible = !visible" v-model="password"></v-text-field>
                <v-overlay>
                    <v-progress-circular v-if="loading" indeterminate color="white" size="64" style="margin-top: 20px;"></v-progress-circular>
                </v-overlay>
                <v-btn @click="login" size="large" rounded="xl" class="login-button">
                    Sign In
                </v-btn>
                <v-btn @click="goToRegister" color="white" variant="text" class="link-button">
                    Register now!
                </v-btn>
            </v-card>
            <v-dialog v-model="loginFailed" persistent max-width="290px">
                <v-card>
                    <v-card-title class="text-h5">Login Error</v-card-title>
                    <v-card-text>{{ errorMessage }}</v-card-text>
                    <v-card-actions>
                        <v-btn color="green darken-1" text @click="errorMessage = ''; loginFailed = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { useRouter } from 'vue-router';
export default {
    data: () => ({
        visible: false,
        username: '',
        password: '',
        loading: false,
        loginFailed: false,
        errorMessage: ''
    }),
    setup() {
        const router = useRouter();
        return { router };
    },
    methods: {
        async login() {
            this.loading = true;
            this.errorMessage = ''; 
            try {
                const response = await axios.post('http://localhost:8080/hobby-sync/auth/login', {
                    username: this.username,
                    password: this.password
                }, {
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
                setTimeout(() => {
                    this.loading = false;
                    this.router.push('/hobby');
                }, 1000);
            } catch (error) {
                this.loading = false;
                this.loginFailed = true;
                this.errorMessage = error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            }
        },
        goToRegister() {
            this.$router.push({ name: 'register' });
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
}

.login-form {
    margin-top: 30px;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 700px;
}

.content {
    width: 450px;
    height: 500px;
    background-color: #015986;
    border-radius: 60px;
    border: 6px solid white;
    margin-left: auto;
    margin-right: auto;
    padding: 15px;
    padding-bottom: 8px;
}

.title {
    margin: 25px auto 0 auto;
    font-family: "Platypi", serif;
    font-weight: 400;
    font-size: xx-large;
    font-style: normal;
    color: white;
    text-align: center;
}

.input-type {
    margin-left: 10px;
    margin-bottom: 5px;
    margin-top: 30px;
    font-family: "Platypi", serif;
    font-weight: 400;
    font-size: medium;
    font-style: normal;
    color: white;
}

.input {
    width: 410px;
    height: 30px;
    margin-bottom: 25px;
}

.login-button {
    font-family: "Platypi", serif;
    font-weight: 400;
    font-style: normal;
    background-color: #46c6ed;
    color: white;
    width: 200px;
    margin-top: 30px;
    margin-left: 104px;
}

.link-button {
    font-family: "Platypi", serif;
    font-weight: 400;
    font-style: normal;
    font-size: medium;
    justify-content: center;
    margin-top: 70px;
    margin-left: 79px;
    text-transform: unset !important;
    width: 250px;
}

.register-button {
    font-family: "Platypi", serif;
    font-weight: 400;
    font-style: normal;
    font-size: medium;
    color: rgba(0, 88, 131, 255);
    text-transform: unset !important;
    margin-left: 1px;
}

.text {
    color: #7d2e2e;
    font-family: "Platypi", serif;
    font-weight: 400;
    font-style: normal;
    font-size: medium;
    margin-top: 6px;
}
</style>