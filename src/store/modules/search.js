/* eslint-disable no-param-reassign */
// Module for holding search bar input.
// Search filtering is implemented in vuex,
// via a getter in the vuex store module, and
// called in the popup.

const state = () => {
  const titleQuery = '';
  return { titleQuery };
};

const getters = {
  // normalized query string, for use in search
  // filter in videos module.
  titleQueryString: (_state) => _state.titleQuery.toLowerCase(),
};

const mutations = {
  setTitleQuery(_state, newQuery) {
    _state.titleQuery = newQuery;
  },
};

export default {
  namespaced: false,
  state,
  getters,
  mutations,
};
