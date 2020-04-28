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
                <button class="btn btn-sm border btn-danger" title="Delete Survey" type="button" @click="confirmDelete" v-if="!survey.is_deleted">
                    <font-awesome-icon icon="trash"/>
                </button>
                <button class="btn btn-sm border btn-success" title="Add Question" type="button" v-if="survey.status === 'UNLOCKED' && !survey.is_deleted">
                    <font-awesome-icon icon="plus"/>
                </button>
                <button @click="confirmLock" class="btn btn-sm border btn-primary" title="Lock Survey" type="button" v-if="survey.status === 'UNLOCKED' && !survey.is_deleted">
                    <font-awesome-icon icon="lock"/>
                </button>
                <button @click="promptVersion" class="btn btn-sm border btn-primary" title="Create New Version" type="button" v-if="survey.status === 'LOCKED'">
                    <font-awesome-icon icon="code-branch"/>
                </button>
            </div>
        </div>
        <hr class="m-t-35 mb-0">

        <div class="table table-responsive" v-if="view === 'LIST'">
            <table class="table">
                <thead>
                <tr>
                    <th class="border-top-0">Id</th>
                    <th class="border-top-0">Description</th>
                    <th class="border-top-0">Note</th>
                    <th class="border-top-0 text-center">Type</th>
                    <th class="border-top-0">Mandatory?</th>
                    <th class="border-top-0">Attachments?</th>
                    <th class="border-top-0">Created At</th>
                    <th class="border-top-0">Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="question in survey.questions">
                    <td>{{question.id}}</td>
                    <td>{{question.description}}</td>
                    <td>{{question.note}}</td>
                    <td class="text-center">
                        <font-awesome-icon class="text-primary" icon="dot-circle" v-if="question.type === 'RADIO'"/>
                        <font-awesome-icon class="text-primary" icon="check-square" v-if="question.type === 'CHECKBOX'"/>
                        <font-awesome-icon class="text-primary" icon="keyboard" v-if="question.type === 'TEXT'"/>
                        <font-awesome-icon class="text-primary" icon="ban" v-if="question.type === 'NONE'"/>
                    </td>
                    <td>{{question.mandatory}}</td>
                    <td>{{question.attachments}}</td>
                    <td>{{question.created_at| timestamp}}</td>
                    <td>Action</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="mt-2" v-else>
            <div class="form-group col-md-6 col-sm-12 mb-4" v-for="(question,i) in survey.questions">
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

        <cofirm :body="confirmBody" :show="confirmShow" :title="confirmTitle" @cancel="cancel" @confirm="lock" v-if="modal === 'LOCK'"/>
        <cofirm :body="confirmBody" :show="confirmShow" :title="confirmTitle" @cancel="cancel" @confirm="deleteSurvey" v-if="modal === 'DELETE'"/>
        <prompt :body="promptBody" :show="promptShow" :title="promptTitle" @cancel="cancel" @confirm="version" type="LARGE_TEXT"/>
    </div>
</template>

<script>
    import EventBus from "../../../event-bus";
    import Cofirm from "../../Cofirm";
    import Prompt from "../../Prompt";

    export default {
        name: "Survey",
        components: {Prompt, Cofirm},
        props: ["id"],
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
                view: 'LIST',
                modal: 'LOCK',
                confirmShow: false,
                confirmTitle: null,
                confirmBody: null,
                promptShow: false,
                promptTitle: null,
                promptBody: null
            }
        },
        watch: {
            "id": function(nv, ov) {
                this.getSurvey();
            }
        },
        mounted() {
            this.getSurvey();
        },
        methods: {
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
            cancel() {
                this.confirmShow  = false;
                this.confirmTitle = null;
                this.confirmBody  = null;
                this.promptShow   = false;
                this.promptTitle  = null;
                this.promptBody   = null;
            },
            async lock() {
                this.cancel();
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
                    EventBus.$emit('closeLoader');
                }
            },
            async version(description) {
                this.cancel();
                try {
                    EventBus.$emit('openLoader', 'Creating new version');
                    let reply = await this.$http.post(`surveys/${this.id}/version`, {description: description});
                    this.$toastr.s(`Version ${reply.data.id} created`, "Success");
                    await this.$router.push({name: 'survey', params: {id: reply.data.id}});
                } catch(e) {
                    this.$toastr.e(e.message, "Error")
                } finally {
                    EventBus.$emit('closeLoader');
                }
            },
            async deleteSurvey() {
                try {
                    EventBus.$emit('openLoader', 'Deleting survey');
                    this.cancel();
                    await this.$http.delete(`surveys/${this.id}`);
                    this.$toastr.s("Survey deleted", "Success");
                    await this.$router.push({name: 'surveys'});
                } catch(e) {
                    this.$toastr.e(e.message, "Error");
                } finally {
                    EventBus.$emit('closeLoader');
                }
            }
        }
    }
</script>

<style scoped>

</style>