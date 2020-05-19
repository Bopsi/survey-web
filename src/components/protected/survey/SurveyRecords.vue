<template>
    <div>
        <div class="row p-0">
            <h4 class="card-title font-weight-normal mb-2 col-6">Survey {{id}} Records</h4>
            <h4 class="text-right col-6">
                <router-link :to="{name:'surveys'}" title="Back">
                    <font-awesome-icon icon="arrow-left"/>
                </router-link>
            </h4>
        </div>
        <h6 class="card-subtitle font-weight-normal mb-3">Records</h6>
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

        <div class="form-group">
            <div aria-label="Basic example" class="btn-group float-right" role="group">
                <template v-if="survey.status === 'LOCKED'">
                    <a class="btn btn-sm border btn-success" data-target="#addRecordModal" data-toggle="modal" href="javascript:void(0)" title="Add Record">
                        <font-awesome-icon icon="plus"/>
                    </a>
                </template>
            </div>
        </div>
        <hr class="m-t-35 mb-0">

        <div class="table table-responsive">
            <table class="table">
                <thead>
                <tr>
                    <th class="border-top-0">Name</th>
                    <th class="border-top-0">Description</th>
                    <th class="border-top-0">Surveyor Name</th>
                    <th class="border-top-0">Surveyor Email</th>
                    <th class="border-top-0">Created At</th>
                    <th class="border-top-0 text-center">Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(record,index) in records">
                    <td>{{record.subject_name}}</td>
                    <td>{{record.subject_description}}</td>
                    <td>{{record.first_name+' '+record.last_name}}</td>
                    <td>{{record.email}}</td>
                    <td>{{record.created_at | date}}</td>
                    <td class="text-center">
                        <router-link :to="{name: 'survey-record' , params : { surveyid: id, recordid: record.id}}" class="mr-2" title="View Record">
                            <font-awesome-icon icon="eye"/>
                        </router-link>
                        <a @click="confirmDelete(record.id)" class="text-danger" href="javascript:void(0)" title="Delete Record">
                            <font-awesome-icon icon="trash"/>
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!-- Add record modal -->
        <div aria-hidden="true" aria-labelledby="addRecordModalLabel" class="modal fade" id="addRecordModal" role="dialog" tabindex="-1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header p-2">
                        <h6 class="modal-title ml-2" id="addRecordModalLabel">Create new record</h6>
                        <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="addRecord">
                        <div class="modal-body">
                            <div class="form-group">
                                <label class="q-label required">Subject Name</label>
                                <textarea class="form-control" placeholder="Enter subject name" required v-model="record.subject_name"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="q-label required">Subject Description</label>
                                <textarea class="form-control" placeholder="Enter subject description" required v-model="record.subject_description"></textarea>
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

        <confirm :show="confirmShow" @cancel="cancel" @confirm="deleteRecord" body="You will no longer be able access the record. Are you sure?" title="Delete record?"/>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import EventBus from "../../../event-bus";
    import Confirm from "../../Confirm";
    import $ from "jquery";

    export default {
        name: "SurveyRecords",
        props: ["id"],
        computed: {
            ...mapGetters(["currentUser"])
        },
        components: {Confirm},
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
                records: [],
                record: {
                    subject_name: null,
                    subject_description: null
                },
                confirmShow: false,
                recordid: null
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            async init() {
                await this.getSurvey();
                await this.getRecords();
            },
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
            async getRecords() {
                try {
                    EventBus.$emit('openLoader', 'Fetching records');
                    let reply = await this.$http.get(`/surveys/${this.id}/records`);
                    if(reply) {
                        this.records = reply.data
                    }
                } catch(e) {

                } finally {
                    EventBus.$emit('closeLoader');
                }
            },
            confirmDelete(rid) {
                this.recordid    = rid;
                this.confirmShow = true;
            },
            cancel() {
                this.confirmShow = false;
                this.recordid    = null;
            },
            async addRecord() {
                $('#addRecordModal').modal('toggle');
                try {
                    EventBus.$emit('openLoader', 'Creating record');
                    let reply = await this.$http.post(`surveys/${this.id}/records`, this.record);
                    this.$toastr.s("Record created", "Success");
                    await this.getRecords();
                    //  await this.$router.push({name: 'survey', params: {id: reply.data.id}});
                } catch(e) {
                    this.$toastr.e(e.message, "Error");
                } finally {
                    this.record = {subject_name: null, subject_description: null};
                    EventBus.$emit('closeLoader');
                }
            },
            async deleteRecord() {
                try {
                    EventBus.$emit('openLoader', 'Deleting record');
                    await this.$http.delete(`/surveys/${this.id}/records/${this.recordid}`);
                    await this.getRecords();
                } catch(e) {
                    this.$toastr.e(e.message, "Error");
                } finally {
                    this.cancel();
                    EventBus.$emit('closeLoader');
                }
            }
        }
    }
</script>

<style scoped>

</style>