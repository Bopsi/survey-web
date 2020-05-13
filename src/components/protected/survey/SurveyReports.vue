<template>
    <div>
        <div class="row p-0">
            <h4 class="card-title font-weight-normal mb-2 col-6">Survey {{id}} Reports</h4>
            <h4 class="text-right col-6">
                <router-link :to="{name:'surveys'}" title="Back">
                    <font-awesome-icon icon="arrow-left"/>
                </router-link>
            </h4>
        </div>
        <h6 class="card-subtitle font-weight-normal mb-3">Survey details</h6>
        <div class="row">
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right">
                <dt>Survey Id</dt>
                <dd>{{survey.id}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right">
                <dt>Name</dt>
                <dd>{{survey.name}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12  border-right">
                <dt>Description</dt>
                <dd>{{survey.description}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right">
                <dt>Version</dt>
                <dd>{{survey.version}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right">
                <dt>Status</dt>
                <dd>
                    <font-awesome-icon class="text-secondary ml-2" icon="lock" v-if="survey.status === 'LOCKED'"/>
                    <font-awesome-icon class="text-primary ml-2" icon="lock-open" v-if="survey.status === 'UNLOCKED'"/>
                </dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right">
                <dt>Created At</dt>
                <dd>{{survey.created_at | timestamp}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right">
                <dt>Locked At</dt>
                <dd>{{survey.locked_at | timestamp}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right" v-if="survey.is_deleted">
                <dt>Deleted</dt>
                <dd>{{survey.is_deleted?'Yes':'No'}}</dd>
            </dl>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import EventBus from "../../../event-bus";

    export default {
        name: "SurveyReports",
        props: ["id"],
        computed: {
            ...mapGetters(["currentUser"])
        },
        data() {
            return {
                survey: {
                    id: null,
                    name: null,
                    description: null,
                    version: null,
                    status: null,
                    created_at: null,
                    locked_at: null,
                    created_by: 1,
                    questions: []
                },
                reports: []
            }
        },
        mounted() {
            this.getSurvey();
        },
        methods: {
            async getSurvey() {
                try {
                    EventBus.$emit('openLoader', 'Fetching survey');
                    let reply = await this.$http.get(`/surveys/${this.id}`);
                    if(reply) {
                        this.survey = reply.data
                    }
                } catch(e) {

                } finally {
                    EventBus.$emit('closeLoader');
                }
            },
            async getReports() {
                try {
                    EventBus.$emit('openLoader', 'Fetching survey');
                    let reply = await this.$http.get(`/surveys/${this.id}`);
                    if(reply) {
                        this.survey = reply.data
                    }
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