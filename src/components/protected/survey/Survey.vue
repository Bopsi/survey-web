<template>
    <div>
        <div class="row p-0">
            <h4 class="card-title font-weight-normal mb-2 col-6">Survey</h4>
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

        <div class="form-group">
            <div aria-label="Basic example" class="btn-group float-left" role="group">
                <button :class="{'btn-light' : view === 'FORM', 'btn-primary': view === 'LIST'}" @click="setView('LIST')" class="btn btn-sm border" title="List View" type="button">
                    <font-awesome-icon icon="table"/>
                </button>
                <button :class="{'btn-light' : view === 'LIST', 'btn-primary': view === 'FORM'}" @click="setView('FORM')" class="btn btn-sm border" title="Form View" type="button">
                    <font-awesome-icon icon="clipboard-list"/>
                </button>
            </div>
            <div aria-label="Basic example" class="btn-group float-right" role="group">
                <template v-if="currentUser.role === 'ADMIN'">
                    <button @click="confirmDelete" class="btn btn-sm border btn-danger" title="Delete Survey" type="button" v-if="!survey.is_deleted">
                        <font-awesome-icon icon="trash"/>
                    </button>
                    <button class="btn btn-sm border btn-success" data-target="#addQuestionModal" data-toggle="modal" title="Add Question"
                            type="button" v-if="survey.status === 'UNLOCKED' && !survey.is_deleted">
                        <font-awesome-icon icon="plus"/>
                    </button>
                    <button @click="confirmLock" class="btn btn-sm border btn-primary" title="Lock Survey" type="button" v-if="survey.status === 'UNLOCKED' && !survey.is_deleted">
                        <font-awesome-icon icon="lock"/>
                    </button>
                    <button @click="promptVersion" class="btn btn-sm border btn-primary" title="Create New Version" type="button" v-if="survey.status === 'LOCKED'">
                        <font-awesome-icon icon="code-branch"/>
                    </button>
                </template>
                <template v-if="survey.status === 'LOCKED'">
                    <router-link :to="{name: 'survey-records', params : {id: survey.id}}" class="btn btn-sm border btn-success" title="Records">
                        <font-awesome-icon icon="clipboard-check"/>
                    </router-link>
                </template>
            </div>
        </div>
        <hr class="m-t-35 mb-0">

        <div class="table table-responsive" v-if="view === 'LIST'">
            <table class="table">
                <thead>
                <tr>
                    <th class="border-top-0">Order</th>
                    <th class="border-top-0">Description</th>
                    <th class="border-top-0">Note</th>
                    <th class="border-top-0 text-center">Type</th>
                    <th class="border-top-0">Options</th>
                    <th class="border-top-0">Mandatory?</th>
                    <th class="border-top-0">Attachments?</th>
                    <th class="border-top-0">Created At</th>
                    <th class="border-top-0 text-center" v-if="currentUser.role === 'ADMIN'">Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(question,index) in questions">
                    <td class="wd-75">
                        {{question.index}}
                        <a @click="move(question.id, 'UP')" class="ml-2" href="javascript:void(0)" title="Move Up" v-if="survey.status === 'UNLOCKED' && question.index !== 1">
                            <font-awesome-icon icon="arrow-up"/>
                        </a>
                        <a @click="move(question.id, 'DOWN')" class="ml-2" href="javascript:void(0)" title="Move Down" v-if="survey.status === 'UNLOCKED' && question.index!== questions.length">
                            <font-awesome-icon icon="arrow-down"/>
                        </a>
                    </td>
                    <td>{{question.description}}</td>
                    <td>{{question.note}}</td>
                    <td class="text-center">
                        <font-awesome-icon class="text-primary" icon="dot-circle" v-if="question.type === 'RADIO'"/>
                        <font-awesome-icon class="text-primary" icon="check-square" v-if="question.type === 'CHECKBOX'"/>
                        <font-awesome-icon class="text-primary" icon="keyboard" v-if="question.type === 'TEXT'"/>
                        <font-awesome-icon class="text-primary" icon="ban" v-if="question.type === 'NONE'"/>
                    </td>
                    <td>
                        <template v-if="['TEXT','NONE'].includes(question.type)">N/A</template>
                        <template v-else>{{question.options.length}}</template>
                    </td>
                    <td>{{question.mandatory}}</td>
                    <td>{{question.attachments}}</td>
                    <td>{{question.created_at| timestamp}}</td>
                    <td class="text-center" v-if="currentUser.role === 'ADMIN'">
                        <router-link :to="{name: 'survey-question', params: {surveyid: id, questionid: question.id}}" class="mr-2" title="Edit Question" v-if="survey.status === 'UNLOCKED'">
                            <font-awesome-icon icon="edit"/>
                        </router-link>
                        <router-link :to="{name: 'survey-question', params: {surveyid: id, questionid: question.id}}" class="mr-2" title="View Question" v-if="survey.status === 'LOCKED'">
                            <font-awesome-icon icon="eye"/>
                        </router-link>
                        <a @click="confirmDeleteQuestion(question.id)" href="javascript:void(0)" title="Delete Question" v-if="survey.status === 'UNLOCKED'">
                            <font-awesome-icon class="text-danger" icon="trash"/>
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="mt-2" v-else>
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
        <div class="clearfix mb-5"></div>

        <!-- Add Survey Modal -->
        <div aria-hidden="true" aria-labelledby="addQuestionModalLabel" class="modal fade" id="addQuestionModal" role="dialog" tabindex="-1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header p-2">
                        <h6 class="modal-title ml-2" id="addQuestionModalLabel">Create new question</h6>
                        <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="addQuestion">
                        <div class="modal-body">
                            <div class="form-group">
                                <label class="q-label required">Description</label>
                                <textarea class="form-control" name="description" placeholder="Enter question name" required v-model="question.description"></textarea>
                            </div>

                            <div class="form-group">
                                <label class="q-label">Note</label>
                                <textarea class="form-control" name="note" placeholder="Enter question note" v-model="question.note"></textarea>
                            </div>

                            <div class="form-group row">
                                <div class="col-sm-12 col-md-4">
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

                                <div class="col-sm-12 col-md-4">

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

                                <div class="col-sm-12 col-md-4">
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

        <confirm :body="confirmBody" :show="confirmShow" :title="confirmTitle" @cancel="cancel" @confirm="lock" v-if="modal === 'LOCK'"/>
        <confirm :body="confirmBody" :show="confirmShow" :title="confirmTitle" @cancel="cancel" @confirm="deleteSurvey" v-if="modal === 'DELETE'"/>
        <confirm :body="confirmBody" :show="confirmShow" :title="confirmTitle" @cancel="cancel" @confirm="deleteQuestion" v-if="modal === 'DELETE_Q'"/>
        <prompt :body="promptBody" :show="promptShow" :title="promptTitle" @cancel="cancel" @confirm="version" type="LARGE_TEXT"/>
    </div>
</template>

<script>
    import EventBus from "../../../event-bus";
    import Confirm from "../../Confirm";
    import Prompt from "../../Prompt";
    import $ from "jquery";
    import {mapGetters} from "vuex";

    export default {
        name: "Survey",
        components: {Prompt, Confirm},
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
                    created_by: 1
                },
                questions: [],
                question: {
                    description: null,
                    note: null,
                    mandatory: null,
                    type: null,
                    attachments: null
                },
                view: 'LIST',
                modal: 'LOCK',
                confirmShow: false,
                confirmTitle: null,
                confirmBody: null,
                promptShow: false,
                promptTitle: null,
                promptBody: null,
                questionid: null
            }
        },
        watch: {
            "id": function(nv, ov) {
                this.getSurvey();
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            async init() {
                await this.getSurvey();
                await this.getQuestions();
            },
            async getSurvey() {
                try {
                    EventBus.$emit('openLoader', 'Fetching survey');
                    const reply = await this.$http.get(`surveys/${this.id}`);
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
                    const reply = await this.$http.get(`surveys/${this.id}/questions`);
                    if(reply.data) {
                        this.questions = reply.data;
                    }
                } catch(e) {
                    this.$toastr.e("Internal server error", "Error");
                } finally {
                    EventBus.$emit('closeLoader');
                }
            },
            setView(view) {
                this.view = view;
            },
            confirmLock() {
                this.modal        = 'LOCK';
                this.confirmShow  = true;
                this.confirmTitle = "Lock Survey?";
                this.confirmBody  = "You will no longer be able to modify survey. Are you sure?";
            },
            promptVersion() {
                this.promptShow  = true;
                this.promptTitle = "Create a new version of this survey?";
                this.promptBody  = "Why are you creating a new version? If left blank, the system generated description will be saved";
            },
            confirmDelete() {
                this.modal        = 'DELETE';
                this.confirmShow  = true;
                this.confirmTitle = "Delete Survey?";
                this.confirmBody  = "You will no longer be able to modify or assess the survey. Are you sure?";
            },
            confirmDeleteQuestion(questionid) {
                this.modal        = 'DELETE_Q';
                this.confirmShow  = true;
                this.confirmTitle = "Delete question?";
                this.confirmBody  = "This operation is permanent. Are you sure?";
                this.questionid   = questionid;
            },
            cancel() {
                this.confirmShow  = false;
                this.confirmTitle = null;
                this.confirmBody  = null;
                this.promptShow   = false;
                this.promptTitle  = null;
                this.promptBody   = null;
                this.questionid   = null;
            },
            async lock() {
                try {
                    EventBus.$emit('openLoader', 'Locking survey');
                    const reply = await this.$http.post(`surveys/${this.id}/lock`);
                    this.survey = {
                        ...this.survey,
                        ...reply.data
                    }
                    this.$toastr.s("Survey locked", "Success");
                } catch(e) {
                    this.$toastr.e(e.message, "Error")
                } finally {
                    this.cancel();
                    EventBus.$emit('closeLoader');
                }
            },
            async version(description) {
                try {
                    EventBus.$emit('openLoader', 'Creating new version');
                    let reply = await this.$http.post(`surveys/${this.id}/version`, {description: description});
                    this.$toastr.s(`Version ${reply.data.id} created`, "Success");
                    await this.$router.push({name: 'survey', params: {id: reply.data.id}});
                } catch(e) {
                    this.$toastr.e(e.message, "Error");
                } finally {
                    this.cancel();
                    EventBus.$emit('closeLoader');
                }
            },
            async addQuestion()
            {
                $('#addQuestionModal').modal('toggle');
                try {
                    EventBus.$emit('openLoader', 'Creating question');
                    let reply = await this.$http.post(`surveys/${this.id}/questions`, this.question);
                    this.$toastr.s("Question created", "Success");
                    this.$router.push({ name: 'survey-question', params: { surveyid: this.id, questionid: reply.data.id}})
                } catch(e) {
                    this.$toastr.e(e.message, "Error")
                } finally {
                    this.question = {description: null, note: null, mandatory: null, type: null, attachments: null};
                    EventBus.$emit('closeLoader');
                }
            }
,
            async deleteSurvey() {
                try {
                    EventBus.$emit('openLoader', 'Deleting survey');
                    await this.$http.delete(`surveys/${this.id}`);
                    this.$toastr.s("Survey deleted", "Success");
                    await this.$router.push({name: 'surveys'});
                } catch(e) {
                    this.$toastr.e(e.message, "Error");
                } finally {
                    this.cancel();
                    EventBus.$emit('closeLoader');
                }
            },
            async deleteQuestion() {
                try {
                    EventBus.$emit("openLoader", "Deleting question")
                    await this.$http.delete(`surveys/${this.id}/questions/${this.questionid}`);
                    await this.getQuestions();
                } catch(e) {
                    console.log(e);
                } finally {
                    this.cancel();
                    EventBus.$emit("closeLoader");
                }
            },
            async move(qid, direction) {
                try {
                    EventBus.$emit("openLoader", "Reordering question");
                    await this.$http.post(`surveys/${this.id}/questions/${qid}/reorder`, {direction: direction});
                    await this.getQuestions();
                } catch(e) {
                    console.log(e);
                } finally {
                    EventBus.$emit("closeLoader");
                }
            }
        }
    }
</script>

<style scoped>

</style>