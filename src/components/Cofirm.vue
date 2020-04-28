<template>
    <div aria-hidden="true" aria-labelledby="surveyModalLabel" class="modal fade" id="surveyModal" role="dialog" tabindex="-1">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header p-2">
                    <h6 class="modal-title ml-2" id="surveyModalLabel">{{title}}</h6>
                    <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>{{body}}</p>
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
        name: "Cofirm",
        props: ["show", "title", "body"],
        watch: {
            "show": function(nv, ov) {
                if(nv === true) {
                    $('#surveyModal').modal('show');
                } else {
                    $('#surveyModal').modal({'show': false});
                }
            }
        },
        mounted() {
            $('#surveyModal').on('hidden.bs.modal', (e) => {
                this.cancel();
            })
        },
        methods: {
            confirm() {
                this.$emit("confirm");
            },
            cancel() {
                this.$emit("cancel");
            }
        }
    }
</script>

<style scoped>

</style>