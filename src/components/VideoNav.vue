<template>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid navbar-container">
            <form v-on:submit.prevent="changeTitle" class="input-group input-group-sm w-75">
                <input
                    type="text" class="form-control"
                    placeholder="Add a Title" v-model="titleEditInput"
                    title="Edit Video Title"
                >
                <button
                    type="button" :class="editTitleBtnClass"
                    @click="changeTitle"
                    :disabled="!isTitleEditing"
                    title="Save Video Title"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                    </svg>
                </button>
            </form>

            <button type="button" @click="playVideo" class="btn btn-success btn-sm" title="Play Video">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-btn" viewBox="0 0 16 16">
                    <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                </svg>
            </button>

            <RemoveButton @remove-confirmed="removeVideo" :fillIcon="true" :tooltip="`Remove Video`"/>
        </div>
    </nav>
</template>

<style scoped>
.navbar-container {
    display: flex;
}
</style>

<script>
import RemoveButton from "./RemoveButton.vue";

export default {
    props: ['videoIdProp', 'titleProp'],
    emits: ['remove-video', 'play-video'],
    components: {RemoveButton},
    data () {
        return {
            titleEditInput: this.titleProp
        }
    },
    computed: {
        isTitleEditing() {
            return this.titleProp !== this.titleEditInput;
        },
        editTitleBtnClass ()  {
            return ['btn', {
                'btn-secondary': !this.isTitleEditing,
                'btn-success': this.isTitleEditing
            }]
        }
    },
    methods: {
        playVideo() {
            this.$emit('play-video');
        },
        removeVideo() {
            // emit by videoList to Popup
            this.$parent.$parent.$emit('remove-video', {
                videoId: this.videoIdProp
            });
        },
        changeTitle() {
            // Only send update even if there's a change.
            // Need this check in case user presses enter key on form
            if (this.isTitleEditing) {
                // emit by videoList to Popup
                this.$parent.$parent.$emit('update-title', {
                    videoId: this.videoIdProp,
                    title: this.titleEditInput
                });
            }
        }
    }
}
</script>
