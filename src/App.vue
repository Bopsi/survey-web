<template>
    <div class="app bg-custom" id="app">
        <router-view/>
        <footer class="pt-2 border-top fixed-bottom  bg-custom">
            <div class="row">
                <div class="col-12 col-md">
                    <small class="d-block mb-2 text-muted text-center">Copyright © SurveY. All rights reserved.</small>
                </div>
            </div>
        </footer>
        <loading-screen :is-loading="isLoading" :loading-text="loadingText"/>
    </div>
</template>

<script>
    import EventBus from "../src/event-bus";
    import LoadingScreen from "./components/LoadingScreen";

    export default {
        name: "App",
        components: {LoadingScreen},
        data() {
            return {
                isLoading: false,
                loadingText: null
            };
        },
        mounted() {
            EventBus.$on("openLoader", (text) => {
                this.isLoading = true;
                this.loadingText = text;
            });
            EventBus.$on("closeLoader", () => {
                this.isLoading = false;
               // this.loadingText = null;
            });
        }
    };
</script>

<style>
    html,
    body {
        height: 100%;
    }
</style>
