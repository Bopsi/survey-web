<template>
    <div :class="{ loader: true, fadeout: !isLoading }">
        <div class="spinner-border spinner-border-lg text-light" role="status" style="width: 3rem; height: 3rem;">
            <span class="sr-only" v-if="loadingText">{{loadingText}}...</span>
            <span class="sr-only" v-else>Loading...</span>
        </div>
        <br><br>
        <h3 class="text-light">Please Wait ...</h3>
    </div>
</template>

<script>
    export default {
        name: "LoadingScreen",
        props: ["isLoading", "loadingText"]
    }
</script>

<style scoped>
    .loader {
        background-color: rgba(0, 0, 0, 0.5);
        bottom: 0;
        display: block;
        left: 0;
        overflow: hidden;
        padding-top: 30vh;
        position: fixed;
        right: 0;
        text-align: center;
        top: 0;
        z-index: 1051;
    }

    .fadeout {
        animation: fadeout 2s forwards;
    }

    @keyframes fadeout {
        to {
            opacity: 0;
            visibility: hidden;
        }
    }
</style>