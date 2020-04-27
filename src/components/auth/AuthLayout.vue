<template>
    <div class="text-center auth">
        <router-view/>
    </div>
</template>

<script>
    import EventBus from "../../event-bus";

    export default {
        name: "AuthLayout"
    };
</script>

<style scoped>
    .auth {
        padding-top: 40px;
        padding-bottom: 40px;
    }
</style>
