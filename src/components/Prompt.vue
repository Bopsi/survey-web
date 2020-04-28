<template>
    <div aria-hidden="true" aria-labelledby="surveyPromptLabel" class="modal fade" id="surveyPrompt" role="dialog" tabindex="-1">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header p-2">
                    <h6 class="modal-title ml-2" id="surveyPromptLabel">{{title}}</h6>
                    <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>{{body}}</p>
                    <textarea class="form-control" v-if="type === 'LARGE_TEXT'" v-model="data"></textarea>
                    <input class="form-control" type="text" v-if="type === 'TEXT'" v-model="data"/>
                    <input class="form-control" type="number" v-if="type === 'NUMBER'" v-model="data"/>
                    <input class="form-control" type="date" v-if="type === 'DATE'" v-model="data"/>
                </div>
                <div class="modal-footer p-1">
                    <button @click="cancel" class="btn btn-sm btn-secondary mt-0 mb-0" data-dismiss="modal" type="button">Cancel</button>
                    <button @click="confirm" class="btn btn-sm btn-primary mt-0 mb-0 mr-0" data-dismiss="modal" type="button">Confirm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';

    export default {
        name: "Prompt",
        props: ["show", "title", "body", "type"],
        data() {
            return {
                data: null
            }
        },
        watch: {
            "show": function(nv, ov) {
                if(nv === true) {
                    $('#surveyPrompt').modal('show');
                } else {
                    $('#surveyPrompt').modal({'show': false});
                }
            }
        },
        mounted() {
            $('#surveyPrompt').on('hidden.bs.modal', (e) => {
                this.data = null;
                this.cancel();
            })
        },
        methods: {
            confirm() {
                this.$emit("confirm", JSON.parse(JSON.stringify(this.data)));
            },
            cancel() {
                this.$emit("cancel");
            }
        }
    }
</script>

<style scoped>

</style>