<template>
    <div>
        <h4 class="card-title font-weight-normal mb-2">Surveys </h4>
        <h6 class="card-subtitle font-weight-normal mb-3">List of surveys</h6>

        <div class="row"></div>

        <div class="form-group">
            <div aria-label="Basic example" class="btn-group float-right " role="group" v-if="currentUser.role === 'ADMIN'">
                <button :class="includeDeleted?'btn-primary':'btn-light'" :title="includeDeleted?'Hide Hidden Surveys':'Show Hidden Surveys'"
                        @click="includeDeleted= !includeDeleted" class="btn btn-sm border" type="button">
                    <font-awesome-icon icon="low-vision"/>
                </button>
                <button class="btn btn-sm border btn-success" data-target="#addSurveyModal" data-toggle="modal" title="Add Survey" type="button">
                    <font-awesome-icon icon="plus"/>
                </button>
            </div>
        </div>
        <hr class="m-t-35 mb-0">

        <div class="table table-responsive">
            <table class="table">
                <thead>
                <tr>
                    <th class="border-top-0">Name</th>
                    <th class="border-top-0">Description</th>
                    <th class="border-top-0">Version</th>
                    <th class="border-top-0 text-center">Status</th>
                    <th class="border-top-0">Created At</th>
                    <th class="border-top-0">Locked At</th>
                    <th class="border-top-0" v-if="includeDeleted">Deleted</th>
                    <th class="border-top-0 text-center">Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="survey in surveys">
                    <td>{{survey.name}}</td>
                    <td>{{survey.description}}</td>
                    <td>{{survey.version}}</td>
                    <td class="text-center">
                        <font-awesome-icon class="text-secondary" icon="lock" v-if="survey.status === 'LOCKED'"/>
                        <font-awesome-icon class="text-primary" icon="lock-open" v-if="survey.status === 'UNLOCKED'"/>
                    </td>
                    <td>{{survey.created_at | timestamp}}</td>
                    <td>{{survey.locked_at | timestamp}}</td>
                    <td v-if="includeDeleted">{{survey.is_deleted?'Yes':'No'}}</td>
                    <td class="text-center">
                        <template v-if="survey.status === 'LOCKED'">
                            <router-link :to="{name: 'survey', params : {id: survey.id}}" title="View">
                                <font-awesome-icon icon="eye"/>
                            </router-link>
                            <router-link :to="{name: 'survey-records', params : {id: survey.id}}" class="text-success ml-2" title="Records">
                                <font-awesome-icon icon="clipboard-check"/>
                            </router-link>
                        </template>
                        <template v-if="currentUser.role === 'ADMIN'">
                            <router-link :to="{name: 'survey', params : {id: survey.id}}" title="Configure" v-if="survey.status === 'UNLOCKED' && !survey.is_deleted">
                                <font-awesome-icon icon="wrench"/>
                            </router-link>
                            <a class="text-danger pl-2" href="javascript:void(0)" title="Delete">
                                <font-awesome-icon @click="confirmDelete(survey.id)" icon="trash"/>
                            </a>
                        </template>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="clearfix mb-5"></div>
        <!-- Add Survey Modal -->
        <div aria-hidden="true" aria-labelledby="addSurveyModalLabel" class="modal fade" id="addSurveyModal" role="dialog" tabindex="-1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header p-2">
                        <h6 class="modal-title ml-2" id="addSurveyModalLabel">Create new survey</h6>
                        <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="addSurvey">
                        <div class="modal-body">
                            <div class="form-group">
                                <label class="q-label required">Name</label>
                                <textarea class="form-control" placeholder="Enter survey name" required v-model="survey.name"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="q-label required">Description</label>
                                <textarea class="form-control" placeholder="Enter survey description" required v-model="survey.description"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer p-1">
                            <button class="btn btn-sm btn-secondary mt-0 mb-0" type="reset">Reset</button>
                            <button class="btn btn-sm btn-primary mt-0 mb-0 mr-0" type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <cofirm :body="confirmBody" :show="confirmShow" :title="confirmTitle" @cancel="cancel" @confirm="deleteSurvey"/>
    </div>
</template>

<script>
    import EventBus from "../../../event-bus";
    import {mapGetters} from "vuex";
    import Cofirm from "../../Cofirm";
    import $ from "jquery";

    export default {
        name: "Surveys",
        components: {Cofirm},
        computed: {
            ...mapGetters(["currentUser"])
        },
        data() {
            return {
                surveys: [],
                survey: {
                    name: null,
                    survey: null
                },
                includeDeleted: false,
                survey_id: null,
                confirmShow: false,
                confirmTitle: null,
                confirmBody: null,
            }
        },
        watch: {
            "includeDeleted": function(nv, ov) {
                this.getSurveys();
            }
        },
        mounted() {
            this.getSurveys();
        },
        methods: {
            async getSurveys() {
                try {
                    EventBus.$emit('openLoader', 'Fetching surveys');
                    let params = {};
                    if(this.includeDeleted) {
                        params["includeDeleted"] = this.includeDeleted;
                    }
                    const reply  = await this.$http.get("surveys", {params: params});
                    this.surveys = reply.data;
                } catch(e) {
                    this.$toastr.e(e.message, "Error");
                } finally {
                    EventBus.$emit('closeLoader');
                }
            },
            confirmDelete(id) {
                this.survey_id    = id;
                this.confirmShow  = true;
                this.confirmTitle = "Delete Survey?";
                this.confirmBody  = "You will no longer be able to modify or assess the survey. Are you sure?";
            },
            cancel() {
                this.survey_id    = null;
                this.confirmShow  = false;
                this.confirmTitle = null;
                this.confirmBody  = null;
            },
            async addSurvey() {
                $('#addSurveyModal').modal('toggle');
                try {
                    EventBus.$emit('openLoader', 'Creating survey');
                    let reply = await this.$http.post("surveys", this.survey);
                    this.$toastr.s("Survey created", "Success");
                    await this.$router.push({name: 'survey', params: {id: reply.data.id}});
                } catch(e) {
                    this.$toastr.e(e.message, "Error");
                } finally {
                    this.survey = {name: null, description: null};
                    EventBus.$emit('closeLoader');
                }
            },
            async deleteSurvey() {
                if(this.survey_id) {
                    try {
                        EventBus.$emit('openLoader', 'Deleting survey');
                        const survey_id = this.survey_id;
                        this.cancel();
                        await this.$http.delete(`surveys/${survey_id}`);
                        this.$toastr.s("Survey deleted", "Success");
                        await this.getSurveys();
                    } catch(e) {
                        this.$toastr.e(e.message, "Error");
                    } finally {
                        EventBus.$emit('closeLoader');
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>