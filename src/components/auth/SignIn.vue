<template>
    <form @submit.prevent="signin" class="form-signin">
        <font-awesome-icon class="text-info" icon="poll-h" size="5x"/>
        <h1 class="h3 mb-0 font-weight-normal">SurveY</h1>
        <span class="text-muted">Smart Survey</span>

        <label class="sr-only" for="inputEmail">Email address</label>
        <input autofocus
               class="form-control mt-3"
               id="inputEmail"
               placeholder="Email address"
               required
               type="email"
               v-model="auth.email"/>

        <label class="sr-only" for="inputPassword">Password</label>
        <input class="form-control mt-3 mb-3"
               id="inputPassword"
               placeholder="Password"
               required
               type="password"
               v-model="auth.password"/>

        <button class="btn btn-primary btn-block" type="submit">
            <font-awesome-icon icon="sign-in-alt"/>&nbsp;&nbsp; Sign in
        </button>
    </form>
</template>

<script>
    import EventBus from "../../event-bus";

    export default {
        name: "SignIn",
        data() {
            return {
                auth: {
                    email: null,
                    password: null
                }
            }
        },
        methods: {
            async signin() {
                try {
                    EventBus.$emit('openLoader', 'Signing in')
                    const reply = await this.$http.post('/users/signin', this.auth);
                    if(!reply.data.token) {
                        this.$toastr.e("Sign in failure", "Error");
                    } else{
                        this.$store.commit("LOGIN", reply.data);
                        this.$toastr.s("Welcome Back", "Welcome");
                        await this.$router.push({name: 'dashboard'});
                    }
                } catch(e) {
                    console.log(e);
                    this.$toastr.e("Sign in failure", "Error");
                } finally {
                    EventBus.$emit('closeLoader');
                }
            }
        }
    }
</script>

<style scoped>
    .form-signin {
        width: 100%;
        max-width: 330px;
        padding: 15px;
        margin: auto;
    }
</style>
