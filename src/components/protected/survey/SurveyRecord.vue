<template>
    <div>
        <div class="row p-0">
            <h4 class="card-title font-weight-normal mb-2 col-6">Survey {{survey.id}} Record {{record.id}}</h4>
            <h4 class="text-right col-6">
                <router-link :to="{name:'survey-records', params: {id: surveyid}}" title="Back">
                    <font-awesome-icon icon="arrow-left"/>
                </router-link>
            </h4>
        </div>
        <h6 class="card-subtitle font-weight-normal mb-3">Record</h6>
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
        <div class="mt-2 mb-5">
            <div class="form-group col-md-6 col-sm-12 mb-4" v-for="(question,i) in questions">
                <div class="mb-2">
                    <label :class="question.mandatory?'required':''" class="font-weight-bold mb-0 q-label"> {{i+1}}. {{question.description}}</label>
                    <small class="form-text text-muted" v-if="question.note">{{question.note}}</small>
                </div>
                <template v-if="question.type === 'TEXT'">
                    <textarea :required="question.mandatory" class="form-control" type="text"/>
                </template>
                <div v-if="question.type === 'RADIO'">
                    <div class="form-check" v-for="(option,j) in question.options">
                        <input :name="'question_'+i+'_'+j" :value="option.value" class="form-check-input" type="radio">
                        <label class="form-check-label">
                            {{option.description}}
                        </label>
                    </div>
                </div>
                <div v-if="question.type === 'CHECKBOX'">
                    <div class="form-check" v-for="(option,j) in question.options">
                        <input :name="'question_'+i+'_'+j" :value="option.value" class="form-check-input" type="checkbox">
                        <label class="form-check-label">
                            {{option.description}}
                        </label>
                    </div>
                </div>
                <div :class="question.type === 'NONE'?'mt-0':'mt-2'" class="custom-file" v-if="question.attachments">
                    <input class="custom-file-input" required type="file">
                    <label class="custom-file-label">Choose file...</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import EventBus from "../../../event-bus";

    export default {
        name: "SurveyRecords",
        props: ["surveyid","recordid"],
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
            async init(){
                await this.getSurvey();
                await this.getQuestions();
               // await this.getRecord();
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
            async getQuestions() {
                try {
                    EventBus.$emit('openLoader', 'Fetching questions');
                    const reply = await this.$http.get(`surveys/${this.surveyid}/questions`);
                    if(reply.data) {
                        this.questions = reply.data;
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
                        this.records = reply.data
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