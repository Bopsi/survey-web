<template>
    <div>
        <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
            <router-link :to="{name: 'dashboard' }" class="navbar-brand text-info font-weight-bold p-0 m-0">
                <img src="../../assets/logo-32x32.png"/> SurveY
            </router-link>
            <button class="navbar-toggler" data-target="#collapsibleNavbar" data-toggle="collapse" type="button">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="collapsibleNavbar">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a @click="signout" class="nav-link" href="javascript:void(0);">
                            <font-awesome-icon icon="sign-out-alt"/>
                            Sign Out
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <div class="container mt-3">
            <div class="row">
                <div class="col-sm-2 font-weight-bold">
                    <ul class="nav nav-pills flex-column left-menu">
                        <li class="nav-item">
                            <router-link :to="{name: 'dashboard'}" class="nav-link">Dashboard</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :to="{name: 'surveys'}" class="nav-link">Surveys</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :to="{name: 'reports'}" class="nav-link">Reports</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :to="{name: 'reports'}" class="nav-link">Configure</router-link>
                        </li>
                    </ul>
                    <hr class="d-sm-none">
                </div>
                <div class="col-sm-10 border-left">
                    <router-view/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ProtectedLayout",
        mounted() {
        },
        methods: {
            async signout() {
                this.$store.commit("LOGOUT");
                await this.$router.push({name: 'signin'});
            }
        }
    }
</script>

<style scoped>
    .nav-link {
        font-weight: normal;
    }

    .left-menu > .nav-item > .router-link-exact-active {
        color: #fff;
        background-color: #007bff;
        font-weight: bolder;
    }
</style>