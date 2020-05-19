<template>
    <div v-if="currentUser.role === 'ADMIN' && survey.status === 'UNLOCKED' && !survey.is_deleted">
        <div class="row p-0">
            <h4 class="card-title font-weight-normal mb-2 col-6">Question</h4>
            <h4 class="text-right col-6">
                <router-link :to="{name:'survey', params: { id: surveyid}}" title="Back">
                    <font-awesome-icon icon="arrow-left"/>
                </router-link>
            </h4>
        </div>
        <h6 class="card-subtitle font-weight-normal mb-3">Question {{questionid}} details</h6>
        <form @submit.prevent="submit" class="row mb-0">
            <div class="form-group col-md-6 col-sm-12 border-right">
                <label class="q-label required">Description</label>
                <textarea class="form-control" name="description" placeholder="Enter question name" required v-model="question.description"></textarea>
            </div>

            <div class="form-group col-md-6 col-sm-12 border-right">
                <label class="q-label">Note</label>
                <textarea class="form-control" name="note" placeholder="Enter question note" v-model="question.note"></textarea>
            </div>

            <div class="form-group col-md-3 col-sm-12 border-right">
                <label class="q-label required">Mandatory?</label>
                <div class="form-check">
                    <input :value="true" class="form-check-input" name="mandatory" required type="radio" v-model="question.mandatory">
                    <label class="form-check-label">
                        Yes
                    </label>
                </div>
                <div class="form-check">
                    <input :value="false" class="form-check-input" name="mandatory" required type="radio" v-model="question.mandatory">
                    <label class="form-check-label">
                        No
                    </label>
                </div>
            </div>

            <div class="form-group col-md-3 col-sm-12 border-right">
                <label class="q-label required">Type</label>
                <div class="form-check">
                    <input class="form-check-input" name="type" required type="radio" v-model="question.type" value="TEXT">
                    <label class="form-check-label">
                        Text
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" name="type" required type="radio" v-model="question.type" value="RADIO">
                    <label class="form-check-label">
                        Radio
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" name="type" required type="radio" v-model="question.type" value="CHECKBOX">
                    <label class="form-check-label">
                        Checkbox
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" name="type" required type="radio" v-model="question.type" value="NONE">
                    <label class="form-check-label">
                        None
                    </label>
                </div>
            </div>

            <div class="form-group col-md-3 col-sm-12 border-right">
                <label class="q-label required">Attachments?</label>
                <div class="form-check">
                    <input :value="true" class="form-check-input" name="attachments" required type="radio" v-model="question.attachments">
                    <label class="form-check-label">
                        Yes
                    </label>
                </div>
                <div class="form-check">
                    <input :value="false" class="form-check-input" name="attachments" required type="radio" v-model="question.attachments">
                    <label class="form-check-label">
                        No
                    </label>
                </div>
            </div>

            <div class="form-group col-md-3 col-sm-12 border-right">
                <label class="q-label required">Index</label>
                <input class="form-control" name="attachments" required type="number" v-model="question.index">
            </div>

            <div class="form-group col-12">
                <button class="btn btn-sm border btn-primary float-right" title="Submit" type="submit">
                    Submit
                </button>
                <button @click="reset" class="btn btn-sm border btn-secondary float-right mr-2" title="Reset" type="button">
                    Reset
                </button>
            </div>
        </form>
        <hr class="mt-0 mb-3">
        <template v-if="['RADIO','CHECKBOX'].includes(question.type)">
            <div class="form-group">
                <div class="float-left" role="group">
                    <h6>Options</h6>
                </div>
                <div class="btn-group float-right" role="group">
                    <button class="btn btn-sm border btn-success" data-target="#systemO" data-toggle="modal" title="Add System Option" type="button" v-if="!survey.is_deleted">
                        <font-awesome-icon icon="server"/>
                    </button>
                    <button class="btn btn-sm border btn-success" data-target="#customO" data-toggle="modal" title="Add Custom Option" type="button" v-if="!survey.is_deleted">
                        <font-awesome-icon icon="chalkboard-teacher"/>
                    </button>
                </div>
            </div>

            <div class="table table-responsive mb-5">
                <table class="table border-top mt-1">
                    <thead>
                    <tr>
                        <th class="border-top-0">Order</th>
                        <th class="border-top-0">Description</th>
                        <th class="border-top-0">Value</th>
                        <th class="border-top-0 text-center">Type</th>
                        <th class="border-top-0 text-center" v-if="currentUser.role === 'ADMIN'">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(option,index) in question.options">
                        <td class="wd-75">
                            {{option.index}}
                            <a @click="move(option.id, 'UP')" class="ml-2" href="javascript:void(0)" title="Move Up" v-if="option.index !== 1">
                                <font-awesome-icon icon="arrow-up"/>
                            </a>
                            <a @click="move(option.id, 'DOWN')" class="ml-2" href="javascript:void(0)" title="Move Down" v-if="option.index!== question.options.length">
                                <font-awesome-icon icon="arrow-down"/>
                            </a>
                        </td>
                        <td>{{option.description}}</td>
                        <td>{{option.value}}</td>
                        <td class="text-center">
                            <font-awesome-icon class="text-primary" icon="server" title="System Option" v-if="option.type === 'SYSTEM'"/>
                            <font-awesome-icon class="text-primary" icon="chalkboard-teacher" title="Custom Option" v-if="option.type === 'CUSTOM'"/>
                        </td>
                        <td class="text-center">
                            <a class="mr-2" href="javascript:void(0)" title="Edit Question" v-if="option.type === 'CUSTOM'">
                                <font-awesome-icon icon="edit"/>
                            </a>
                            <a @click="confirmDeleteOption(option.id)" href="javascript:void(0)" title="Delete Question" v-if="survey.status === 'UNLOCKED'">
                                <font-awesome-icon class="text-danger" icon="trash"/>
                            </a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <div aria-hidden="true" aria-labelledby="systemOLabel" class="modal fade" id="systemO" role="dialog" tabindex="-1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header p-2">
                        <h6 class="modal-title ml-2" id="systemOLabel">Select a system question</h6>
                        <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <v-select :filterable="false" :options="systemOptions" @search="onSystemSearch" label="id" placeholder="Search system options" v-model="optionid">
                            <template slot="no-options">
                                type to search system options
                            </template>
                            <template slot="option" slot-scope="option">
                                <div class="d-center">
                                    Description : {{ option.description }}<br>
                                    Value: {{ option.value }}
                                </div>
                            </template>
                            <template slot="selected-option" slot-scope="option">
                                <div class="selected d-center">
                                    {{ option.description }}
                                </div>
                            </template>
                        </v-select>
                    </div>
                    <div class="modal-footer p-1">
                        <button @click="cancel" class="btn btn-sm btn-secondary mt-0 mb-0" data-dismiss="modal" type="button">Cancel</button>
                        <button @click="saveOption" class="btn btn-sm btn-primary mt-0 mb-0 mr-0" data-dismiss="modal" type="button">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
        <div aria-hidden="true" aria-labelledby="customOLabel" class="modal fade" id="customO" role="dialog" tabindex="-1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header p-2">
                        <h6 class="modal-title ml-2" id="customOLabel">Select a system question</h6>
                        <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <v-select :filterable="false" :options="customOptions" @search="onCustomSearch" class="mb-2" label="id" placeholder="Search custom options" v-model="optionid">
                            <template slot="no-options">
                                type to search system options
                            </template>
                            <template slot="option" slot-scope="option">
                                <div class="d-center">
                                    Description : {{ option.description }}<br>
                                    Value: {{ option.value }}
                                </div>
                            </template>
                            <template slot="selected-option" slot-scope="option">
                                <div class="selected d-center">
                                    {{ option.description }}
                                </div>
                            </template>
                        </v-select>
                        <div class="separator font-weight-light">Or create a custom option</div>
                        <label class="q-label required">Value</label>
                        <textarea class="form-control" placeholder="Enter option value" v-model="option.value"></textarea>
                        <label class="q-label required mt-2">Description</label>
                        <textarea class="form-control" placeholder="Enter option description" v-model="option.description"></textarea>
                    </div>
                    <div class="modal-footer p-1">
                        <button @click="cancel" class="btn btn-sm btn-secondary mt-0 mb-0" data-dismiss="modal" type="button">Cancel</button>
                        <button @click="saveOption" class="btn btn-sm btn-primary mt-0 mb-0 mr-0" data-dismiss="modal" type="button">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
        <confirm :show="confirmShow" @cancel="cancel" @confirm="deleteOption" body="This operation is permanent. Are you sure?" title="Delete option"/>
    </div>
    <div v-else>
        Read Only
    </div>
</template>

<script>
    import EventBus from "../../../event-bus";
    import {mapGetters} from "vuex";
    import Confirm from "../../Confirm";

    let _question = {};

    export default {
        name: "SurveyQuestion",
        props: ["surveyid", "questionid"],
        components: {Confirm},
        computed: {
            ...mapGetters(['currentUser'])
        },
        watch: {
            "optionid": function(nv, ov) {
                if(nv) {
                    this.option = {
                        value: null,
                        description: null
                    }
                }
            },
            "option.value": function(nv, ov) {
                if(nv) {
                    this.optionid = null
                }
            },
            "option.description": function(nv, ov) {
                if(nv) {
                    this.optionid = null
                }
            },
        },
        data() {
            return {
                survey: {},
                question: {
                    options: []
                },
                systemOptions: [],
                customOptions: [],
                showAddSection: false,
                optionType: 'SYSTEM',
                optionid: null,
                option: {
                    value: null,
                    description: null
                },
                confirmShow: false
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            async init() {
                await this.getSurvey();
                await this.getQuestion();
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
            async getQuestion() {
                try {
                    EventBus.$emit("openLoaded", "Fetching question")
                    let reply = await this.$http(`/surveys/${this.surveyid}/questions/${this.questionid}`);
                    if(reply.data) {
                        _question     = {...reply.data};
                        this.question = reply.data;
                    }
                } catch(e) {
                    this.$toastr.e(e.response.data.message, "Error");
                    await this.$router.push({name: 'survey', params: {id: this.surveyid}});
                } finally {
                    EventBus.$emit("closeLoader");
                }
            },
            async submit() {
                try {
                    EventBus.$emit("openLoader", "Modifying question");
                    if(_question.index !== this.question.index) {
                        await this.$http.post(`surveys/${this.surveyid}/questions/${this.questionid}/reorder`, {index: this.question.index});
                    }
                    await this.$http.put(`surveys/${this.surveyid}/questions/${this.questionid}`, {
                        description: this.question.description,
                        note: this.question.note,
                        mandatory: this.question.mandatory,
                        type: this.question.type,
                        attachments: this.question.attachments
                    });
                    await this.getQuestion();
                } catch(e) {
                    this.$toastr.e(e.response.data.message, "Error");
                } finally {
                    EventBus.$emit("closeLoader");
                }
            },
            reset() {
                this.question = {..._question};
            },
            async move(oid, direction) {
                try {
                    EventBus.$emit("openLoader", "Reordering option");
                    await this.$http.post(`surveys/${this.surveyid}/questions/${this.questionid}/options/${oid}/reorder`, {direction: direction});
                    await this.getQuestion();
                } catch(e) {
                    console.log(e);
                } finally {
                    EventBus.$emit("closeLoader");
                }
            },
            confirmDeleteOption(optionid) {
                this.confirmShow = true;
                this.optionid    = optionid;
            },
            async onSystemSearch(search, loading) {
                loading(true);
                let reply          = await this.$http.get(`/options/system`, {params: {string: search}});
                this.systemOptions = reply.data;
                loading(false);
            },
            async onCustomSearch(search, loading) {
                loading(true);
                let reply          = await this.$http.get(`/surveys/${this.surveyid}/options`, {params: {string: search}});
                this.customOptions = reply.data;
                loading(false);
            },
            async saveOption() {
                try {
                    let body = {};
                    if(this.optionid) {
                        body.optionid = this.optionid.id;
                    } else {
                        body = {...this.option};
                    }
                    EventBus.$emit("openLoader", "Adding option");
                    await this.$http.post(`/surveys/${this.surveyid}/questions/${this.questionid}/options`, body);
                    await this.getQuestion();
                } catch(e) {
                    if(e.response.data.routine === '_bt_check_unique') {
                        this.$toastr.e("Option already added", "Error");
                    } else {
                        this.$toastr.e("Internal Server Error", "Error");
                    }
                } finally {
                    this.cancel();
                    EventBus.$emit("closeLoader");
                }
            },
            cancel() {
                this.optionid      = null;
                this.systemOptions = [];
                this.customOptions = [];
                this.option        = {
                    description: null,
                    value: null
                },
                this.confirmShow = false;
            },
            async deleteOption() {
                try {
                    EventBus.$emit("openLoader", "Deleting option");
                    await this.$http.delete(`/surveys/${this.surveyid}/questions/${this.questionid}/options/${this.optionid}`);
                    await this.getQuestion();
                } catch(e) {
                    this.$toastr.e("Internal Server Error","Error");
                } finally {
                    this.cancel();
                    EventBus.$emit("closeLoader");
                }
            }
        }
    }
</script>

<style scoped>

</style>