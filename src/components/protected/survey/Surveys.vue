<template>
    <div>
        <h4 class="card-title font-weight-normal mb-2">Surveys</h4>
        <h6 class="card-subtitle font-weight-normal mb-3">List of surveys</h6>
        <div class="table table-responsive">
            <table class="table">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Locked</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="survey in surveys">
                    <td>{{survey.id}}</td>
                    <td>{{survey.name}}</td>
                    <td>{{survey.description}}</td>
                    <td>{{survey.status}}</td>
                    <td>{{survey.created_at | timestamp}}</td>
                    <td>{{survey.locked_at | timestamp}}</td>
                    <td>Action</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import EventBus from "../../../event-bus";
    import {mapGetters} from "vuex";

    export default {
        name: "Surveys",
        computed: {
            ...mapGetters(["currentUser"])
        },
        data() {
            return {
                surveys: []
            }
        },
        mounted() {
            this.getSurveys();
        },
        methods: {
            async getSurveys() {
                try {
                    EventBus.$emit('openLoader', 'Fetching surveys');
                    const reply = await this.$http.get("surveys");
                    this.surveys = reply.data;
                } catch(e) {

                } finally {
                    EventBus.$emit('closeLoader');
                }
            }
        }
    }
</script>

<style scoped>

</style>