<template>
    <div>
        <div class="row p-0">
            <h4 class="card-title font-weight-normal mb-0 col-6">Survey {{survey.id}} Record {{recordid}}</h4>
            <h4 class="text-right col-6">
                <router-link :to="{name:'survey-records', params: {id: surveyid}}" title="Back">
                    <font-awesome-icon icon="arrow-left"/>
                </router-link>
            </h4>
            <ol class="breadcrumb bg-transparent pt-0">
                <li class="breadcrumb-item">
                    <router-link :to="{name: 'surveys'}">Surveys</router-link>
                </li>
                <li class="breadcrumb-item">
                    <router-link :to="{name: 'survey', params: {id: surveyid}}">Survey {{surveyid}}</router-link>
                </li>
                <li aria-current="page" class="breadcrumb-item">
                    <router-link :to="{name:'survey-records', params: {id: surveyid}}">
                        Records
                    </router-link>
                </li>
                <li aria-current="page" class="breadcrumb-item active">
                    Record {{recordid}}
                </li>
            </ol>
        </div>

        <h5 class="card-subtitle font-weight-normal mb-3">Survey Details</h5>
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
        <hr class="mt-0">

        <h5 class="card-subtitle font-weight-normal mb-3">Record Details</h5>
        <div class="row">
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right">
                <dt>Record Id</dt>
                <dd>{{record.id}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right">
                <dt>Subject Name</dt>
                <dd>{{record.subject_name}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12  border-right">
                <dt>Subject Description</dt>
                <dd>{{record.subject_description}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right">
                <dt>Created At</dt>
                <dd>{{record.created_at | timestamp}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right">
                <dt>Creator Name</dt>
                <dd>{{record.first_name}} {{record.last_name}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right">
                <dt>Creator EMail</dt>
                <dd>{{record.email}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right">
                <dt>Locked At</dt>
                <dd>{{record.locked_at | timestamp}}</dd>
            </dl>
            <dl class="col-lg-3 col-md-3 col-sm-6 col-xs-12 border-right" v-if="survey.is_deleted">
                <dt>Deleted</dt>
                <dd>{{survey.is_deleted?'Yes':'No'}}</dd>
            </dl>
        </div>
        <hr class="mt-0">

        <div class="mt-2 mb-5">
            <h5 class="card-subtitle font-weight-normal mb-3">Answers</h5>
            <form>
                <div class="form-group col-md-6 col-sm-12 mb-0" v-for="(question,i) in questions">
                    <div class="mb-2">
                        <label :class="question.mandatory?'required':''" class="font-weight-bold mb-0 q-label"> {{i+1}}. {{question.description}}</label>
                        <small class="form-text text-muted" v-if="question.note">{{question.note}}</small>
                    </div>
                    <template v-if="question.type === 'TEXT'">
                        <textarea :required="question.mandatory" class="form-control" type="text" v-model="question.text"/>
                    </template>
                    <div v-if="question.type === 'RADIO'">
                        <div class="form-check" v-for="(option,j) in question.options">
                            <input :name="'question_'+i+'_'+j" :value="option.id" class="form-check-input" type="radio" v-model="question.radio">
                            <label class="form-check-label">
                                {{option.description}}
                            </label>
                        </div>
                    </div>
                    <div v-if="question.type === 'CHECKBOX'">
                        <div class="form-check" v-for="(option,j) in question.options">
                            <input :value="option.id" class="form-check-input" type="checkbox" v-model="question.checkbox">
                            <label class="form-check-label">
                                {{option.description}}
                            </label>
                        </div>
                    </div>
                    <div :class="question.type === 'NONE'?'mt-0':'mt-2'" class="custom-file" v-if="question.attachments">
                        <input class="custom-file-input" required type="file">
                        <label class="custom-file-label">Choose file...</label>
                    </div>
                    <div class="w-100">
                        <button @click="save(question)" class="btn btn-sm btn-primary mt-1 float-right" title="Save" type="button">
                            <font-awesome-icon icon="save"/>
                        </button>
                        <button @click="reset(question)" class="btn btn-sm btn-secondary mt-1 float-right mr-2" title="Reset">
                            <font-awesome-icon icon="undo-alt"/>
                        </button>
                        <div class="clearfix"></div>
                    </div>
                    <hr class="mt-1 mb-1">
                </div>
                <div class="form-group col-md-6 col-sm-12 mb-5">
                    <button class="btn btn-sm btn-primary float-right" title="Save All and Submit">
                        <font-awesome-icon class="mr-2" icon="save"/>
                        Save All and Submit
                    </button>
                    <button class="btn btn-sm btn-secondary float-right mr-2" title="Reset All">
                        <font-awesome-icon class="mr-2" icon="undo-alt"/>
                        Reset All
                    </button>
                    <div class="clearfix"></div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import EventBus from "../../../event-bus";

    export default {
        name: "SurveyRecords",
        props: ["surveyid", "recordid"],
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
                },
                questions: [],
                record: {
                    id: null
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            async init() {
                await this.getSurvey();
                await this.getRecord();
                await this.getAnswers();
            },
            async getSurvey() {
                try {
                    EventBus.$emit('openLoader', 'Fetching survey');
                    const reply = await this.$http.get(`surveys/${this.surveyid}`);
                    if(reply.data) {
                        this.survey = reply.data;
                    } else {
                        this.$toastr.e("Survey not found", "Error");
                        await this.$router.push({name: 'surveys'});
                    }
                } catch(e) {
                    this.$toastr.e("Internal server error", "Error");
                } finally {
                    EventBus.$emit('closeLoader');
                }
            },
            async getRecord() {
                try {
                    EventBus.$emit('openLoader', 'Fetching record');
                    let reply = await this.$http.get(`/surveys/${this.surveyid}/records/${this.recordid}`);
                    if(reply) {
                        this.record = reply.data
                    }
                } catch(e) {
                    this.$toastr.e("Internal server error", "Error");
                } finally {
                    EventBus.$emit('closeLoader');
                }
            },
            async getAnswers() {
                try {
                    EventBus.$emit('openLoader', 'Fetching answers');
                    const reply = await this.$http.get(`surveys/${this.surveyid}/records/${this.recordid}/answers`);
                    if(reply.data) {
                        this.questions = reply.data;
                    }
                } catch(e) {
                    this.$toastr.e("Internal server error", "Error");
                } finally {
                    EventBus.$emit('closeLoader');
                }
            },
            async save(question) {
                console.log(question.id, question.answer_id, question.text, question.radio, JSON.stringify(question.checkbox));
                try {
                    EventBus.$emit('openLoader', 'Saving answer');
                    let payload = {
                        id: question.answer_id,
                        question_id: question.id,
                        text: question.text,
                        radio: question.radio,
                        checkbox: question.checkbox
                    }

                    await this.$http.post(`surveys/${this.surveyid}/records/${this.recordid}/answers`, payload);
                    await this.getAnswers();
                } catch(e) {
                    this.$toastr.e("Internal server error", "Error");
                } finally {
                    EventBus.$emit('closeLoader');
                }
            },
            reset() {

            }
        }
    }
</script>

<style scoped>

</style>