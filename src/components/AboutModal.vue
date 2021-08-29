<template>
    <div class="modal fade" id="about-modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div id="about-modal-header" class="modal-header py-2">
                    <h5 class="modal-title">
                        About Me
                    </h5>
                </div>
                <div class="modal-body py-2">
                    <p>
                        Hello! I'm Brian ~nice to meet you \(^o^)/
                    </p>
                    <p>
                        Thank you for using my chrome extension!
                        This was a personal project developed for fun and learning. I was inspired
                        to start this project while reviewing a very long university lecture recording
                        on Youtube. I agonized through watching numerous useless sections to find a
                        single 1-2 minute point in the lecture.
                    </p>
                    <p>
                        Anyway, please let me know how to improve! My email is:
                        brianlin.software@gmail.com
                    </p>
                    <p>
                        If you're interested in the code, take a look at my 
                        <a href="https://github.com/brianlinUM/youtube-timestamps" target="_blank">Github</a>
                    </p>
                    <p>
                        Thank you!
                    </p>
                    
                    
                </div>
                <div class="modal-footer py-2">
                    <button
                        type="button" class="btn btn-sm btn-secondary me-3" data-bs-dismiss="modal"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#about-modal-header {
    background-color: #3399FF;
}
</style>
