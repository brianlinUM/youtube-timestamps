<template>
    <div class="input-group input-group-sm">
        <input
            type="text" class="form-control"
            placeholder="Title Search" v-model="searchQuery"
            title="Search Videos"
        >
        <span class="input-group-text">
            <!-- search icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
        </span>
    </div>
</template>

<style scoped>
</style>

<script>
export default {
    computed: {
        // two way binding to vuex search module.
        // need this solution since vuex is unidirectional.
        // https://dilshankelsen.com/v-model-with-vuex/
        searchQuery: {
            get () {
                // states by default are module namespaced
                return this.$store.state.searchQueryStore.searchQuery;
            },
            set (newQuery) {
                // commits by default have global namespace
                this.$store.commit('setSearchQuery', newQuery);
            }
        }
    }
}
</script>