<template>
    <div>
        <h4 class="card-title font-weight-normal mb-2">Records </h4>
        <h6 class="card-subtitle font-weight-normal mb-3">List of records</h6>

        <div class="row"></div>

        <div class="form-group">
            <div aria-label="Basic example" class="btn-group float-right " role="group" v-if="currentUser.role === 'ADMIN'">
                <button class="btn btn-sm border btn-success" data-target="#addSurveyModal" data-toggle="modal" title="Add Survey" type="button">
                    <font-awesome-icon icon="plus"/>
                </button>
            </div>
        </div>
        <hr class="m-t-35 mb-0">
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "Records",
        computed: {
            ...mapGetters(["currentUser"])
        }
    }
</script>

<style scoped>

</style>