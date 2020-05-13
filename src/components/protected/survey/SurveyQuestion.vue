<template>
    <div>
        <div class="row p-0">
            <h4 class="card-title font-weight-normal mb-2 col-6">Question</h4>
            <h4 class="text-right col-6">
                <router-link :to="{name:'survey', params: { id: surveyid}}" title="Back">
                    <font-awesome-icon icon="arrow-left"/>
                </router-link>
            </h4>
        </div>
        <h6 class="card-subtitle font-weight-normal mb-3">Survey details</h6>
        <form>
            <div class="row">
                <dl class="col-lg-6 col-md-6 col-sm-6 col-xs-12 border-right">
                    <dt>Description</dt>
                    <dd><textarea class="form-control" v-model="question.description"/></dd>
                </dl>
                <dl class="col-lg-6 col-md-6 col-sm-6 col-xs-12 border-right">
                    <dt>Note</dt>
                    <dd><textarea class="form-control" v-model="question.note"/></dd>
                </dl>
            </div>
        </form>
    </div>
</template>

<script>
    import EventBus from "../../../event-bus";

    export default {
        name: "SurveyQuestion",
        props: ["surveyid", "questionid"],
        data() {
            return {
                question: {}
            }
        },
        mounted() {
            this.getQuestion();
        },
        methods: {
            async getQuestion() {
                try {
                    EventBus.$emit("openLoaded", "Fetching question")
                    let reply = await this.$http(`/surveys/${this.surveyid}/questions/${this.questionid}`);
                    if(reply.data) {
                        this.question = reply.data;
                    }
                } catch(e) {

                } finally {
                    EventBus.$emit("closeLoader");
                }
            }
        }
    }
</script>

<style scoped>

</style>