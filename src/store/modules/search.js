// Module for holding search bar input.
// Search filtering is implemented in vuex,
// via a getter in the vuex store module, and
// called in the popup.

const state = () => {
    const searchQuery = "";
    return {searchQuery};
}

const getters = {
    // normalized query string, for use in search
    // filter in videos module.
    queryString: (state) => {
        return state.searchQuery.toLowerCase();
    }
}

const mutations = {
    setSearchQuery (state, newQuery) {
        state.searchQuery = newQuery;
    }
}

export default {
    namespaced: false,
    state,
    getters,
    mutations
}
