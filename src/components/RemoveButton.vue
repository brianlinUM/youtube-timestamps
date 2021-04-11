<template>
    <!-- emit event to grandparent as it handles the data -->
    <button type="button" :class="removeBtnClass"
        @click="updateClickState"
        :disabled='disableBtn'
    >
        <svg v-show="!removeClicked" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
        <!-- confirm -->
        <svg v-show="removeClicked" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
        </svg>
        {{ removeBtnText }}
    </button>
</template>

<script>
export default {
    props: ['btnText', 'btnTextConfirm', 'disableBtn'],
    emits: ['remove-confirmed'],
    data () {
        return {
            removeClicked: false,
            timeoutHandle: null
        }
    },
    computed: {
        removeBtnClass() {
            return ['btn', 'btn-sm', {
                'btn-danger': !this.removeClicked,
                'btn-warning': this.removeClicked
            }]
        },
        removeBtnText() {
            return this.removeClicked ? this.btnTextConfirm : this.btnText;
        }
    },
    methods: {
        updateClickState() {
            if (this.timeoutHandle) {
                clearTimeout(this.timeoutHandle);
                this.timeoutHandle = null;
            }

            if ( this.removeClicked ) {
                // emit by videoList to Popup
                this.$emit('remove-confirmed');
                this.removeClicked = false; // reset
            } else {
                this.removeClicked = true;
                this.timeoutHandle = setTimeout(() => {
                    this.removeClicked = false
                }, 1000);
            }
        }
    }
}
</script>
