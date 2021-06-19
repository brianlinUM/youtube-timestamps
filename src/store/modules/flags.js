const state = () => {
    const isYouTubeVideo = false;
    const contentScriptReady = false;
    return {isYouTubeVideo, contentScriptReady};
}

const mutations = {
    setIsYouTubeVideo (state, status) {
        state.isYouTubeVideo = status;
    },
    setContentScriptReady (state, status) {
        state.contentScriptReady = status;
    }
}

export default {
    namespaced: false,
    state,
    mutations
}
