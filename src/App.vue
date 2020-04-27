<template>
    <div class="fill layout" id="app">
        <router-view/>
        <footer class="pt-2 border-top fixed-bottom">
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
            EventBus.$on("closeLoader", (text) => {
                this.isLoading = false;
                this.loadingText = text;
            });
            EventBus.$on("openLoader", () => {
                this.isLoading = true;
            });
        }
    };
</script>

<style>
    html,
    body {
        height: 100%;
    }

    .layout {
        background-color: #f5f5f5;
    }

    .fill {
        height: 100%;
    }
</style>
