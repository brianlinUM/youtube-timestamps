<template>
    <div class="card">
        <div class="card-header d-flex justify-content-between">
            <!-- time -->
            <a class="videoTimestamp" href="#" @click="changeTime(timestamp)" title="Go to Timestamp">
                {{convertTimeFormat(timestamp)}}
            </a>
            <!-- edit button -->
            <button type="button" :class="editLabelBtnClass" @click="editLabel">
                <!-- edit pen icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                </svg>
                {{ isLabelEditing ? "Cancel Edit" : "Edit Label"}}
            </button>
            <RemoveButton
                @remove-confirmed="removeTimestampSynced({videoId, timestamp})"
                :tooltip="`Remove Timestamp`"
            />
        </div>
        <!-- Timestamp Label -->
        <div class="card-body p-2">
            <p v-show="!isLabelEditing" class="m-0 p-0"> {{ label === "" ? "Add a Label" : label }} </p>
            <!-- Only show edit text area if user is editing -->
            <div v-show="isLabelEditing">
                <textarea
                    class="form-control p-2" id="edit-label-area" rows="2"
                    v-model='labelEditInput' placeholder="Add a Label"
                    title="Edit Timestamp Label"
                >
                </textarea>
                <!-- save edit button -->
                <button
                    type='button'
                    class="
                            btn btn-sm btn-success
                            position-relative start-50 translate-middle-x mt-2
                        "
                    @click="saveLabelEdit"
                >
                    <!-- confirm tick icon -->
                    <svg v-show="isLabelEditing" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    Save Changes
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions} from "vuex";
import RemoveButton from './RemoveButton.vue';
import queryCurrentTab from "../common/obtainCurrentTab.js";

export default {
    props: ['videoId', 'timestamp', 'label'],
    emits: ['change-video-and-time'],
    components: {RemoveButton},
    data () {
        return {
            isLabelEditing: false,
            labelEditInput: this.label   
        }
    },
    computed: {
        editLabelBtnClass() {
            return ['btn', 'btn-sm', {
                'btn-primary': !this.isLabelEditing,
                'btn-warning': this.isLabelEditing
            }]
        }
    },
    methods: {
        ...mapActions(['removeTimestampSynced', 'updateTimestampLabelSynced']),
        // converts from seconds to HH:MM:SS
        // https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
        convertTimeFormat(seconds) {
            let dateObj = new Date(0);
            dateObj.setSeconds(seconds);
            return dateObj.toISOString().substr(11, 8);
        },
        // sends request to content listener to change current video time
        changeTime (newTime) {
            queryCurrentTab((tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(
                        tabs[0].id, {msg: "change-time", timestamp: newTime}
                    );
                } else {
                    this.$emit('change-video-and-time', {newTime});
                }
            }, "https://www.youtube.com/watch?v=" + this.videoId + "*");
        },
        editLabel() {
            if (this.isLabelEditing) {
                // reset input when cancelled
                this.labelEditInput = this.label
            }
            this.isLabelEditing = !this.isLabelEditing;
        },
        saveLabelEdit() {
            this.updateTimestampLabelSynced({
                videoId: this.videoId,
                timestamp: this.timestamp,
                label: this.labelEditInput
            });
            // don't need to reset labelEditInput since it will be updated
            // when this.label prop is updated.
            this.isLabelEditing = false;
        }
    }
}
</script>
